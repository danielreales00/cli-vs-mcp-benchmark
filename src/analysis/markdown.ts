import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { resolve } from "path";
import { loadTasks } from "../tasks/loader.js";
import { RESULTS_DIR } from "../config.js";
import type { TaskResult } from "../runners/types.js";

const args = process.argv.slice(2);
const runIdArg = args.find((a) => a.startsWith("--run="));
if (!runIdArg) {
  console.error("Usage: npm run report -- --run=<runId>");
  process.exit(1);
}
const runId = runIdArg.split("=")[1]!;
const runDir = resolve(RESULTS_DIR, runId);

const tasks = loadTasks();
const taskMap = new Map(tasks.map((t) => [t.id, t]));

// Load scored results if available, otherwise raw results
const scoredPath = resolve(runDir, "_scored.json");
let results: TaskResult[];

try {
  const scored = JSON.parse(readFileSync(scoredPath, "utf-8"));
  results = scored.results;
} catch {
  const files = readdirSync(runDir).filter(
    (f) => f.endsWith(".json") && !f.startsWith("_") && !f.includes("_steps")
  );
  results = files.map(
    (f) => JSON.parse(readFileSync(resolve(runDir, f), "utf-8")) as TaskResult
  );
}

// Group by task
type Pair = { cli?: TaskResult; mcp?: TaskResult };
const pairs = new Map<string, Pair>();

for (const r of results) {
  const existing = pairs.get(r.taskId) ?? {};
  existing[r.variant as "cli" | "mcp"] = r;
  pairs.set(r.taskId, existing);
}

// Build report
const lines: string[] = [];
const h = (level: number, text: string) =>
  lines.push(`${"#".repeat(level)} ${text}\n`);

h(1, `Benchmark Report: ${runId}`);
lines.push(`Generated: ${new Date().toISOString()}\n`);

// Summary table
h(2, "Summary");
lines.push(
  "| Task | Service | CLI Cost | MCP Cost | CLI Tokens | MCP Tokens | CLI Duration | MCP Duration | Winner |"
);
lines.push(
  "|------|---------|----------|----------|------------|------------|-------------|-------------|--------|"
);

let cliTotalCost = 0;
let mcpTotalCost = 0;
let cliWins = 0;
let mcpWins = 0;
let ties = 0;

for (const [taskId, pair] of pairs) {
  const task = taskMap.get(taskId);
  if (!task) continue;

  const cliCost = pair.cli?.usage?.totalCostUsd ?? 0;
  const mcpCost = pair.mcp?.usage?.totalCostUsd ?? 0;
  const cliTokens = pair.cli
    ? (pair.cli.usage?.inputTokens ?? 0) + (pair.cli.usage?.outputTokens ?? 0)
    : 0;
  const mcpTokens = pair.mcp
    ? (pair.mcp.usage?.inputTokens ?? 0) + (pair.mcp.usage?.outputTokens ?? 0)
    : 0;
  const cliMs = pair.cli?.durationMs ?? 0;
  const mcpMs = pair.mcp?.durationMs ?? 0;

  cliTotalCost += cliCost;
  mcpTotalCost += mcpCost;

  let winner = "-";
  if (pair.cli && pair.mcp) {
    if (cliCost < mcpCost) {
      winner = "CLI";
      cliWins++;
    } else if (mcpCost < cliCost) {
      winner = "MCP";
      mcpWins++;
    } else {
      winner = "Tie";
      ties++;
    }
  }

  lines.push(
    `| ${taskId} | ${task.service} | $${cliCost.toFixed(4)} | $${mcpCost.toFixed(4)} | ${cliTokens} | ${mcpTokens} | ${cliMs}ms | ${mcpMs}ms | ${winner} |`
  );
}

lines.push("");

// Totals
h(2, "Totals");
lines.push(`- **CLI total cost:** $${cliTotalCost.toFixed(4)}`);
lines.push(`- **MCP total cost:** $${mcpTotalCost.toFixed(4)}`);
lines.push(
  `- **Cost ratio:** MCP is ${(mcpTotalCost / (cliTotalCost || 1)).toFixed(2)}x CLI`
);
lines.push(`- **CLI wins:** ${cliWins}`);
lines.push(`- **MCP wins:** ${mcpWins}`);
lines.push(`- **Ties:** ${ties}`);
lines.push("");

// Per-service breakdown
h(2, "By Service");
const services = [...new Set(results.map((r) => taskMap.get(r.taskId)?.service).filter(Boolean))];

for (const service of services) {
  h(3, service!);
  const servicePairs = [...pairs.entries()].filter(
    ([id]) => taskMap.get(id)?.service === service
  );

  let sCli = 0;
  let sMcp = 0;
  for (const [, pair] of servicePairs) {
    sCli += pair.cli?.usage?.totalCostUsd ?? 0;
    sMcp += pair.mcp?.usage?.totalCostUsd ?? 0;
  }

  lines.push(`- CLI cost: $${sCli.toFixed(4)}`);
  lines.push(`- MCP cost: $${sMcp.toFixed(4)}`);
  lines.push(
    `- Ratio: MCP is ${(sMcp / (sCli || 1)).toFixed(2)}x CLI`
  );
  lines.push("");
}

// Tool call analysis (from SDK runs)
h(2, "Tool Call Analysis");
const toolCallCounts = new Map<string, number>();
for (const r of results) {
  if (!r.toolCalls) continue;
  for (const tc of r.toolCalls) {
    const key = `${r.variant}:${tc.toolName}`;
    toolCallCounts.set(key, (toolCallCounts.get(key) ?? 0) + 1);
  }
}

if (toolCallCounts.size > 0) {
  lines.push("| Variant | Tool | Count |");
  lines.push("|---------|------|-------|");
  for (const [key, count] of [...toolCallCounts.entries()].sort()) {
    const [variant, tool] = key.split(":");
    lines.push(`| ${variant} | ${tool} | ${count} |`);
  }
} else {
  lines.push("*No tool call data available (run SDK pass for detailed analysis)*");
}
lines.push("");

// Accuracy
h(2, "Accuracy");
const scored = results.filter((r) => r.score !== undefined);
if (scored.length > 0) {
  const cliScored = scored.filter((r) => r.variant === "cli");
  const mcpScored = scored.filter((r) => r.variant === "mcp");
  const avgCli =
    cliScored.reduce((sum, r) => sum + (r.score ?? 0), 0) /
    (cliScored.length || 1);
  const avgMcp =
    mcpScored.reduce((sum, r) => sum + (r.score ?? 0), 0) /
    (mcpScored.length || 1);

  lines.push(`- CLI average accuracy: ${(avgCli * 100).toFixed(1)}%`);
  lines.push(`- MCP average accuracy: ${(avgMcp * 100).toFixed(1)}%`);
} else {
  lines.push("*No scores available yet. Run `npm run score` first.*");
}
lines.push("");

const report = lines.join("\n");
const reportsDir = resolve(RESULTS_DIR, "..", "reports");
mkdirSync(reportsDir, { recursive: true });
const reportPath = resolve(reportsDir, `${runId}.md`);
writeFileSync(reportPath, report);
console.log(report);
console.log(`\nReport written to ${reportPath}`);
