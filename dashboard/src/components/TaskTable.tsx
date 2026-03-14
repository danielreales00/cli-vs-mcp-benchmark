import { getLayer1Pairs, contextTokens } from "../data";

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
}

export function TaskTable() {
  const pairs = getLayer1Pairs();

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Task</th>
            <th className="text-left py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Service</th>
            <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">CLI Cost</th>
            <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">MCP Cost</th>
            <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">CLI Time</th>
            <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">MCP Time</th>
            <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider" title="Total context tokens loaded (input + cache read + cache create)">CLI Ctx</th>
            <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider" title="Total context tokens loaded (input + cache read + cache create)">MCP Ctx</th>
            <th className="text-center py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Winner</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p) => {
            const cliCost = p.cli?.usage.totalCostUsd ?? 0;
            const mcpCost = p.mcp?.usage.totalCostUsd ?? 0;
            const cliCtx = p.cli ? contextTokens(p.cli) : 0;
            const mcpCtx = p.mcp ? contextTokens(p.mcp) : 0;
            const winner = cliCost < mcpCost ? "CLI" : cliCost > mcpCost ? "MCP" : "Tie";

            return (
              <tr
                key={p.meta.id}
                className="border-b border-border-subtle hover:bg-surface-overlay/50 transition-colors"
              >
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-primary font-medium">{p.meta.id}</span>
                    <span className="text-text-muted text-xs hidden md:inline">{p.meta.description}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="text-xs font-mono text-text-secondary capitalize">{p.meta.service}</span>
                </td>
                <td className={`py-3 px-2 text-right font-mono tabular-nums ${winner === "CLI" ? "text-cli" : "text-text-secondary"}`}>
                  ${cliCost.toFixed(3)}
                </td>
                <td className={`py-3 px-2 text-right font-mono tabular-nums ${winner === "MCP" ? "text-mcp" : "text-text-secondary"}`}>
                  ${mcpCost.toFixed(3)}
                </td>
                <td className="py-3 px-2 text-right font-mono tabular-nums text-text-secondary">
                  {((p.cli?.durationMs ?? 0) / 1000).toFixed(1)}s
                </td>
                <td className="py-3 px-2 text-right font-mono tabular-nums text-text-secondary">
                  {((p.mcp?.durationMs ?? 0) / 1000).toFixed(1)}s
                </td>
                <td className={`py-3 px-2 text-right font-mono tabular-nums ${cliCtx <= mcpCtx ? "text-cli" : "text-text-muted"}`}>
                  {fmtK(cliCtx)}
                </td>
                <td className={`py-3 px-2 text-right font-mono tabular-nums ${mcpCtx <= cliCtx ? "text-mcp" : "text-text-muted"}`}>
                  {fmtK(mcpCtx)}
                </td>
                <td className="py-3 px-2 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${
                      winner === "CLI"
                        ? "bg-cli-muted text-cli"
                        : winner === "MCP"
                          ? "bg-mcp-muted text-mcp"
                          : "bg-surface-overlay text-text-muted"
                    }`}
                  >
                    {winner}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
