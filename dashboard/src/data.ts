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

// Layer 1 results (run: mmpma7or)
export const layer1Results: TaskResult[] = [
  {"taskId":"N1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":4,"outputTokens":451,"cacheReadTokens":46025,"cacheCreationTokens":12392,"totalCostUsd":0.1118},"toolCalls":[],"durationMs":24428,"success":true},
  {"taskId":"N1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":260,"cacheReadTokens":53554,"cacheCreationTokens":5733,"totalCostUsd":0.0691},"toolCalls":[],"durationMs":13028,"success":true},
  {"taskId":"N2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":599,"cacheReadTokens":90593,"cacheCreationTokens":5295,"totalCostUsd":0.0934},"toolCalls":[],"durationMs":28183,"success":true},
  {"taskId":"N2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":277,"cacheReadTokens":52483,"cacheCreationTokens":4531,"totalCostUsd":0.0615},"toolCalls":[],"durationMs":16186,"success":true},
  {"taskId":"N3","variant":"cli","pass":1,"output":"","usage":{"inputTokens":18,"outputTokens":2675,"cacheReadTokens":344055,"cacheCreationTokens":9428,"totalCostUsd":0.2979},"toolCalls":[],"durationMs":94149,"success":true},
  {"taskId":"N3","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":300,"cacheReadTokens":54808,"cacheCreationTokens":6622,"totalCostUsd":0.0763},"toolCalls":[],"durationMs":18646,"success":true},
  {"taskId":"N4","variant":"cli","pass":1,"output":"","usage":{"inputTokens":9,"outputTokens":1385,"cacheReadTokens":151117,"cacheCreationTokens":6793,"totalCostUsd":0.1527},"toolCalls":[],"durationMs":56939,"success":true},
  {"taskId":"N4","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":9,"outputTokens":983,"cacheReadTokens":126619,"cacheCreationTokens":9578,"totalCostUsd":0.1478},"toolCalls":[],"durationMs":56094,"success":true},
  {"taskId":"S1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":924,"cacheReadTokens":90463,"cacheCreationTokens":5528,"totalCostUsd":0.1029},"toolCalls":[],"durationMs":34538,"success":true},
  {"taskId":"S1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":689,"cacheReadTokens":52307,"cacheCreationTokens":5084,"totalCostUsd":0.0752},"toolCalls":[],"durationMs":24027,"success":true},
  {"taskId":"S2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":14,"outputTokens":1595,"cacheReadTokens":260456,"cacheCreationTokens":7768,"totalCostUsd":0.2187},"toolCalls":[],"durationMs":73181,"success":true},
  {"taskId":"S2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":540,"cacheReadTokens":52319,"cacheCreationTokens":5091,"totalCostUsd":0.0715},"toolCalls":[],"durationMs":17730,"success":true},
  {"taskId":"S3","variant":"cli","pass":1,"output":"","usage":{"inputTokens":9,"outputTokens":777,"cacheReadTokens":149393,"cacheCreationTokens":5231,"totalCostUsd":0.1269},"toolCalls":[],"durationMs":37124,"success":true},
  {"taskId":"S3","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":394,"cacheReadTokens":72250,"cacheCreationTokens":5047,"totalCostUsd":0.0776},"toolCalls":[],"durationMs":24687,"success":true},
  {"taskId":"S4","variant":"cli","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":732,"cacheReadTokens":93188,"cacheCreationTokens":5561,"totalCostUsd":0.0997},"toolCalls":[],"durationMs":36061,"success":true},
  {"taskId":"S4","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":514,"cacheReadTokens":72564,"cacheCreationTokens":5107,"totalCostUsd":0.0811},"toolCalls":[],"durationMs":24895,"success":true},
  {"taskId":"G1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":3,"outputTokens":218,"cacheReadTokens":33412,"cacheCreationTokens":3787,"totalCostUsd":0.0458},"toolCalls":[],"durationMs":19808,"success":true},
  {"taskId":"G1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":349,"cacheReadTokens":52325,"cacheCreationTokens":4549,"totalCostUsd":0.0633},"toolCalls":[],"durationMs":14867,"success":true},
  {"taskId":"G2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":3,"outputTokens":229,"cacheReadTokens":33413,"cacheCreationTokens":3689,"totalCostUsd":0.0455},"toolCalls":[],"durationMs":15660,"success":true},
  {"taskId":"G2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":479,"cacheReadTokens":49082,"cacheCreationTokens":8252,"totalCostUsd":0.0881},"toolCalls":[],"durationMs":16034,"success":true},
  {"taskId":"G3","variant":"cli","pass":1,"output":"","usage":{"inputTokens":3,"outputTokens":153,"cacheReadTokens":33423,"cacheCreationTokens":3589,"totalCostUsd":0.0430},"toolCalls":[],"durationMs":18738,"success":true},
  {"taskId":"G3","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":322,"cacheReadTokens":52431,"cacheCreationTokens":4246,"totalCostUsd":0.0608},"toolCalls":[],"durationMs":14397,"success":true},
  {"taskId":"G4","variant":"cli","pass":1,"output":"","usage":{"inputTokens":3,"outputTokens":202,"cacheReadTokens":33411,"cacheCreationTokens":3593,"totalCostUsd":0.0442},"toolCalls":[],"durationMs":14013,"success":true},
  {"taskId":"G4","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":428,"cacheReadTokens":52479,"cacheCreationTokens":4507,"totalCostUsd":0.0651},"toolCalls":[],"durationMs":15129,"success":true},
  {"taskId":"P1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":3,"outputTokens":245,"cacheReadTokens":33404,"cacheCreationTokens":3665,"totalCostUsd":0.0457},"toolCalls":[],"durationMs":12175,"success":true},
  {"taskId":"P1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":739,"cacheReadTokens":111135,"cacheCreationTokens":5176,"totalCostUsd":0.1064},"toolCalls":[],"durationMs":26097,"success":true},
  {"taskId":"P2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":3,"outputTokens":138,"cacheReadTokens":33425,"cacheCreationTokens":3566,"totalCostUsd":0.0425},"toolCalls":[],"durationMs":12510,"success":true},
  {"taskId":"P2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":9,"outputTokens":1001,"cacheReadTokens":147227,"cacheCreationTokens":4755,"totalCostUsd":0.1284},"toolCalls":[],"durationMs":27578,"success":true},
  {"taskId":"P3","variant":"cli","pass":1,"output":"","usage":{"inputTokens":4,"outputTokens":269,"cacheReadTokens":52040,"cacheCreationTokens":3985,"totalCostUsd":0.0577},"toolCalls":[],"durationMs":14657,"success":true},
  {"taskId":"P3","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":401,"outputTokens":1693,"cacheReadTokens":200461,"cacheCreationTokens":8403,"totalCostUsd":0.1971},"toolCalls":[],"durationMs":54145,"success":true},
];

