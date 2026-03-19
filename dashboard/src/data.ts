export interface TaskResult {
  taskId: string;
  variant: "cli" | "mcp";
  pass: number;
  output: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens?: number;
    cacheCreationTokens?: number;
    totalCostUsd?: number;
  };
  toolCalls: unknown[];
  durationMs: number;
  success: boolean;
}

export interface TaskMeta {
  id: string;
  layer: 1 | 2;
  service: string;
  description: string;
  path: "both" | "cli_only" | "mcp_only";
}

export const taskMeta: TaskMeta[] = [
  { id: "N1", layer: 1, service: "notion", description: "Search DB, read pages, compute stats, create summary", path: "both" },
  { id: "N2", layer: 1, service: "notion", description: "Read page tree, create database from extracted data", path: "both" },
  { id: "S1", layer: 1, service: "slack", description: "Read channel, profile users, post activity report", path: "both" },
  { id: "S2", layer: 1, service: "slack", description: "Read thread, extract action items, post follow-up", path: "both" },
  { id: "G1", layer: 1, service: "github", description: "Audit issues, categorize, create triage summary", path: "both" },
  { id: "G2", layer: 1, service: "github", description: "Read PR + issues, post structured review", path: "both" },
  { id: "P1", layer: 1, service: "postgres", description: "Join tables, aggregate metrics, create summary", path: "both" },
  { id: "P2", layer: 1, service: "postgres", description: "Analyze schema, detect quality issues, generate report", path: "both" },
  { id: "C1", layer: 2, service: "github", description: "/commit skill", path: "cli_only" },
  { id: "C2", layer: 2, service: "github", description: "/review-pr skill", path: "cli_only" },
  { id: "C3", layer: 2, service: "github", description: "Complex gh pipeline", path: "cli_only" },
  { id: "C4", layer: 2, service: "github", description: "/simplify skill", path: "cli_only" },
  { id: "M1", layer: 2, service: "notion", description: "Create Notion DB with views", path: "mcp_only" },
  { id: "M2", layer: 2, service: "slack", description: "Send Slack draft", path: "mcp_only" },
  { id: "M3", layer: 2, service: "notion", description: "Cross-reference Slack + Notion", path: "mcp_only" },
];

// Layer 1 results (run: mmpoarhv)
export const layer1Results: TaskResult[] = [
  {"taskId":"N1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":11,"outputTokens":1864,"cacheReadTokens":203035,"cacheCreationTokens":19210,"totalCostUsd":0.2682},"toolCalls":[],"durationMs":70363,"success":true},
  {"taskId":"N1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":32,"outputTokens":4167,"cacheReadTokens":640669,"cacheCreationTokens":37533,"totalCostUsd":0.6593},"toolCalls":[],"durationMs":141102,"success":true},
  {"taskId":"N2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":11,"outputTokens":4261,"cacheReadTokens":255382,"cacheCreationTokens":26892,"totalCostUsd":0.4023},"toolCalls":[],"durationMs":103910,"success":true},
  {"taskId":"N2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":927,"outputTokens":1189,"cacheReadTokens":131266,"cacheCreationTokens":11977,"totalCostUsd":0.1748},"toolCalls":[],"durationMs":42460,"success":true},
  {"taskId":"S1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":16,"outputTokens":2599,"cacheReadTokens":330309,"cacheCreationTokens":11013,"totalCostUsd":0.2990},"toolCalls":[],"durationMs":91974,"success":true},
  {"taskId":"S1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":8,"outputTokens":1786,"cacheReadTokens":97161,"cacheCreationTokens":8041,"totalCostUsd":0.1435},"toolCalls":[],"durationMs":39558,"success":true},
  {"taskId":"S2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":8,"outputTokens":1006,"cacheReadTokens":131563,"cacheCreationTokens":5677,"totalCostUsd":0.1265},"toolCalls":[],"durationMs":39660,"success":true},
  {"taskId":"S2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":769,"cacheReadTokens":72856,"cacheCreationTokens":5352,"totalCostUsd":0.0891},"toolCalls":[],"durationMs":29669,"success":true},
  {"taskId":"G1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":863,"cacheReadTokens":91878,"cacheCreationTokens":4850,"totalCostUsd":0.0979},"toolCalls":[],"durationMs":33278,"success":true},
  {"taskId":"G1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":10,"outputTokens":1184,"cacheReadTokens":93635,"cacheCreationTokens":6339,"totalCostUsd":0.1161},"toolCalls":[],"durationMs":29249,"success":true},
  {"taskId":"G2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":1220,"cacheReadTokens":93770,"cacheCreationTokens":5793,"totalCostUsd":0.1136},"toolCalls":[],"durationMs":42729,"success":true},
  {"taskId":"G2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":1462,"cacheReadTokens":76793,"cacheCreationTokens":8767,"totalCostUsd":0.1298},"toolCalls":[],"durationMs":34551,"success":true},
  {"taskId":"P1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":4,"outputTokens":493,"cacheReadTokens":52640,"cacheCreationTokens":4458,"totalCostUsd":0.0665},"toolCalls":[],"durationMs":18588,"success":true},
  {"taskId":"P1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":14,"outputTokens":1769,"cacheReadTokens":253192,"cacheCreationTokens":6030,"totalCostUsd":0.3244},"toolCalls":[],"durationMs":66984,"success":true},
  {"taskId":"P2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":1162,"cacheReadTokens":92220,"cacheCreationTokens":6039,"totalCostUsd":0.1129},"toolCalls":[],"durationMs":34548,"success":true},
  {"taskId":"P2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":85,"outputTokens":1797,"cacheReadTokens":283558,"cacheCreationTokens":7439,"totalCostUsd":0.2336},"toolCalls":[],"durationMs":53075,"success":true},
];

