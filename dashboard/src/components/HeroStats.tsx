import { layer1Results } from "../data";

export function HeroStats() {
  const cliResults = layer1Results.filter((r) => r.variant === "cli");
  const mcpResults = layer1Results.filter((r) => r.variant === "mcp");

  const cliCost = cliResults.reduce((s, r) => s + (r.usage.totalCostUsd ?? 0), 0);
  const mcpCost = mcpResults.reduce((s, r) => s + (r.usage.totalCostUsd ?? 0), 0);

  const cliDuration = cliResults.reduce((s, r) => s + r.durationMs, 0);
  const mcpDuration = mcpResults.reduce((s, r) => s + r.durationMs, 0);

  const cliTokens = cliResults.reduce((s, r) => s + r.usage.outputTokens, 0);
  const mcpTokens = mcpResults.reduce((s, r) => s + r.usage.outputTokens, 0);

  let cliWins = 0;
  let mcpWins = 0;
  const taskIds = [...new Set(layer1Results.map((r) => r.taskId))];
  for (const id of taskIds) {
    const cli = layer1Results.find((r) => r.taskId === id && r.variant === "cli");
    const mcp = layer1Results.find((r) => r.taskId === id && r.variant === "mcp");
    if (cli && mcp) {
      const cc = cli.usage.totalCostUsd ?? 0;
      const mc = mcp.usage.totalCostUsd ?? 0;
      if (cc < mc) cliWins++;
      else if (mc < cc) mcpWins++;
    }
  }

  const stats = [
    {
      label: "Total Cost",
      cli: `$${cliCost.toFixed(2)}`,
      mcp: `$${mcpCost.toFixed(2)}`,
      winner: cliCost < mcpCost ? "cli" : "mcp",
      detail: `MCP is ${(mcpCost / cliCost).toFixed(2)}x CLI`,
    },
    {
      label: "Total Duration",
      cli: `${(cliDuration / 1000).toFixed(0)}s`,
      mcp: `${(mcpDuration / 1000).toFixed(0)}s`,
      winner: cliDuration < mcpDuration ? "cli" : "mcp",
      detail: `${Math.abs(((mcpDuration - cliDuration) / cliDuration) * 100).toFixed(0)}% ${mcpDuration < cliDuration ? "faster" : "slower"}`,
    },
    {
      label: "Output Tokens",
      cli: cliTokens.toLocaleString(),
      mcp: mcpTokens.toLocaleString(),
      winner: cliTokens < mcpTokens ? "cli" : "mcp",
      detail: `${((cliTokens / mcpTokens) * 100 - 100).toFixed(0)}% more from CLI`,
    },
    {
      label: "Tasks Won",
      cli: String(cliWins),
      mcp: String(mcpWins),
      winner: cliWins > mcpWins ? "cli" : "mcp",
      detail: `${15 - cliWins - mcpWins} ties`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-border bg-surface-raised p-5 group hover:border-border-subtle transition-colors"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-4">
            {s.label}
          </p>
          <div className="flex items-baseline gap-3 mb-1">
            <span className={`text-2xl font-bold tabular-nums ${s.winner === "cli" ? "text-cli" : "text-text-secondary"}`}>
              {s.cli}
            </span>
            <span className="text-text-muted text-xs">CLI</span>
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            <span className={`text-2xl font-bold tabular-nums ${s.winner === "mcp" ? "text-mcp" : "text-text-secondary"}`}>
              {s.mcp}
            </span>
            <span className="text-text-muted text-xs">MCP</span>
          </div>
          <p className="text-xs text-text-muted font-mono">{s.detail}</p>
        </div>
      ))}
    </div>
  );
}
