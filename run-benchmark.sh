#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# CLI vs MCP Benchmark — Full Run
# ============================================================
#
# Usage:
#   ./run-benchmark.sh              # run everything
#   ./run-benchmark.sh --layer=1    # Layer 1 only
#   ./run-benchmark.sh --service=postgres  # one service
#   ./run-benchmark.sh --skip-preflight    # skip checks
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()  { echo -e "${CYAN}[bench]${NC} $*"; }
ok()   { echo -e "${GREEN}  [ok]${NC} $*"; }
warn() { echo -e "${YELLOW}  [warn]${NC} $*"; }
fail() { echo -e "${RED}  [fail]${NC} $*"; }

# --- Parse args ---
SKIP_PREFLIGHT=false
PASSTHROUGH_ARGS=()

for arg in "$@"; do
  if [[ "$arg" == "--skip-preflight" ]]; then
    SKIP_PREFLIGHT=true
  else
    PASSTHROUGH_ARGS+=("$arg")
  fi
done

# --- Preflight checks ---
preflight() {
  log "Running preflight checks..."
  local failed=0

  # .env exists
  if [[ -f .env ]]; then
    ok ".env file found"
  else
    fail ".env file missing (copy from .env.example)"
    failed=1
  fi

  # Required tools
  for tool in claude psql notion-cli slack-cli gh tsx; do
    if command -v "$tool" &>/dev/null; then
      ok "$tool found"
    else
      fail "$tool not found in PATH"
      failed=1
    fi
  done

  # Postgres reachable
  if PGPASSWORD=benchmark psql -h localhost -U postgres -d benchmark -c "SELECT 1" &>/dev/null; then
    ok "Postgres reachable"
  else
    fail "Postgres not reachable (is the container running?)"
    failed=1
  fi

  # Check required env vars from .env
  source <(grep -v '^#' .env | grep -v '^\s*$' | sed 's/^/export /')
  local required=(
    NOTION_TEST_PAGE_ID NOTION_TEST_DB_ID
    SLACK_TEST_CHANNEL_ID SLACK_TEST_THREAD_TS
    GITHUB_TEST_REPO GITHUB_TEST_PR_NUMBER
    DATABASE_URL
  )
  for var in "${required[@]}"; do
    if [[ -n "${!var:-}" ]]; then
      ok "$var is set"
    else
      fail "$var is empty or missing in .env"
      failed=1
    fi
  done

  if [[ $failed -ne 0 ]]; then
    echo ""
    fail "Preflight failed. Fix the issues above and retry."
    exit 1
  fi

  echo ""
  ok "All preflight checks passed"
  echo ""
}

if [[ "$SKIP_PREFLIGHT" == false ]]; then
  preflight
fi

# --- Run benchmark ---
START_TIME=$(date +%s)
log "${BOLD}Starting benchmark run${NC}"
echo ""

# Layer 1: head-to-head (CLI vs MCP)
log "${BOLD}=== Pass 1: CLI Runner (all tasks) ===${NC}"
echo ""

if npm run cli-run -- "${PASSTHROUGH_ARGS[@]}" 2>&1 | tee /tmp/bench-cli-run.log; then
  ok "CLI runner completed"
else
  fail "CLI runner failed"
  cat /tmp/bench-cli-run.log
  exit 1
fi

# Extract the run ID from output
RUN_ID=$(grep -oP 'Benchmark Run: \K\S+' /tmp/bench-cli-run.log)
if [[ -z "$RUN_ID" ]]; then
  fail "Could not extract run ID from CLI runner output"
  exit 1
fi

echo ""
log "Run ID: ${BOLD}$RUN_ID${NC}"

# --- Score ---
echo ""
log "${BOLD}=== Scoring ===${NC}"
echo ""

if npm run score -- --run="$RUN_ID" 2>&1 | tee /tmp/bench-score.log; then
  ok "Scoring completed"
else
  warn "Scoring had issues (manual scores may need review)"
fi

# --- Report ---
echo ""
log "${BOLD}=== Generating Report ===${NC}"
echo ""

if npm run report -- --run="$RUN_ID" 2>&1 | tee /tmp/bench-report.log; then
  ok "Report generated"
else
  fail "Report generation failed"
fi

# --- Summary ---
END_TIME=$(date +%s)
ELAPSED=$(( END_TIME - START_TIME ))
MINUTES=$(( ELAPSED / 60 ))
SECONDS_REM=$(( ELAPSED % 60 ))

echo ""
echo -e "${BOLD}============================================================${NC}"
echo -e "${BOLD} Benchmark Complete${NC}"
echo -e "${BOLD}============================================================${NC}"
echo ""
echo -e "  Run ID:    ${CYAN}$RUN_ID${NC}"
echo -e "  Duration:  ${CYAN}${MINUTES}m ${SECONDS_REM}s${NC}"
echo -e "  Results:   ${CYAN}results/raw/$RUN_ID/${NC}"
echo -e "  Report:    ${CYAN}results/reports/$RUN_ID.md${NC}"
echo ""
