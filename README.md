<p align="center">
  <img src="https://img.shields.io/badge/cost-$3.56_total-black?style=flat-square" alt="Total Cost">
  <img src="https://img.shields.io/badge/tasks-15_pipelines-black?style=flat-square" alt="Tasks">
  <img src="https://img.shields.io/badge/services-4-black?style=flat-square" alt="Services">
  <img src="https://img.shields.io/badge/built_with-Claude_Code-7c3aed?style=flat-square" alt="Built with Claude Code">
</p>

<h1 align="center">
  It's not <em>CLI</em> vs <em>MCP</em>.<br>
  It's what the model already knows.
</h1>

<p align="center">
  <strong>A benchmark comparing Claude Code CLI+Skills against MCP servers<br>on cost, speed, and accuracy across real-world automation tasks.</strong>
</p>

<p align="center">
  <a href="https://cli-vs-mcp.vercel.app">Live Dashboard</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a href="https://www.linkedin.com/in/daniel-reales-203224213/">LinkedIn</a>
</p>

---

## The Question

Everyone frames it as a binary: *CLI tools or MCP servers?*

We ran **8 identical multi-step pipelines** across **4 services** through both approaches and measured every token. The answer surprised us.

## The Answer

**The mechanism doesn't matter. Model familiarity does.**

```
                        CLI cheaper ◄──────────────────► MCP cheaper
                                    │
  Postgres  ████████████████████░░░░│  CLI wins 3.1x — psql is in the training data
  GitHub    ████████░░░░░░░░░░░░░░░│  CLI wins 1.2x — gh is well-known
  Notion    ░░░░░░░░░░░░░░░░████████  MCP wins 1.2x — notion-cli is obscure
  Slack     ░░░░░░░░░░░░░░████████░░  MCP wins 1.8x — slack-cli needs discovery
```

## Three Key Findings

### 1. Known tools = CLI wins

Claude knows `psql` and `gh` from training data. It writes piped one-liners, finishes in one turn, and moves on. Result: **3-5x cheaper** via CLI for Postgres and GitHub tasks.

### 2. Unknown tools = MCP wins

Claude doesn't know `notion-cli` or `slack-cli` well. Without MCP, it burns tokens on `--help` flags, trial-and-error, and multi-turn discovery loops. MCP's auto-injected schemas skip this entirely — **1.4-2.3x cheaper**.

### 3. Teach the model = CLI catches up

When we added CLI cheatsheets to the prompt (equivalent to a well-written `CLAUDE.md`), CLI **flipped from losing to winning** on Slack tasks. The bottleneck was always knowledge, not transport.

---

## Results at a Glance

| Task | Service | CLI Cost | MCP Cost | Winner | Why |
|------|---------|----------|----------|--------|-----|
| N1 | Notion | $0.268 | $0.659 | CLI | Computed stats in-process, no round-trips |
| N2 | Notion | $0.402 | $0.175 | **MCP** | Structured calls vs 11-turn CLI discovery |
| S1 | Slack | $0.299 | $0.144 | **MCP** | Resolved display names directly |
| S2 | Slack | $0.126 | $0.089 | **MCP** | Thread read in one call vs parsing JSON |
| G1 | GitHub | $0.098 | $0.116 | CLI | `gh list \| gh create` piped in one shot |
| G2 | GitHub | $0.114 | $0.130 | CLI | Familiar with `gh pr view --json` |
| P1 | Postgres | $0.067 | $0.324 | CLI | Entire SQL pipeline in one `psql -c` |
| P2 | Postgres | $0.113 | $0.234 | CLI | Schema introspection via information_schema |

**Totals:** CLI $1.49 / MCP $1.87 / Hinted CLI $1.44

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              src/tasks/definitions.yaml               │
│         8 head-to-head  +  7 single-path demos        │
└──────────────────┬──────────────────┬────────────────┘
                   │                  │
           ┌───────▼───────┐  ┌──────▼────────┐
           │   Pass 1       │  │   Pass 2       │
           │   claude -p    │  │   Agent SDK    │
           │   CLI runner   │  │   TS runner    │
           └───────┬───────┘  └──────┬────────┘
                   │                  │
           ┌───────▼──────────────────▼────────┐
           │        results/raw/<runId>/         │
           │   Per-task JSON  +  _summary.json   │
           └───────┬──────────────────┬────────┘
                   │                  │
           ┌───────▼───────┐  ┌──────▼────────┐
           │   Scorer       │  │  Report Gen    │
           │   npm run score│  │  npm run report│
           └───────────────┘  └───────────────┘
