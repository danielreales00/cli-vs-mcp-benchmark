import { getServiceBreakdown } from "../data";

const serviceColors: Record<string, string> = {
  notion: "#e8e8ed",
  slack: "#e01e5a",
  github: "#8b5cf6",
  postgres: "#3b82f6",
};

const serviceIcons: Record<string, string> = {
  notion: "N",
  slack: "S",
  github: "G",
  postgres: "P",
};

export function ServiceBreakdown() {
  const services = getServiceBreakdown();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(services).map(([name, data]) => {
        const costWinner = data.cli < data.mcp ? "cli" : "mcp";
        const speedWinner = data.cliDuration < data.mcpDuration ? "cli" : "mcp";
        const ratio = data.mcp / (data.cli || 1);
        const color = serviceColors[name] ?? "#888";

        return (
          <div
            key={name}
            className="rounded-lg border border-border bg-surface-overlay p-5 relative overflow-hidden"
          >
            {/* Accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: color }}
            />

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold"
                style={{ background: `${color}15`, color }}
              >
                {serviceIcons[name]}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary capitalize">{name}</h3>
                <p className="text-xs text-text-muted font-mono">
                  MCP is {ratio.toFixed(2)}x CLI cost
                </p>
              </div>
            </div>

            {/* Cost bars */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-8 font-mono">CLI</span>
                <div className="flex-1 h-5 rounded-sm bg-surface relative overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all duration-700"
                    style={{
                      width: `${(data.cli / Math.max(data.cli, data.mcp)) * 100}%`,
                      background: costWinner === "cli" ? "#C2410C" : "#C2410C66",
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-text-secondary w-16 text-right">
                  ${data.cli.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-8 font-mono">MCP</span>
                <div className="flex-1 h-5 rounded-sm bg-surface relative overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all duration-700"
                    style={{
                      width: `${(data.mcp / Math.max(data.cli, data.mcp)) * 100}%`,
                      background: costWinner === "mcp" ? "#006039" : "#00603966",
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-text-secondary w-16 text-right">
                  ${data.mcp.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 text-xs font-mono text-text-muted pt-3 border-t border-border-subtle">
              <span>
                Speed:{" "}
                <span className={speedWinner === "cli" ? "text-cli" : "text-mcp"}>
                  {speedWinner.toUpperCase()}
                </span>
              </span>
              <span>
                CLI {(data.cliDuration / 1000).toFixed(0)}s / MCP{" "}
                {(data.mcpDuration / 1000).toFixed(0)}s
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
