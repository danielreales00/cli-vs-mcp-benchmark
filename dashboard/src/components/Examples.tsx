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
    taskId: "N3",
    service: "notion",
    description: "Create a new page in a database",
    prompt: 'Create a new page in Notion database with the title "Benchmark Run" and a Status property set to "In Progress". Return the new page ID.',
    cli: {
      output: `Page created successfully.

New page ID: 3234c4dc-1280-814e-a2fb-ff067ccf6b36

Note: The database didn't have a Status property, so I added one as a select type (Notion's status type can't be created via the API). The property has options: Not Started, In Progress, and Done — set to "In Progress" as requested.`,
      cost: "$0.298",
      duration: "94.1s",
      tokens: 2675,
    },
    mcp: {
      output: `Page created. The new page ID is 3234c4dc-1280-8163-aab1-fdb137dfa480.`,
      cost: "$0.076",
      duration: "18.6s",
      tokens: 300,
    },
    verdict: "MCP wins 3.9x cheaper — CLI spent 18 turns discovering notion-cli subcommands, parsing JSON output, adding a missing property",
    verdictColor: "mcp",
  },
  {
    taskId: "S2",
    service: "slack",
    description: "Read channel and identify most active user",
    prompt: "Read the message history of a Slack channel. Find which user posted the most messages. Return their user ID, message count, and display name.",
    cli: {
      output: `The CLI only shows user IDs, not display names — the token lacks the users:read scope needed to resolve them. Here's what I can report from the data:

Most active user in C0AEQT28TQ9:

| Field | Value |
|-------|-------|
| User ID | U0ALNTEK2SG |
| Message count | 5 |
| Display name | Unavailable — the slack-cli token lacks users:read scope`,
      cost: "$0.219",
      duration: "73.2s",
      tokens: 1595,
    },
    mcp: {
      output: `Here are the results:

Most messages: CLI Test
- User ID: U0ALNTEK2SG
- Message count: 5
- Display name: CLI Test

Runner-up was Daniel Reales (U0AEVCN837T) with 3 messages, and Juan Andres Velasquez (U0AENC4H410) with 1.`,
      cost: "$0.072",
      duration: "17.7s",
      tokens: 540,
    },
    verdict: "MCP wins 3.1x cheaper — CLI took 14 turns iterating slack-cli commands, couldn't resolve display names",
    verdictColor: "mcp",
  },
  {
    taskId: "G2",
    service: "github",
    description: "Read a PR diff and summarize",
    prompt: "Read the diff for PR #3. Summarize what changed: which files, what was added, what was removed.",
    cli: {
      output: `**PR #3 Summary:**

- **Files changed:** 1 — src/utils.ts (new file)
- **Added:** Two simple utility functions:
  - add(a, b) — returns the sum of two numbers
  - multiply(a, b) — returns the product of two numbers
- **Removed:** Nothing — this is a pure addition.`,
      cost: "$0.046",
      duration: "15.7s",
      tokens: 229,
    },
    mcp: {
      output: `Here's the summary of PR #3:

PR: "Add utility functions" (feature/add-utils → main)

- 1 file added: src/utils.ts (new file, +7 lines)
- Nothing removed

The new file exports two basic math functions:
- add(a, b) — returns the sum
- multiply(a, b) — returns the product`,
      cost: "$0.088",
      duration: "16.0s",
      tokens: 479,
    },
    verdict: "CLI wins — gh is well-known, one-shot execution. MCP used 2x the tokens for the same answer",
    verdictColor: "cli",
  },
  {
    taskId: "P2",
    service: "postgres",
    description: "Create a table with schema",
    prompt: "Create a table with columns: id (serial primary key), name (text), value (numeric), created_at (timestamp default now).",
    cli: {
      output: `Table benchmark_run_mmpma7or created successfully.`,
      cost: "$0.042",
      duration: "12.5s",
      tokens: 138,
    },
    mcp: {
      output: `I need your approval to run the psql command. Could you approve the pending permission prompt so I can create the table?`,
      cost: "$0.128",
      duration: "27.6s",
      tokens: 1001,
    },
    verdict: "CLI wins 3x cheaper — psql is one-shot, MCP postgres server added multi-turn overhead",
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
