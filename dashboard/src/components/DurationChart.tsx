import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { getLayer1Pairs } from "../data";

export function DurationChart() {
  const pairs = getLayer1Pairs();
  const data = pairs.map((p) => ({
    task: p.meta.id,
    cli: (p.cli?.durationMs ?? 0) / 1000,
    mcp: (p.mcp?.durationMs ?? 0) / 1000,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} barGap={2} margin={{ top: 8, right: 0, bottom: 0, left: -10 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="task"
          tick={{ fill: "#9B8E7B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#9B8E7B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}s`}
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
                    <span className="text-cli font-bold">{(cli ?? 0).toFixed(1)}s</span>
                    <span className="text-text-muted text-xs ml-1">CLI</span>
                  </div>
                  <div>
                    <span className="text-mcp font-bold">{(mcp ?? 0).toFixed(1)}s</span>
                    <span className="text-text-muted text-xs ml-1">MCP</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Bar dataKey="cli" radius={[3, 3, 0, 0]} maxBarSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.cli <= d.mcp ? "#C2410C" : "#C2410C66"} />
          ))}
        </Bar>
        <Bar dataKey="mcp" radius={[3, 3, 0, 0]} maxBarSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.mcp <= d.cli ? "#006039" : "#00603966"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