// Layer 2 results (run: mmpoarhv)
export const layer2Results: TaskResult[] = [
  {"taskId":"C1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":10,"outputTokens":1425,"cacheReadTokens":240779,"cacheCreationTokens":23913,"totalCostUsd":0.3055},"toolCalls":[],"durationMs":51750,"success":true},
  {"taskId":"C2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":1249,"cacheReadTokens":65816,"cacheCreationTokens":11432,"totalCostUsd":0.1356},"toolCalls":[],"durationMs":39963,"success":true},
  {"taskId":"C3","variant":"cli","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":895,"cacheReadTokens":71375,"cacheCreationTokens":4300,"totalCostUsd":0.0850},"toolCalls":[],"durationMs":35445,"success":true},
  {"taskId":"C4","variant":"cli","pass":1,"output":"","usage":{"inputTokens":1220,"outputTokens":8234,"cacheReadTokens":709149,"cacheCreationTokens":47661,"totalCostUsd":1.1046},"toolCalls":[],"durationMs":193444,"success":true},
  {"taskId":"M1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":707,"cacheReadTokens":69889,"cacheCreationTokens":13744,"totalCostUsd":0.1386},"toolCalls":[],"durationMs":26837,"success":true},
  {"taskId":"M2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":282,"cacheReadTokens":52701,"cacheCreationTokens":4502,"totalCostUsd":0.0616},"toolCalls":[],"durationMs":13241,"success":true},
  {"taskId":"M3","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":772,"cacheReadTokens":77753,"cacheCreationTokens":7833,"totalCostUsd":0.1072},"toolCalls":[],"durationMs":25158,"success":true},
];

