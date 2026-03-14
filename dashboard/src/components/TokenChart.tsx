import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { getLayer1Pairs } from "../data";

export function TokenChart() {
  const pairs = getLayer1Pairs();
  const data = pairs.map((p) => ({
    task: p.meta.id,
    cli: p.cli?.usage.outputTokens ?? 0,
    mcp: p.mcp?.usage.outputTokens ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} barGap={2} margin={{ top: 8, right: 0, bottom: 0, left: -4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="task"
          tick={{ fill: "#6b6b7b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6b6b7b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            const cli = payload.find((p) => p.dataKey === "cli")?.value as number;
            const mcp = payload.find((p) => p.dataKey === "mcp")?.value as number;
            return (
              <div className="rounded-lg border border-border bg-surface-overlay px-4 py-3 shadow-xl">
                <p className="font-mono text-xs text-text-muted mb-2">{label}</p>
                <div className="flex gap-6">
                  <div>
                    <span className="text-cli font-bold">{(cli ?? 0).toLocaleString()}</span>
                    <span className="text-text-muted text-xs ml-1">CLI</span>
                  </div>
                  <div>
                    <span className="text-mcp font-bold">{(mcp ?? 0).toLocaleString()}</span>
                    <span className="text-text-muted text-xs ml-1">MCP</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Bar dataKey="cli" radius={[3, 3, 0, 0]} maxBarSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.cli <= d.mcp ? "#f97316" : "#f9731666"} />
          ))}
        </Bar>
        <Bar dataKey="mcp" radius={[3, 3, 0, 0]} maxBarSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.mcp <= d.cli ? "#06b6d4" : "#06b6d466"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
