export interface TaskResult {
  taskId: string;
  variant: "cli" | "mcp";
  pass: number;  // 1 = CLI runner, 2 = SDK runner
  output: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens?: number;
    cacheCreationTokens?: number;
    totalCostUsd?: number;
  };
  toolCalls: ToolCallLog[];
  durationMs: number;
  success: boolean;
  score?: number;  // 0-1 for deterministic, 1-5 for manual
}

export interface ToolCallLog {
  toolName: string;
  inputTokens?: number;
  outputTokens?: number;
  durationMs?: number;
  success: boolean;
}

export interface RunSummary {
  runId: string;
  timestamp: string;
  pass: number;
  filters: {
    layer?: number | null;
    service?: string | null;
    variant?: ("cli" | "mcp") | null;
    id?: string | null;
  };
  totalTasks: number;
  results: TaskResult[];
}
