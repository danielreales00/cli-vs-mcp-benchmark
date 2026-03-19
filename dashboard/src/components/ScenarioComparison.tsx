import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getScenarioComparison, contextTokens } from "../data";

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
}

export function ScenarioComparison() {
  const rows = getScenarioComparison();

  const chartData = rows.map((r) => ({
    name: r.meta.id,
    "CLI (no hints)": r.baseCli?.usage.totalCostUsd ?? 0,
    "CLI + cheatsheet": r.hintedCli?.usage.totalCostUsd ?? 0,
    MCP: r.mcp?.usage.totalCostUsd ?? 0,
  }));

  const totalBase = rows.reduce((s, r) => s + (r.baseCli?.usage.totalCostUsd ?? 0), 0);
  const totalHinted = rows.reduce((s, r) => s + (r.hintedCli?.usage.totalCostUsd ?? 0), 0);
  const totalMcp = rows.reduce((s, r) => s + (r.mcp?.usage.totalCostUsd ?? 0), 0);

  const baseWins = rows.filter((r) => (r.baseCli?.usage.totalCostUsd ?? Infinity) < (r.mcp?.usage.totalCostUsd ?? Infinity)).length;
  const hintedWins = rows.filter((r) => (r.hintedCli?.usage.totalCostUsd ?? Infinity) < (r.mcp?.usage.totalCostUsd ?? Infinity)).length;

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border border-border bg-surface-overlay p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cli opacity-40" />
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">CLI (no hints)</span>
          </div>
          <p className="text-xl font-bold tabular-nums text-text-secondary">${totalBase.toFixed(2)}</p>
          <p className="text-xs font-mono text-text-muted mt-1">Won {baseWins}/{rows.length} tasks</p>
        </div>
        <div className="rounded-lg border border-cli/30 bg-cli/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cli" />
            <span className="text-xs font-mono uppercase tracking-wider text-cli">CLI + cheatsheet</span>
          </div>
          <p className="text-xl font-bold tabular-nums text-cli">${totalHinted.toFixed(2)}</p>
          <p className="text-xs font-mono text-text-muted mt-1">Won {hintedWins}/{rows.length} tasks</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-overlay p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-mcp" />
            <span className="text-xs font-mono uppercase tracking-wider text-text-muted">MCP</span>
          </div>
          <p className="text-xl font-bold tabular-nums text-text-secondary">${totalMcp.toFixed(2)}</p>
          <p className="text-xs font-mono text-text-muted mt-1">Won {rows.length - hintedWins}/{rows.length} vs hinted</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barGap={1} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
            tickFormatter={(v: number) => `$${v.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "var(--font-mono, monospace)",
            }}
            formatter={(value) => [`$${Number(value).toFixed(3)}`, undefined]}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-mono, monospace)" }} />
          <Bar dataKey="CLI (no hints)" fill="#C2410C66" radius={[3, 3, 0, 0]} />
          <Bar dataKey="CLI + cheatsheet" fill="var(--color-cli)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="MCP" fill="var(--color-mcp)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed table */}
      <div className="overflow-x-auto mt-6 -mx-6 px-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Task</th>
              <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">CLI (base)</th>
              <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">CLI + hints</th>
              <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">MCP</th>
              <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Hint effect</th>
              <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Ctx (base)</th>
              <th className="text-right py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Ctx (hint)</th>
              <th className="text-center py-3 px-2 font-mono text-xs text-text-muted font-medium uppercase tracking-wider">Winner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const bc = r.baseCli?.usage.totalCostUsd ?? 0;
              const hc = r.hintedCli?.usage.totalCostUsd ?? 0;
              const mc = r.mcp?.usage.totalCostUsd ?? 0;
              const hintEffect = bc > 0 ? ((bc - hc) / bc * 100) : 0;
              const baseCtx = r.baseCli ? contextTokens(r.baseCli) : 0;
              const hintCtx = r.hintedCli ? contextTokens(r.hintedCli) : 0;
              const winner = hc < mc ? "CLI" : "MCP";

              return (
                <tr key={r.meta.id} className="border-b border-border-subtle hover:bg-surface-overlay/50 transition-colors">
                  <td className="py-3 px-2">
                    <span className="font-mono text-text-primary font-medium">{r.meta.id}</span>
                    <span className="text-text-muted text-xs ml-2 hidden md:inline">{r.meta.description}</span>
                  </td>
                  <td className="py-3 px-2 text-right font-mono tabular-nums text-text-muted">
                    ${bc.toFixed(3)}
                  </td>
                  <td className={`py-3 px-2 text-right font-mono tabular-nums ${winner === "CLI" ? "text-cli" : "text-text-secondary"}`}>
                    ${hc.toFixed(3)}
                  </td>
                  <td className={`py-3 px-2 text-right font-mono tabular-nums ${winner === "MCP" ? "text-mcp" : "text-text-secondary"}`}>
                    ${mc.toFixed(3)}
                  </td>
                  <td className={`py-3 px-2 text-right font-mono tabular-nums text-xs ${hintEffect > 0 ? "text-green-500" : "text-red-400"}`}>
                    {hintEffect > 0 ? "+" : ""}{hintEffect.toFixed(0)}%
                  </td>
                  <td className="py-3 px-2 text-right font-mono tabular-nums text-text-muted text-xs">
                    {fmtK(baseCtx)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono tabular-nums text-text-muted text-xs">
                    {fmtK(hintCtx)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${
                      winner === "CLI" ? "bg-cli-muted text-cli" : "bg-mcp-muted text-mcp"
                    }`}>
                      {winner}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          <span className="text-text-primary font-medium">The cheatsheet effect:</span>{" "}
          Accurate CLI usage hints (equivalent to a well-written{" "}
          <span className="font-mono text-xs text-text-primary">CLAUDE.md</span>) eliminate
          discovery overhead for unfamiliar tools. MCP gets this for free via tool schema injection.
          The question isn&rsquo;t CLI vs MCP &mdash; it&rsquo;s whether the model already knows the tool.
          If it does (or you teach it), CLI wins. If it doesn&rsquo;t, MCP&rsquo;s auto-injected schemas are cheaper
          than the model figuring it out on its own.
        </p>
      </div>
    </div>
  );
}
