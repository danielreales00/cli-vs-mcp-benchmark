import { motion } from "framer-motion";
import { HeroStats } from "./components/HeroStats";
import { CostChart } from "./components/CostChart";
import { ServiceBreakdown } from "./components/ServiceBreakdown";
import { DurationChart } from "./components/DurationChart";
import { ContextChart } from "./components/ContextChart";
import { TaskTable } from "./components/TaskTable";
import { WhyAnalysis } from "./components/WhyAnalysis";
import { ScenarioComparison } from "./components/ScenarioComparison";
import { Examples } from "./components/Examples";
import "./App.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">

        {/* --- CHAPTER 1: THE QUESTION --- */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-text-muted">
              Benchmark Report
            </p>
            <a
              href="https://www.linkedin.com/in/daniel-reales-203224213/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
            >
              <span className="text-xs font-medium">Daniel Reales</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>

          <h1 className="editorial-heading text-5xl md:text-7xl text-text-primary mb-6">
            It&rsquo;s not <span className="italic text-cli">CLI</span> vs <span className="italic text-mcp">MCP</span>.<br />
            It&rsquo;s what the model<br />
            <span className="italic text-text-secondary">already knows.</span>
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mt-8">
            Everyone frames it as a choice: CLI tools or MCP servers?
            We ran 8 identical multi-step tasks across 4 services both ways
            and measured every token. The winner isn&rsquo;t the mechanism &mdash;
            it&rsquo;s model familiarity with the tool.
          </p>

          <div className="flex items-center gap-3 mt-10 text-sm text-text-muted">
            <span className="font-medium text-text-secondary">Daniel Reales</span>
            <span className="text-border">&middot;</span>
            <span className="font-mono text-xs">March 2026</span>
            <span className="text-border">&middot;</span>
            <span className="font-mono text-xs">8 pipelines, 4 services, $3.56 spent</span>
          </div>
        </motion.header>

        {/* --- THE TWO APPROACHES --- */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-2 border-cli pl-6">
              <h3 className="editorial-heading text-2xl text-text-primary mb-3">
                CLI + Skills
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Claude runs <span className="font-mono text-xs text-cli">gh</span>,{" "}
                <span className="font-mono text-xs text-cli">psql</span>,{" "}
                <span className="font-mono text-xs text-cli">notion-cli</span>, and{" "}
                <span className="font-mono text-xs text-cli">slack-cli</span> through Bash.
                It discovers subcommands, pipes output, and parses text.
                Fastest when it already knows the tool cold.
              </p>
            </div>
            <div className="border-l-2 border-mcp pl-6">
              <h3 className="editorial-heading text-2xl text-text-primary mb-3">
                MCP Servers
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Claude calls structured tool endpoints &mdash; typed input, typed output,
                no shell. Tool schemas are auto-injected into context.
                Fastest when orchestrating multiple operations it hasn&rsquo;t seen before.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- CHAPTER 2: THE HEADLINE --- */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-10">
            Familiarity wins.<br />
            <span className="italic text-text-secondary">Every time.</span>
          </h2>

          <HeroStats />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-text-secondary leading-relaxed">
            <div>
              <p className="text-text-primary font-medium mb-2">Known tools = CLI wins</p>
              <p>
                Claude knows <span className="font-mono text-xs">psql</span> and{" "}
                <span className="font-mono text-xs">gh</span> from training data.
                Result: <span className="text-cli font-mono text-xs font-medium">3&ndash;5x cheaper</span> via CLI.
                One compound command, one turn, done.
              </p>
            </div>
            <div>
              <p className="text-text-primary font-medium mb-2">Unknown tools = MCP wins</p>
              <p>
                Claude doesn&rsquo;t know <span className="font-mono text-xs">notion-cli</span> or{" "}
                <span className="font-mono text-xs">slack-cli</span>.
                MCP was <span className="text-mcp font-mono text-xs font-medium">1.4&ndash;2.3x cheaper</span> because
                its auto-injected schemas skip the discovery tax.
              </p>
            </div>
            <div>
              <p className="text-text-primary font-medium mb-2">Teach the tool = CLI wins again</p>
              <p>
                When we added CLI cheatsheets to the prompt (like a good{" "}
                <span className="font-mono text-xs">CLAUDE.md</span>), CLI flipped from losing to winning
                on Slack. The mechanism doesn&rsquo;t matter &mdash; knowledge does.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- CHAPTER 3: SEE IT YOURSELF --- */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <Narration>
            Same prompt. Same task. Two completely different execution paths.
            Click through the examples below to see how the model approached each one.
          </Narration>

          <Card>
            <Examples />
          </Card>
        </motion.div>

        {/* --- CHAPTER 4: THE NUMBERS --- */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-4">
            Cost per task
          </h2>
          <p className="text-text-secondary text-sm mb-8 max-w-xl">
            Each bar is one task run. The shorter bar won. GitHub and Postgres
            consistently favor CLI. Notion and Slack favor MCP.
          </p>
          <Card><CostChart /></Card>
        </motion.div>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-4">
            By service
          </h2>
          <p className="text-text-secondary text-sm mb-8 max-w-xl">
            The pattern is clear when you aggregate by service.
            Model familiarity with the CLI is the deciding factor.
          </p>
          <Card><ServiceBreakdown /></Card>
        </motion.div>

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-4">
            Wall-clock time
          </h2>
          <p className="text-text-secondary text-sm mb-8 max-w-xl">
            CLI is faster when it pipelines. MCP is faster when the CLI needs discovery.
            Duration tracks cost almost perfectly.
          </p>
          <Card><DurationChart /></Card>
        </motion.div>

        {/* --- CHAPTER 5: THE HIDDEN COST --- */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-4">
            The context tax
          </h2>
          <Narration>
            Every MCP tool call loads the full tool schema into the model&rsquo;s context window.
            On every turn. This &ldquo;context tax&rdquo; is invisible in the API response but
            shows up clearly in token consumption.
          </Narration>
          <Card><ContextChart /></Card>
        </motion.div>

        {/* --- CHAPTER 6: WHY --- */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-4">
            Why each approach wins
          </h2>
          <Narration>
            We decomposed every cost delta into three components: cache reads (re-reading
            context each turn), cache creates (new content entering context), and output
            tokens (model verbosity). The dominant factor varies by task.
          </Narration>
          <Card><WhyAnalysis /></Card>
        </motion.div>

        {/* --- CHAPTER 7: THE CHEATSHEET EFFECT --- */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-4">
            What if you teach<br />
            <span className="italic text-text-secondary">the model the CLI?</span>
          </h2>
          <Narration>
            MCP&rsquo;s advantage on unfamiliar tools comes from auto-injected schemas.
            But what if you give CLI the same knowledge? We re-ran every task with
            accurate CLI cheatsheets in the prompt &mdash; equivalent to a well-written{" "}
            <span className="font-mono text-xs">CLAUDE.md</span>.
          </Narration>
          <Card><ScenarioComparison /></Card>
        </motion.div>

        {/* --- CHAPTER 8: FULL DATA --- */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <h2 className="editorial-heading text-3xl text-text-primary mb-4">
            Full results
          </h2>
          <p className="text-text-secondary text-sm mb-8 max-w-xl">
            Every task, both variants, with context overhead.
          </p>
          <Card><TaskTable /></Card>
        </motion.div>

        {/* --- CONCLUSION --- */}
        <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible" className="mb-20">
          <div className="border-t border-border pt-12">
            <h2 className="editorial-heading text-4xl md:text-5xl text-text-primary mb-6">
              Stop asking<br />
              <span className="italic text-text-secondary">&ldquo;CLI or MCP?&rdquo;</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
              The right question is: <em>does the model already know this tool?</em>
            </p>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mt-4">
              If yes &mdash; use CLI. It&rsquo;s cheaper, faster, and pipelines naturally.
              If no &mdash; either use MCP (auto-injected schemas) or teach the model
              via <span className="font-mono text-sm">CLAUDE.md</span>.
              Both work. The cost driver isn&rsquo;t the mechanism. It&rsquo;s the number of turns
              the model needs to figure out what to do.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="pb-16">
          <div className="h-px bg-border-subtle mb-10" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-text-primary mb-1">Daniel Reales</p>
              <p className="text-xs text-text-muted leading-relaxed max-w-sm">
                Building at the intersection of AI agents and developer tooling.
                This benchmark was built entirely with Claude Code.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/danielreales00/cli-vs-mcp-benchmark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                Source
              </a>
              <a
                href="https://www.linkedin.com/in/daniel-reales-203224213/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>

          <p className="font-mono text-[10px] text-text-muted mt-8 text-center">
            Runs mmpoarhv & mmwxo7de &middot; Built with Claude Code
          </p>
        </footer>
      </div>
    </div>
  );
}

function Narration({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base text-text-secondary leading-relaxed max-w-2xl mb-8">
      {children}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised p-6 overflow-hidden">
      {children}
    </div>
  );
}
