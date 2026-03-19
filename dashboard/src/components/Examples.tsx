import { useState } from "react";

interface Example {
  taskId: string;
  service: string;
  description: string;
  prompt: string;
  cli: {
    output: string;
    cost: string;
    duration: string;
    tokens: number;
  };
  mcp: {
    output: string;
    cost: string;
    duration: string;
    tokens: number;
  };
  verdict: string;
  verdictColor: "cli" | "mcp" | "tie";
}

const examples: Example[] = [
  {
    taskId: "N2",
    service: "notion",
    description: "Read page tree, create database from extracted data",
    prompt: "Read a Notion page and all its child pages. Collect titles and content. Create a new database with a row for each child page including title, whether it has content, and source.",
    cli: {
      output: `Done. Here's the summary:

Parent page: "Benchmark Test Page" — 5 children found (3 child pages, 2 child databases)

Database created: "Page Index — mmpoarhv"

Rows added:

| Page Title | Has Content | Source |
|---|---|---|
| Benchmark Results | No | automated |
| Thread Summary — mmpksxmi | Yes | automated |
| Thread Summary — mmpma7or | Yes | automated |`,
      cost: "$0.402",
      duration: "103.9s",
      tokens: 4261,
    },
    mcp: {
      output: `Done. Here's what I did:

1. Read the parent page "Benchmark Test Page" and found 3 child pages
2. Fetched each child page — all 3 had text content:
   - Thread Summary — mmpksxmi
   - Thread Summary — mmpma7or
   - Stats Summary — mmpoarhv
3. Created database "Page Index — mmpoarhv" with 3 rows`,
      cost: "$0.175",
      duration: "42.5s",
      tokens: 1189,
    },
    verdict: "MCP wins 2.3x cheaper — structured create-database and create-pages calls vs CLI discovering notion-cli subcommands across 11 turns",
    verdictColor: "mcp",
  },
  {
    taskId: "S1",
    service: "slack",
    description: "Read channel, profile users, post activity report",
    prompt: "Read a channel's full history, group messages by user, look up each user's display name, then post a formatted activity report sorted by message count.",
    cli: {
      output: `Done. The activity report has been posted to #general with the subject line "Channel Activity Report — mmpoarhv".

Here's what was posted:

- U0ALNTEK2SG — 7 messages, last active 2026-03-14 01:07:36
- U0AEVCN837T — 5 messages, last active 2026-03-14 01:08:01
- U0AENC4H410 — 1 message, last active 2026-03-13 18:52:34

Note: display names unavailable — slack-cli only returns user IDs.`,
      cost: "$0.299",
      duration: "92.0s",
      tokens: 2599,
    },
    mcp: {
      output: `Done. The activity report has been posted to #general.

Summary:
- cli_test — 8 messages, last active 2026-03-13 21:02:14
- Daniel Reales — 5 messages, last active 2026-03-13 20:08:01
- jvelasquez — 1 message, last active 2026-03-13 18:52:34`,
      cost: "$0.144",
      duration: "39.6s",
      tokens: 1786,
    },
    verdict: "MCP wins 2.1x cheaper — slack_read_channel + slack_read_user_profile resolved display names directly. CLI couldn't resolve user IDs and used 341k context tokens vs 105k",
    verdictColor: "mcp",
  },
  {
    taskId: "G1",
    service: "github",
    description: "Audit issues, categorize by label, create triage summary",
    prompt: "List all open issues in a repo. Categorize by label, count per category, note the oldest. Create a triage issue with a markdown table and recommended actions.",
    cli: {
      output: `Done. Here's the summary:

- 6 open issues, all labeled "benchmark"
- Oldest: #1 (created 2026-03-13) — within 7 days, so recommended action is "review"
- Triage issue created: github.com/.../issues/8`,
      cost: "$0.098",
      duration: "33.3s",
      tokens: 863,
    },
    mcp: {
      output: `Created #9 with the triage summary.

Recap:
- benchmark — 6 open issues, oldest is #1 (Mar 13) → review
- triage — 1 open issue, oldest is #8 (Mar 14) → review
- All issues are under 7 days old, so none flagged for closure`,
      cost: "$0.116",
      duration: "29.2s",
      tokens: 1184,
    },
    verdict: "CLI wins 1.2x cheaper — gh list + gh create in a few piped commands. MCP was faster but used more output tokens",
    verdictColor: "cli",
  },
  {
    taskId: "P1",
    service: "postgres",
    description: "Join tables, aggregate metrics, create summary table",
    prompt: "Join benchmark_items and benchmark_metrics. Compute per-item total requests, errors, error rate, and avg p99 latency for active items. Create a summary table and find the highest error rate.",
    cli: {
      output: `Table item_health_mmpoarhv created. The item with the highest error rate is beta-api (backend) at 1.51% — 400 errors out of 26,500 requests, with an average p99 latency of 243.57ms.`,
      cost: "$0.067",
      duration: "18.6s",
      tokens: 493,
    },
    mcp: {
      output: `I see you haven't been approving these commands. Would you like me to instead write the SQL to a .sql file that you can run yourself? Or do you want to approve the psql commands so I can execute them directly?`,
      cost: "$0.324",
      duration: "67.0s",
      tokens: 1769,
    },
    verdict: "CLI wins 4.9x cheaper — psql executed the entire JOIN + CREATE TABLE AS in one command. MCP spent 14 turns and 259k context tokens waiting for approvals",
    verdictColor: "cli",
  },
];

