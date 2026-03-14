import { layer2Results, taskMeta } from "../data";

export function Layer2Cards() {
  const cliTasks = layer2Results.filter((r) => r.variant === "cli");
  const mcpTasks = layer2Results.filter((r) => r.variant === "mcp");

  return (
    <div className="space-y-8">
      {/* CLI-only */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-cli" />
          <h3 className="text-sm font-semibold text-text-primary">CLI + Skills Only</h3>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cliTasks.map((r) => {
            const meta = taskMeta.find((t) => t.id === r.taskId)!;
            return (
              <div
                key={r.taskId}
                className="rounded-lg border border-border bg-surface-overlay p-5 hover:border-cli/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-sm text-cli font-medium">{r.taskId}</span>
                    <p className="text-sm text-text-secondary mt-0.5">{meta.description}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted capitalize bg-surface px-2 py-1 rounded">
                    {meta.service}
                  </span>
                </div>
                <div className="flex gap-6 text-xs font-mono text-text-muted pt-3 border-t border-border-subtle">
                  <span>
                    Cost:{" "}
                    <span className="text-cli">${(r.usage.totalCostUsd ?? 0).toFixed(3)}</span>
                  </span>
                  <span>
                    Duration:{" "}
                    <span className="text-text-secondary">{(r.durationMs / 1000).toFixed(1)}s</span>
                  </span>
                  <span>
                    Tokens:{" "}
                    <span className="text-text-secondary">{r.usage.outputTokens.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MCP-only */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-mcp" />
          <h3 className="text-sm font-semibold text-text-primary">MCP Only</h3>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mcpTasks.map((r) => {
            const meta = taskMeta.find((t) => t.id === r.taskId)!;
            return (
              <div
                key={r.taskId}
                className="rounded-lg border border-border bg-surface-overlay p-5 hover:border-mcp/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-sm text-mcp font-medium">{r.taskId}</span>
                    <p className="text-sm text-text-secondary mt-0.5">{meta.description}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted capitalize bg-surface px-2 py-1 rounded">
                    {meta.service}
                  </span>
                </div>
                <div className="flex gap-6 text-xs font-mono text-text-muted pt-3 border-t border-border-subtle">
                  <span>
                    Cost:{" "}
                    <span className="text-mcp">${(r.usage.totalCostUsd ?? 0).toFixed(3)}</span>
                  </span>
                  <span>
                    Duration:{" "}
                    <span className="text-text-secondary">{(r.durationMs / 1000).toFixed(1)}s</span>
                  </span>
                  <span>
                    Tokens:{" "}
                    <span className="text-text-secondary">{r.usage.outputTokens.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
