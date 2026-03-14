# CLI vs MCP Benchmark

## What this is
Benchmark comparing Claude Code CLI+Skills vs pure MCP servers on cost and task accuracy.

## Architecture
- **Pass 1 (CLI):** `claude -p` with `--allowedTools`/`--disallowedTools`, JSON output
- **Pass 2 (Agent SDK TS):** Per-step token tracking for Layer 1 tasks only

## Services
1. Notion — search, read, create, update
2. Slack — read, search, send, threads
3. GitHub — issues, PRs, CI
4. Postgres — queries, DDL, inserts

## Task layers
- **Layer 1:** 15 head-to-head tasks (CLI+Skills vs MCP, same task)
- **Layer 2:** 7 single-path demos (where each approach shines alone)

## Stack
TypeScript (strict), tsx for running, js-yaml for task definitions.

## Commands
- `npm run cli-run` — Pass 1 benchmark
- `npm run sdk-run` — Pass 2 benchmark
- `npm run score` — Score results
- `npm run report` — Generate comparison report