```

### Two Passes, Different Granularity

| Pass | Runner | Measures |
|------|--------|----------|
| **Pass 1** | `claude -p` (CLI) | Total cost, duration, token counts, success/failure |
| **Pass 2** | Claude Agent SDK (TypeScript) | Per-step token breakdown, individual tool call logs |

### Task Layers

- **Layer 1** — 8 head-to-head tasks (same task, both variants), 2 per service
- **Layer 2** — 7 single-path demos showcasing unique strengths of each approach

### Services Under Test

| Service | CLI Approach | MCP Server | What We Test |
|---------|-------------|------------|--------------|
| **Notion** | `notion-cli` via Bash | `claude_ai_Notion` | Search, read, create, aggregate stats |
| **Slack** | `slack-cli` via Bash | `claude_ai_Slack` | Read channels/threads, profile users, post |
| **GitHub** | `gh` via Bash | `mcp__github` | Issues, PRs, CI status, triage |
| **Postgres** | `psql` via Bash | `mcp__postgres` | Joins, DDL, data quality audits |

---

## Quick Start

### Prerequisites

- **Node.js** 20+
- **[Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)** installed and authenticated
- Access to target services (Notion, Slack, GitHub, Postgres)

### Install

```bash
git clone https://github.com/danielreales00/cli-vs-mcp-benchmark.git
cd cli-vs-mcp-benchmark
npm install
```

### Configure

Create a `.env` in the project root:

```env
# Notion
NOTION_API_KEY=secret_...
NOTION_TEST_PAGE_ID=...

# Slack
SLACK_TEST_CHANNEL_ID=...
SLACK_TEST_THREAD_TS=...

# GitHub
GITHUB_TEST_REPO=owner/repo
GITHUB_TEST_PR_NUMBER=1
GITHUB_PAT=ghp_...

# Postgres
DATABASE_URL=postgresql://...
```

### Run

```bash
# Full benchmark (CLI pass)
npm run cli-run

# Full benchmark (Agent SDK pass — per-step tracking)
npm run sdk-run

# Filter runs
npm run cli-run -- --service=slack          # one service
npm run cli-run -- --layer=1 --variant=mcp  # layer + variant
npm run cli-run -- --id=P1                  # single task

# Analyze
npm run score -- --run=<runId>
npm run report -- --run=<runId>
```

Results land in `results/raw/<runId>/` — one JSON per task, plus `_summary.json`.

---

## Project Structure

```
src/
├── config.ts                    # Env loading, template resolution, helpers
├── tasks/
│   ├── definitions.yaml         # 8 Layer-1 + 7 Layer-2 task definitions
│   ├── definitions-hinted.yaml  # CLI variants with tool cheatsheets
│   ├── types.ts                 # TaskDefinition type
│   └── loader.ts                # YAML loader
├── runners/
│   ├── cli.ts                   # Pass 1: claude -p with JSON output
│   ├── sdk.ts                   # Pass 2: Agent SDK with per-step logs
│   ├── filters.ts               # CLI arg parsing (--service, --layer, etc.)
│   └── types.ts                 # TaskResult, ToolCallLog, RunSummary
└── analysis/
    ├── scorer.ts                # Score task outputs against expected results
    └── markdown.ts              # Generate comparison reports

results/
├── raw/                         # Run output directories
└── reports/                     # Generated markdown reports

static/
└── index.html                   # Editorial article with Chart.js visualizations

dashboard/                       # Vite + React interactive dashboard
```

---

## How It Works

Each task is defined in YAML with **two variants** that perform identical work through different mechanisms:

**CLI variant** — `claude -p` with `--allowedTools=Bash,Read` and `--disallowedTools=mcp__*`. The model must shell out to command-line tools to complete the task. It discovers usage, writes commands, and parses text output.

**MCP variant** — `claude -p` with only specific MCP tools whitelisted (e.g., `mcp__claude_ai_Slack__slack_read_channel`). The model calls structured endpoints with typed schemas injected into context.

**Hinted CLI variant** — Same as CLI, but the prompt includes a cheatsheet of available subcommands — simulating a well-maintained `CLAUDE.md`.

The runner captures: total cost, input/output/cache tokens, wall-clock duration, and success status. The SDK pass adds per-step tool call logs for deeper analysis.

---

## The Takeaway

> Stop asking "CLI or MCP?" — ask "does the model already know this tool?"

| Model knows the tool well | Use CLI | Cheaper, faster, composes with pipes |
|--------------------------|---------|--------------------------------------|
| Model doesn't know the tool | Use MCP | Schemas skip the discovery tax |
| You can write docs | Use CLI + CLAUDE.md | Best of both worlds |

---

## License

MIT

---

<p align="center">
  <sub>Built by <a href="https://www.linkedin.com/in/daniel-reales-203224213/">Daniel Reales</a> — entirely with Claude Code</sub>
</p>
