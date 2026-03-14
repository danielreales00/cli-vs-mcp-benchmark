import { useState } from "react";
import { motion } from "framer-motion";
import { HeroStats } from "./components/HeroStats";
import { CostChart } from "./components/CostChart";
import { ServiceBreakdown } from "./components/ServiceBreakdown";
import { DurationChart } from "./components/DurationChart";
import { TokenChart } from "./components/TokenChart";
import { ContextChart } from "./components/ContextChart";
import { TaskTable } from "./components/TaskTable";
import { Layer2Cards } from "./components/Layer2Cards";
import { Examples } from "./components/Examples";
import "./App.css";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function App() {
  const [activeLayer, setActiveLayer] = useState<1 | 2>(1);

  return (
    <div className="min-h-screen bg-surface">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-muted">
              Benchmark Report
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
          </div>

          <h1 className="text-center text-6xl font-bold tracking-[-0.04em] text-text-primary mb-3">
            <span className="text-cli">CLI</span>
            <span className="text-text-muted font-extralight mx-4 text-5xl">vs</span>
            <span className="text-mcp">MCP</span>
          </h1>

          <p className="text-center text-text-secondary text-base max-w-xl mx-auto leading-relaxed mt-4">
            Can Claude accomplish the same tasks cheaper and faster using command-line tools,
            or through direct MCP server integrations? We ran 22 identical tasks across
            4 services to find out.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-xs font-mono text-text-muted">
            <span>22 tasks</span>
            <span className="text-border">|</span>
            <span>4 services</span>
            <span className="text-border">|</span>
            <span>$2.90 total spend</span>
            <span className="text-border">|</span>
            <span>~20 min runtime</span>
          </div>
        </motion.header>

        {/* Methodology */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="rounded-xl border border-border bg-surface-raised p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-cli" />
                <h3 className="text-sm font-semibold text-text-primary">CLI + Skills</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Claude uses installed CLI tools (<span className="font-mono text-xs text-cli">gh</span>,{" "}
                <span className="font-mono text-xs text-cli">notion-cli</span>,{" "}
                <span className="font-mono text-xs text-cli">slack-cli</span>,{" "}
                <span className="font-mono text-xs text-cli">psql</span>) via Bash.
                It discovers subcommands through <span className="font-mono text-xs">--help</span>,
                builds the right invocation, and parses output. Same approach a developer would take in a terminal.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-raised p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-mcp" />
                <h3 className="text-sm font-semibold text-text-primary">MCP Servers</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Claude calls MCP tool endpoints directly &mdash; structured input, structured output,
                no shell involved. Notion, Slack, and Figma run as built-in claude.ai connectors.
                GitHub and Postgres run as configured MCP servers. The model picks the right tool from a list.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key findings */}
        <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible">
          <div className="rounded-xl border border-border bg-surface-raised p-6 mb-10">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Key Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-text-secondary leading-relaxed">
              <div>
                <p className="text-text-primary font-medium mb-1">MCP wins on unfamiliar CLIs</p>
                <p>
                  Notion and Slack tasks were <span className="text-mcp font-mono text-xs">1.8x cheaper</span> via MCP.
                  The CLI variant burned tokens running <span className="font-mono text-xs">--help</span>,
                  discovering subcommands, and parsing text output across multiple turns.
                </p>
              </div>
              <div>
                <p className="text-text-primary font-medium mb-1">CLI wins on well-known tools</p>
                <p>
                  Postgres tasks were <span className="text-cli font-mono text-xs">3x cheaper</span> via CLI,
                  GitHub <span className="text-cli font-mono text-xs">1.5x</span>.
                  Claude knows <span className="font-mono text-xs">psql</span> and <span className="font-mono text-xs">gh</span> by heart &mdash;
                  one-shot execution, no discovery overhead.
                </p>
              </div>
              <div>
                <p className="text-text-primary font-medium mb-1">The split is 8&ndash;7</p>
                <p>
                  MCP won 8 of 15 head-to-head tasks on cost.
                  Total spend: CLI <span className="text-cli font-mono text-xs">$1.53</span> vs
                  MCP <span className="text-mcp font-mono text-xs">$1.37</span>.
                  Neither approach dominates &mdash; the winner depends on how well the model knows the CLI.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Examples */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Section title="Side-by-Side Examples" subtitle="Same prompt, different approach — see the actual outputs">
            <Examples />
          </Section>
        </motion.div>

        {/* Hero stats */}
        <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible" className="mt-8">
          <HeroStats />
        </motion.div>

        {/* Layer toggle */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center mt-16 mb-10"
        >
          <div className="inline-flex rounded-lg border border-border bg-surface-raised p-1 gap-1">
            <button
              onClick={() => setActiveLayer(1)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeLayer === 1
                  ? "bg-surface-overlay text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Layer 1 &mdash; Head to Head
            </button>
            <button
              onClick={() => setActiveLayer(2)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeLayer === 2
                  ? "bg-surface-overlay text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Layer 2 &mdash; Single Path
            </button>
          </div>
        </motion.div>

        {activeLayer === 1 ? (
          <div className="space-y-8">
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <Section title="Cost per Task" subtitle="USD spent on each head-to-head task">
                <CostChart />
              </Section>
            </motion.div>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <Section title="By Service" subtitle="Aggregate cost and performance per integration">
                <ServiceBreakdown />
              </Section>
            </motion.div>

            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <Section title="Duration" subtitle="Wall-clock time in seconds">
                <DurationChart />
              </Section>
            </motion.div>

            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
              <Section title="Token Usage" subtitle="Output tokens per task">
                <TokenChart />
              </Section>
            </motion.div>

            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
              <Section title="Context Overhead" subtitle="Total context tokens loaded per task (input + cache read + cache create) — MCP tool schemas add to this">
                <ContextChart />
              </Section>
            </motion.div>

            <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
              <Section title="All Tasks" subtitle="Complete results including per-task context overhead">
                <TaskTable />
              </Section>
            </motion.div>
          </div>
        ) : (
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <Section title="Single-Path Demos" subtitle="Tasks where only CLI or MCP applies">
              <Layer2Cards />
            </Section>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-20 pb-12 text-center"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
          <p className="font-mono text-xs text-text-muted">
            Generated from run{" "}
            <span className="text-text-secondary">mmpma7or</span>
            <span className="mx-2 text-border-subtle">|</span>
            March 13, 2026
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-lg font-semibold text-text-primary tracking-tight">{title}</h2>
        <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
      </div>
      <div className="px-6 pb-6 pt-4">{children}</div>
    </div>
  );
}
