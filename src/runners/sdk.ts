import { query } from "@anthropic-ai/claude-agent-sdk";
import type {
  SDKMessage,
  SDKAssistantMessage,
  SDKResultMessage,
  SDKSystemMessage,
  Options,
  McpServerConfig,
} from "@anthropic-ai/claude-agent-sdk";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { loadTasks } from "../tasks/loader.js";
import { loadFixtures, resolvePrompt, generateRunId, formatCost, RESULTS_DIR } from "../config.js";
import type { TaskDefinition } from "../tasks/types.js";
import type { TaskResult, ToolCallLog, RunSummary } from "./types.js";
import { parseFilters, applyFilters, getVariantsForTask } from "./filters.js";

interface StepLog {
  type: string;
  toolName?: string;
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
  timestamp: number;
}

function buildMcpServers(
  tools: string[],
  fixtures: Record<string, string>
): Record<string, McpServerConfig> | undefined {
  const servers: Record<string, McpServerConfig> = {};

  // Determine which MCP servers we need based on tool prefixes
  // claude.ai built-in servers (Notion, Slack) need no config
  for (const tool of tools) {
    if (tool.startsWith("mcp__claude_ai_")) {
      continue;
    } else if (tool.startsWith("mcp__github__")) {
      servers["github"] = {
        type: "http",
        url: "https://api.githubcopilot.com/mcp",
        headers: {
          Authorization: `Bearer ${fixtures["GITHUB_PAT"] ?? ""}`,
        },
      };
    } else if (tool.startsWith("mcp__postgres__")) {
      servers["postgres"] = {
        command: "postgres-mcp",
        args: ["--access-mode=unrestricted"],
        env: {
          DATABASE_URI: fixtures["DATABASE_URL"] ?? "",
        },
      };
    }
  }

  return Object.keys(servers).length > 0 ? servers : undefined;
}

async function runSdkTask(
  task: TaskDefinition,
  variant: "cli" | "mcp",
  fixtures: Record<string, string>,
): Promise<TaskResult | null> {
  const variantDef = task.variants[variant];
  if (!variantDef) return null;

  const prompt = resolvePrompt(variantDef.prompt, fixtures);
  const steps: StepLog[] = [];
  const toolCalls: ToolCallLog[] = [];

  const options: Options = {
    cwd: process.cwd(),
    maxTurns: 20,
    permissionMode: "bypassPermissions",
    allowDangerouslySkipPermissions: true,
    allowedTools: variantDef.allowedTools,
    disallowedTools: variantDef.disallowedTools,
    mcpServers: variant === "mcp" ? buildMcpServers(variantDef.allowedTools ?? [], fixtures) : undefined,
  };

  console.log(`  Running ${task.id} [${variant}] via SDK...`);
  const start = performance.now();

  let resultMsg: SDKResultMessage | null = null;

  try {
    for await (const message of query({ prompt, options })) {
      const msg = message as SDKMessage;

      if (msg.type === "system" && (msg as SDKSystemMessage).subtype === "init") {
        const sysMsg = msg as SDKSystemMessage;
        steps.push({
          type: "system_init",
          timestamp: Date.now(),
        });
        console.log(`    Tools available: ${sysMsg.tools.length}`);
        console.log(`    MCP servers: ${sysMsg.mcp_servers.map((s) => `${s.name}(${s.status})`).join(", ") || "none"}`);
      }

      if (msg.type === "assistant") {
        const aMsg = msg as SDKAssistantMessage;
        const usage = aMsg.message.usage;

        steps.push({
          type: "assistant",
          inputTokens: usage.input_tokens,
          outputTokens: usage.output_tokens,
          cacheReadTokens: usage.cache_read_input_tokens ?? undefined,
          cacheCreationTokens: usage.cache_creation_input_tokens ?? undefined,
          timestamp: Date.now(),
        });

        // Extract tool use blocks from the assistant message
        for (const block of aMsg.message.content) {
          if (block.type === "tool_use") {
            toolCalls.push({
              toolName: block.name,
              success: true,
            });
          }
        }
      }

      if (msg.type === "result") {
        resultMsg = msg as SDKResultMessage;
      }
    }
  } catch (err) {
    console.error(`    Error: ${err}`);
  }

  const durationMs = Math.round(performance.now() - start);

  if (!resultMsg) {
    return {
      taskId: task.id,
      variant,
      pass: 2,
      output: "No result message received",
      usage: { inputTokens: 0, outputTokens: 0 },
      toolCalls,
      durationMs,
      success: false,
    };
  }

  const result: TaskResult = {
    taskId: task.id,
    variant,
    pass: 2,
    output: String((resultMsg as Record<string, unknown>).result ?? ""),
    usage: {
      inputTokens: resultMsg.usage.input_tokens,
      outputTokens: resultMsg.usage.output_tokens,
      cacheReadTokens: resultMsg.usage.cache_read_input_tokens,
      cacheCreationTokens: resultMsg.usage.cache_creation_input_tokens,
      totalCostUsd: resultMsg.total_cost_usd,
    },
    toolCalls,
    durationMs,
    success: !resultMsg.is_error,
  };

  // Write detailed step log alongside the result
  const stepsFilename = `${task.id}_${variant}_steps.json`;
  writeFileSync(
    resolve(RESULTS_DIR, runId, stepsFilename),
    JSON.stringify(
      {
        taskId: task.id,
        variant,
        steps,
        modelUsage: resultMsg.modelUsage,
      },
      null,
      2
    )
  );

  return result;
}

// --- Main ---

const filters = parseFilters(process.argv.slice(2));
// SDK runner only runs Layer 1 tasks
const tasks = applyFilters(loadTasks(), { ...filters, layer: 1 });
const fixtures = loadFixtures();
const runId = `sdk_${generateRunId()}`;
fixtures["RUN_ID"] = runId;

mkdirSync(resolve(RESULTS_DIR, runId), { recursive: true });

console.log(`\nSDK Benchmark Run: ${runId}`);
console.log(`Layer 1 tasks: ${tasks.length}`);
console.log(`Filters: service=${filters.service ?? "all"} variant=${filters.variant ?? "all"} id=${filters.id ?? "all"}\n`);

const results: TaskResult[] = [];

for (const task of tasks) {
  console.log(`[${task.id}] ${task.description}`);

  for (const variant of getVariantsForTask(task, filters.variant)) {
    const result = await runSdkTask(task, variant, fixtures);
    if (result) {
      results.push(result);

      const filename = `${task.id}_${variant}.json`;
      writeFileSync(
        resolve(RESULTS_DIR, runId, filename),
        JSON.stringify(result, null, 2)
      );

      const status = result.success ? "OK" : "FAIL";
      console.log(
        `    ${status} | ${result.durationMs}ms | ${result.usage.inputTokens}in/${result.usage.outputTokens}out | ${formatCost(result.usage.totalCostUsd)} | ${result.toolCalls.length} tool calls`
      );
    }
  }
}

// Write summary
const summary: RunSummary = {
  runId,
  timestamp: new Date().toISOString(),
  pass: 2,
  filters: { service: filters.service, variant: filters.variant, id: filters.id },
  totalTasks: results.length,
  results,
};

writeFileSync(
  resolve(RESULTS_DIR, runId, "_summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(`\nDone. ${results.length} results written to results/raw/${runId}/`);