// Layer 2 results (run: mmpma7or)
export const layer2Results: TaskResult[] = [
  {"taskId":"C1","variant":"cli","pass":1,"output":"","usage":{"inputTokens":4246,"outputTokens":1127,"cacheReadTokens":118402,"cacheCreationTokens":9062,"totalCostUsd":0.1652},"toolCalls":[],"durationMs":36937,"success":true},
  {"taskId":"C2","variant":"cli","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":1230,"cacheReadTokens":65720,"cacheCreationTokens":11412,"totalCostUsd":0.1350},"toolCalls":[],"durationMs":40021,"success":true},
  {"taskId":"C3","variant":"cli","pass":1,"output":"","usage":{"inputTokens":8,"outputTokens":1062,"cacheReadTokens":90502,"cacheCreationTokens":4873,"totalCostUsd":0.1023},"toolCalls":[],"durationMs":37915,"success":true},
  {"taskId":"C4","variant":"cli","pass":1,"output":"","usage":{"inputTokens":281,"outputTokens":10815,"cacheReadTokens":733913,"cacheCreationTokens":34841,"totalCostUsd":1.2318},"toolCalls":[],"durationMs":292171,"success":true},
  {"taskId":"M1","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":7,"outputTokens":655,"cacheReadTokens":69852,"cacheCreationTokens":13727,"totalCostUsd":0.1371},"toolCalls":[],"durationMs":42875,"success":true},
  {"taskId":"M2","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":6,"outputTokens":272,"cacheReadTokens":52686,"cacheCreationTokens":4499,"totalCostUsd":0.0613},"toolCalls":[],"durationMs":15098,"success":true},
  {"taskId":"M3","variant":"mcp","pass":1,"output":"","usage":{"inputTokens":10,"outputTokens":913,"cacheReadTokens":103086,"cacheCreationTokens":9174,"totalCostUsd":0.1318},"toolCalls":[],"durationMs":42916,"success":true},
];

// Per-task context overhead: total context tokens loaded (input + cache read + cache create)
export function contextTokens(r: TaskResult): number {
  return (r.usage.inputTokens ?? 0)
    + (r.usage.cacheReadTokens ?? 0)
    + (r.usage.cacheCreationTokens ?? 0);
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
