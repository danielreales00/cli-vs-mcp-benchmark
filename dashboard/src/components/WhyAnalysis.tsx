import { getLayer1Pairs, contextTokens } from "../data";

interface CostBreakdown {
  cacheRead: number;
  cacheCreate: number;
  output: number;
  input: number;
  total: number;
}

function breakdown(usage: {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
  totalCostUsd?: number;
}): CostBreakdown {
  return {
    cacheRead: (usage.cacheReadTokens ?? 0) * 0.30 / 1_000_000,
    cacheCreate: (usage.cacheCreationTokens ?? 0) * 3.75 / 1_000_000,
    output: usage.outputTokens * 15 / 1_000_000,
    input: usage.inputTokens * 3 / 1_000_000,
    total: usage.totalCostUsd ?? 0,
  };
}

function pct(n: number, total: number) {
  if (total === 0) return 0;
  return Math.round((n / total) * 100);
}

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
}

export function WhyAnalysis() {
  const pairs = getLayer1Pairs();

  const mcpWins = pairs.filter((p) => {
    const cc = p.cli?.usage.totalCostUsd ?? 0;
    const mc = p.mcp?.usage.totalCostUsd ?? 0;
    return mc < cc;
  });

  const cliWins = pairs.filter((p) => {
    const cc = p.cli?.usage.totalCostUsd ?? 0;
    const mc = p.mcp?.usage.totalCostUsd ?? 0;
    return cc < mc;
  });

  return (
    <div className="space-y-8">
      {/* Explanation */}
      <div className="text-sm text-text-secondary leading-relaxed max-w-2xl">
        <p>
          Every API call to Claude has four cost components:{" "}
          <span className="font-mono text-xs text-text-primary">cache_read</span> (re-reading conversation history each turn),{" "}
          <span className="font-mono text-xs text-text-primary">cache_create</span> (new content entering context),{" "}
          <span className="font-mono text-xs text-text-primary">output</span> (model&rsquo;s response tokens), and{" "}
          <span className="font-mono text-xs text-text-primary">input</span> (fresh prompt tokens).
          By breaking down the cost delta per task, we can see <em>why</em> one approach wins.
        </p>
      </div>

      {/* MCP Wins */}
      {mcpWins.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-mcp" />
            <h3 className="text-sm font-semibold text-text-primary">Where MCP wins &mdash; and why</h3>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>
          <div className="space-y-3">
            {mcpWins.map((p) => {
              const cli = breakdown(p.cli!.usage);
              const mcp = breakdown(p.mcp!.usage);
              const delta = cli.total - mcp.total;
              const crSaving = cli.cacheRead - mcp.cacheRead;
              const ccSaving = cli.cacheCreate - mcp.cacheCreate;
              const outSaving = cli.output - mcp.output;
              const cliCtx = contextTokens(p.cli!);
              const mcpCtx = contextTokens(p.mcp!);
              const ratio = cli.total / mcp.total;

              // Determine primary driver
              const drivers = [
                { name: "cache_read", value: crSaving, label: "More turns re-reading context" },
                { name: "cache_create", value: ccSaving, label: "Discovery output entering context" },
                { name: "output", value: outSaving, label: "Verbose model output" },
              ].sort((a, b) => b.value - a.value);

              return (
                <div key={p.meta.id} className="rounded-lg border border-border bg-surface-overlay p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="font-mono text-sm text-mcp font-medium">{p.meta.id}</span>
                      <span className="text-text-muted text-xs ml-2">{p.meta.service}</span>
                      <p className="text-sm text-text-secondary mt-0.5">{p.meta.description}</p>
                    </div>
                    <span className="text-xs font-mono text-mcp font-medium bg-mcp/10 px-2 py-1 rounded">
                      MCP {ratio.toFixed(1)}x cheaper
                    </span>
                  </div>

                  {/* Cost breakdown bars */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {drivers.map((d) => (
                      <div key={d.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">{d.name}</span>
                          <span className="text-[10px] font-mono text-text-muted">{pct(d.value, delta)}% of savings</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface overflow-hidden">
                          <div
                            className="h-full rounded-full bg-mcp/60"
                            style={{ width: `${Math.min(pct(d.value, delta), 100)}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-text-muted mt-1">{d.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-6 text-[11px] font-mono text-text-muted pt-3 border-t border-border-subtle">
                    <span>CLI: {fmtK(cliCtx)} ctx tokens</span>
                    <span>MCP: {fmtK(mcpCtx)} ctx tokens</span>
                    <span>CLI: {p.cli!.usage.outputTokens.toLocaleString()} out</span>
                    <span>MCP: {p.mcp!.usage.outputTokens.toLocaleString()} out</span>
                    <span className="text-mcp">Saved ${delta.toFixed(3)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CLI Wins */}
      {cliWins.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-cli" />
            <h3 className="text-sm font-semibold text-text-primary">Where CLI wins &mdash; and why</h3>
            <div className="h-px flex-1 bg-border-subtle" />
          </div>
          <div className="space-y-3">
            {cliWins.map((p) => {
              const cli = breakdown(p.cli!.usage);
              const mcp = breakdown(p.mcp!.usage);
              const delta = mcp.total - cli.total;
              const crSaving = mcp.cacheRead - cli.cacheRead;
              const ccSaving = mcp.cacheCreate - cli.cacheCreate;
              const outSaving = mcp.output - cli.output;
              const cliCtx = contextTokens(p.cli!);
              const mcpCtx = contextTokens(p.mcp!);
              const ratio = mcp.total / cli.total;

              const drivers = [
                { name: "cache_read", value: crSaving, label: "MCP re-reads tool schemas each turn" },
                { name: "cache_create", value: ccSaving, label: "MCP server responses entering context" },
                { name: "output", value: outSaving, label: "MCP model output overhead" },
              ].sort((a, b) => b.value - a.value);

              return (
                <div key={p.meta.id} className="rounded-lg border border-border bg-surface-overlay p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="font-mono text-sm text-cli font-medium">{p.meta.id}</span>
                      <span className="text-text-muted text-xs ml-2">{p.meta.service}</span>
                      <p className="text-sm text-text-secondary mt-0.5">{p.meta.description}</p>
                    </div>
                    <span className="text-xs font-mono text-cli font-medium bg-cli/10 px-2 py-1 rounded">
                      CLI {ratio.toFixed(1)}x cheaper
                    </span>
                  </div>

                  {/* Cost breakdown bars */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {drivers.map((d) => (
                      <div key={d.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">{d.name}</span>
                          <span className="text-[10px] font-mono text-text-muted">{pct(d.value, delta)}% of savings</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cli/60"
                            style={{ width: `${Math.min(pct(d.value, delta), 100)}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-text-muted mt-1">{d.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-6 text-[11px] font-mono text-text-muted pt-3 border-t border-border-subtle">
                    <span>CLI: {fmtK(cliCtx)} ctx tokens</span>
                    <span>MCP: {fmtK(mcpCtx)} ctx tokens</span>
                    <span>CLI: {p.cli!.usage.outputTokens.toLocaleString()} out</span>
                    <span>MCP: {p.mcp!.usage.outputTokens.toLocaleString()} out</span>
                    <span className="text-cli">Saved ${delta.toFixed(3)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
