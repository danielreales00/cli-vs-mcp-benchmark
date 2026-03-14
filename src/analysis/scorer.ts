import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve } from "path";
import { loadTasks } from "../tasks/loader.js";
import { RESULTS_DIR } from "../config.js";
import type { TaskResult } from "../runners/types.js";

const args = process.argv.slice(2);
const runIdArg = args.find((a) => a.startsWith("--run="));
if (!runIdArg) {
  console.error("Usage: npm run score -- --run=<runId>");
  process.exit(1);
}
const runId = runIdArg.split("=")[1]!;
const runDir = resolve(RESULTS_DIR, runId);

const tasks = loadTasks();
const taskMap = new Map(tasks.map((t) => [t.id, t]));

// Load all result files
const files = readdirSync(runDir).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

const results: TaskResult[] = [];
for (const file of files) {
  if (file.includes("_steps")) continue;
  const raw = readFileSync(resolve(runDir, file), "utf-8");
  results.push(JSON.parse(raw) as TaskResult);
}

console.log(`\nScoring run: ${runId}`);
console.log(`Results found: ${results.length}\n`);

// Score deterministic tasks
for (const result of results) {
  const task = taskMap.get(result.taskId);
  if (!task) continue;

  if (task.scoring === "deterministic") {
    // Basic deterministic scoring:
    // - success = 1.0 (task completed without error)
    // - failure = 0.0
    // - output contains expected indicators = partial credit
    if (result.success) {
      result.score = 1.0;
    } else {
      result.score = 0.0;
    }
  } else {
    // Manual scoring — prompt for input
    console.log(`--- [${result.taskId}] ${task.description} [${result.variant}] ---`);
    console.log(`Output preview: ${result.output.slice(0, 300)}...`);
    console.log(`Success: ${result.success} | Duration: ${result.durationMs}ms`);
    console.log(`Score (1-5, or press enter to skip):`);

    // For non-interactive runs, leave score undefined
    // In interactive mode, you'd read from stdin here
    result.score = undefined;
  }
}

// Write scored results
const scoredPath = resolve(runDir, "_scored.json");
writeFileSync(
  scoredPath,
  JSON.stringify(
    {
      runId,
      scoredAt: new Date().toISOString(),
      results: results.map((r) => ({
        taskId: r.taskId,
        variant: r.variant,
        pass: r.pass,
        success: r.success,
        score: r.score,
        durationMs: r.durationMs,
        usage: r.usage,
        toolCallCount: r.toolCalls.length,
      })),
    },
    null,
    2
  )
);

console.log(`\nScored results written to ${scoredPath}`);
