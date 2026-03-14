export type Layer = 1 | 2;
export type ScoringType = "deterministic" | "manual";
export type Service = "notion" | "slack" | "github" | "postgres";
export type TaskPath = "both" | "cli_only" | "mcp_only";

export interface TaskVariant {
  prompt: string;
  allowedTools: string[];
  disallowedTools?: string[];
  mcpServers?: Record<string, McpServerConfig>;
}

export interface McpServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface TaskDefinition {
  id: string;
  layer: Layer;
  service: Service;
  description: string;
  path: TaskPath;
  scoring: ScoringType;
  expectedOutput: string;
  variants: {
    cli?: TaskVariant;
    mcp?: TaskVariant;
  };
}
