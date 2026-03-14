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
import { getLayer1Pairs, contextTokens } from "../data";

export function ContextChart() {
  const pairs = getLayer1Pairs();

  const data = pairs.map((p) => ({
    name: p.meta.id,
    CLI: p.cli ? contextTokens(p.cli) : 0,
    MCP: p.mcp ? contextTokens(p.mcp) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} barGap={2} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
          tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "var(--font-mono, monospace)",
          }}
          formatter={(value) => [`${(Number(value) / 1000).toFixed(1)}k tokens`, undefined]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-mono, monospace)" }}
        />
        <Bar dataKey="CLI" fill="var(--color-cli)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="MCP" fill="var(--color-mcp)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
