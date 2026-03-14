import { execFileSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { loadTasks } from "../tasks/loader.js";
import { loadFixtures, resolvePrompt, generateRunId, RESULTS_DIR } from "../config.js";
import type { TaskDefinition } from "../tasks/types.js";
import type { TaskResult, RunSummary } from "./types.js";
import { parseFilters, applyFilters, getVariantsForTask } from "./filters.js";

interface ClaudeResultMessage {
  type: "result";
  result: string;
  is_error: boolean;
  total_cost_usd?: number;
  duration_ms?: number;
  num_turns?: number;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
}

interface ClaudeMessage {
  type: string;
  [key: string]: unknown;
}

function extractResult(raw: string): ClaudeResultMessage {
  const messages = JSON.parse(raw) as ClaudeMessage[];
  const result = messages.find((m) => m.type === "result") as ClaudeResultMessage | undefined;
  if (!result) {
    return { type: "result", result: "No result message found", is_error: true };
  }
  return result;
}

function runClaudeTask(
  prompt: string,
  allowedTools: string[],
  disallowedTools: string[],
  timeoutMs: number = 300_000
): { output: ClaudeResultMessage; durationMs: number } {
  const args: string[] = [
    "-p",
    prompt,
    "--output-format",
    "json",
    "--max-turns",
    "20",
  ];

  if (allowedTools.length > 0) {
    args.push("--allowedTools", allowedTools.join(","));
  }
  if (disallowedTools.length > 0) {
    args.push("--disallowedTools", disallowedTools.join(","));
  }

  const start = performance.now();
  try {
    const stdout = execFileSync("claude", args, {
      timeout: timeoutMs,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
      env: process.env,
    });
    const durationMs = Math.round(performance.now() - start);
    const output = extractResult(stdout);
    return { output, durationMs };
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - start);
    const error = err as { stdout?: string; message?: string };
    let output: ClaudeResultMessage;
    try {
      output = extractResult(error.stdout ?? "[]");
    } catch {
      output = {
        type: "result",
        result: error.message ?? "Unknown error",
        is_error: true,
      };
    }
    return { output, durationMs };
  }
}

function runTask(
  task: TaskDefinition,
  variant: "cli" | "mcp",
  fixtures: Record<string, string>,
  runId: string
): TaskResult | null {
  const variantDef = task.variants[variant];
  if (!variantDef) return null;

  const prompt = resolvePrompt(variantDef.prompt, fixtures, runId);
  const allowed = variantDef.allowedTools ?? [];
  const disallowed = variantDef.disallowedTools ?? [];

  console.log(`  Running ${task.id} [${variant}]...`);

  const { output, durationMs } = runClaudeTask(prompt, allowed, disallowed);

  return {
    taskId: task.id,
    variant,
    pass: 1,
    output: output.result ?? "",
    usage: {
      inputTokens: output.usage?.input_tokens ?? 0,
      outputTokens: output.usage?.output_tokens ?? 0,
      cacheReadTokens: output.usage?.cache_read_input_tokens,
      cacheCreationTokens: output.usage?.cache_creation_input_tokens,
      totalCostUsd: output.total_cost_usd,
    },
    toolCalls: [], // CLI pass doesn't give per-tool breakdown
    durationMs,
    success: !output.is_error,
  };
}

// --- Main ---

const filters = parseFilters(process.argv.slice(2));
const tasks = applyFilters(loadTasks(), filters);
const fixtures = loadFixtures();
const runId = generateRunId();

mkdirSync(resolve(RESULTS_DIR, runId), { recursive: true });

console.log(`\nBenchmark Run: ${runId}`);
console.log(`Tasks: ${tasks.length}`);
console.log(`Filters: layer=${filters.layer ?? "all"} service=${filters.service ?? "all"} variant=${filters.variant ?? "all"} id=${filters.id ?? "all"}\n`);

const results: TaskResult[] = [];

for (const task of tasks) {
  console.log(`[${task.id}] ${task.description}`);

  for (const variant of getVariantsForTask(task, filters.variant)) {
    const result = runTask(task, variant, fixtures, runId);
    if (result) {
      results.push(result);

      const filename = `${task.id}_${variant}.json`;
      writeFileSync(
        resolve(RESULTS_DIR, runId, filename),
        JSON.stringify(result, null, 2)
      );

      const cost = result.usage.totalCostUsd
        ? `$${result.usage.totalCostUsd.toFixed(4)}`
        : "N/A";
      const status = result.success ? "OK" : "FAIL";
      console.log(
        `    ${status} | ${result.durationMs}ms | ${result.usage.inputTokens}in/${result.usage.outputTokens}out | ${cost}`
      );
    }
  }
}

// Write summary
const summary: RunSummary = {
  runId,
  timestamp: new Date().toISOString(),
  pass: 1,
  filters: {
    layer: filters.layer,
    service: filters.service,
    variant: filters.variant,
    id: filters.id,
  },
  totalTasks: results.length,
  results,
};

writeFileSync(
  resolve(RESULTS_DIR, runId, "_summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(`\nDone. ${results.length} results written to results/raw/${runId}/`);