// Hinted CLI results (run: mmwxo7de — CLI with accurate cheatsheets, equivalent to CLAUDE.md)
export const hintedCliResults: TaskResult[] = [
  {"taskId":"N1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":16,"outputTokens":2638,"cacheReadTokens":330704,"cacheCreationTokens":19730,"totalCostUsd":0.3547},"toolCalls":[],"durationMs":113591,"success":true},
  {"taskId":"N2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":9,"outputTokens":2813,"cacheReadTokens":263886,"cacheCreationTokens":28370,"totalCostUsd":0.3796},"toolCalls":[],"durationMs":74509,"success":true},
  {"taskId":"S1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":12,"outputTokens":2044,"cacheReadTokens":236603,"cacheCreationTokens":9496,"totalCostUsd":0.2288},"toolCalls":[],"durationMs":71318,"success":true},
  {"taskId":"S2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":4,"outputTokens":387,"cacheReadTokens":51271,"cacheCreationTokens":3886,"totalCostUsd":0.0596},"toolCalls":[],"durationMs":20929,"success":true},
  {"taskId":"G1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":4,"outputTokens":642,"cacheReadTokens":51808,"cacheCreationTokens":4679,"totalCostUsd":0.0712},"toolCalls":[],"durationMs":31476,"success":true},
  {"taskId":"G2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":4,"outputTokens":1018,"cacheReadTokens":55014,"cacheCreationTokens":8157,"totalCostUsd":0.1040},"toolCalls":[],"durationMs":26339,"success":true},
  {"taskId":"P1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":9,"outputTokens":963,"cacheReadTokens":143353,"cacheCreationTokens":4363,"totalCostUsd":0.1231},"toolCalls":[],"durationMs":45209,"success":true},
  {"taskId":"P2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":9,"outputTokens":904,"cacheReadTokens":143181,"cacheCreationTokens":4291,"totalCostUsd":0.1211},"toolCalls":[],"durationMs":34043,"success":true},
];

// Per-task context overhead: total context tokens loaded (input + cache read + cache create)
export function contextTokens(r: TaskResult): number {
  return (r.usage.inputTokens ?? 0)
    + (r.usage.cacheReadTokens ?? 0)
    + (r.usage.cacheCreationTokens ?? 0);
}

// Three-way comparison: baseline CLI vs hinted CLI vs MCP
export function getScenarioComparison() {
  const taskIds = [...new Set(layer1Results.map((r) => r.taskId))];
  return taskIds.map((id) => {
    const meta = taskMeta.find((t) => t.id === id)!;
    const baseCli = layer1Results.find((r) => r.taskId === id && r.variant === "cli");
    const mcp = layer1Results.find((r) => r.taskId === id && r.variant === "mcp");
    const hintedCli = hintedCliResults.find((r) => r.taskId === id);
    return { meta, baseCli, mcp, hintedCli };
  });
}

// Derived data helpers
export function getLayer1Pairs() {
  const pairs: Record<string, { cli?: TaskResult; mcp?: TaskResult; meta: TaskMeta }> = {};
  for (const r of layer1Results) {
    const meta = taskMeta.find((t) => t.id === r.taskId)!;
    if (!pairs[r.taskId]) pairs[r.taskId] = { meta };
    pairs[r.taskId][r.variant] = r;
  }
  return Object.values(pairs);
}

export function getServiceBreakdown() {
  const services: Record<string, {
    cli: number; mcp: number;
    cliDuration: number; mcpDuration: number;
    cliTokens: number; mcpTokens: number;
    cliContext: number; mcpContext: number;
  }> = {};
  for (const pair of getLayer1Pairs()) {
    const s = pair.meta.service;
    if (!services[s]) services[s] = { cli: 0, mcp: 0, cliDuration: 0, mcpDuration: 0, cliTokens: 0, mcpTokens: 0, cliContext: 0, mcpContext: 0 };
    services[s].cli += pair.cli?.usage.totalCostUsd ?? 0;
    services[s].mcp += pair.mcp?.usage.totalCostUsd ?? 0;
    services[s].cliDuration += pair.cli?.durationMs ?? 0;
    services[s].mcpDuration += pair.mcp?.durationMs ?? 0;
    services[s].cliTokens += (pair.cli?.usage.inputTokens ?? 0) + (pair.cli?.usage.outputTokens ?? 0);
    services[s].mcpTokens += (pair.mcp?.usage.inputTokens ?? 0) + (pair.mcp?.usage.outputTokens ?? 0);
    services[s].cliContext += pair.cli ? contextTokens(pair.cli) : 0;
    services[s].mcpContext += pair.mcp ? contextTokens(pair.mcp) : 0;
  }
  return services;
}