export function Examples() {
  const [activeExample, setActiveExample] = useState(0);
  const ex = examples[activeExample];

  return (
    <div>
      {/* Example selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {examples.map((e, i) => (
          <button
            key={e.taskId}
            onClick={() => setActiveExample(i)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 cursor-pointer border ${
              i === activeExample
                ? "bg-surface-overlay text-text-primary border-border shadow-sm"
                : "text-text-muted border-transparent hover:text-text-secondary hover:border-border-subtle"
            }`}
          >
            {e.taskId}
            <span className="ml-1.5 text-text-muted capitalize">{e.service}</span>
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div className="mb-5 rounded-lg bg-surface p-4 border border-border-subtle">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Prompt</span>
          <span className="text-xs text-text-muted">({ex.description})</span>
        </div>
        <p className="text-sm text-text-primary font-mono leading-relaxed">{ex.prompt}</p>
      </div>

      {/* Side by side outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* CLI */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cli" />
              <span className="text-sm font-semibold text-text-primary">CLI + Skills</span>
            </div>
            <div className="flex gap-3 text-[11px] font-mono text-text-muted">
              <span className="text-cli">{ex.cli.cost}</span>
              <span>{ex.cli.duration}</span>
            </div>
          </div>
          <div className="text-[13px] text-text-secondary font-mono leading-relaxed whitespace-pre-wrap bg-surface-overlay rounded-md p-4 max-h-64 overflow-y-auto border border-border-subtle">
            {ex.cli.output}
          </div>
          <div className="mt-3 flex gap-4 text-[11px] font-mono text-text-muted">
            <span>Output tokens: <span className="text-text-secondary">{ex.cli.tokens.toLocaleString()}</span></span>
          </div>
        </div>

        {/* MCP */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mcp" />
              <span className="text-sm font-semibold text-text-primary">MCP Server</span>
            </div>
            <div className="flex gap-3 text-[11px] font-mono text-text-muted">
              <span className="text-mcp">{ex.mcp.cost}</span>
              <span>{ex.mcp.duration}</span>
            </div>
          </div>
          <div className="text-[13px] text-text-secondary font-mono leading-relaxed whitespace-pre-wrap bg-surface-overlay rounded-md p-4 max-h-64 overflow-y-auto border border-border-subtle">
            {ex.mcp.output}
          </div>
          <div className="mt-3 flex gap-4 text-[11px] font-mono text-text-muted">
            <span>Output tokens: <span className="text-text-secondary">{ex.mcp.tokens.toLocaleString()}</span></span>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`rounded-lg p-4 border ${
        ex.verdictColor === "cli"
          ? "border-cli/20 bg-cli/5"
          : ex.verdictColor === "mcp"
            ? "border-mcp/20 bg-mcp/5"
            : "border-border bg-surface-overlay"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold uppercase ${
            ex.verdictColor === "cli"
              ? "text-cli"
              : ex.verdictColor === "mcp"
                ? "text-mcp"
                : "text-text-muted"
          }`}>
            {ex.verdictColor === "tie" ? "Draw" : `${ex.verdictColor.toUpperCase()} Wins`}
          </span>
          <span className="text-sm text-text-secondary">{ex.verdict}</span>
        </div>
      </div>
    </div>
  );
}
