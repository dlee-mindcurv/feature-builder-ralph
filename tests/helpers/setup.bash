#!/usr/bin/env bash
# Shared setup/teardown and mock helpers for ralph bats tests

# Locate repo root (parent of tests/)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FIXTURES_DIR="${REPO_ROOT}/tests/fixtures"

# Load bats helpers
load "${REPO_ROOT}/tests/test_helper/bats-support/load.bash"
load "${REPO_ROOT}/tests/test_helper/bats-assert/load.bash"

# ---------------------------------------------------------------------------
# common_setup — create temp workspace, copy ralph, disable color
# ---------------------------------------------------------------------------
common_setup() {
  TEST_TEMP_DIR="$(mktemp -d)"
  cp "${REPO_ROOT}/ralph" "${TEST_TEMP_DIR}/ralph"
  chmod +x "${TEST_TEMP_DIR}/ralph"
  cd "$TEST_TEMP_DIR"
  export NO_COLOR=1

  # Initialize a git repo so worktree operations work
  git init -q
  git commit -q --allow-empty -m "initial"
}

# ---------------------------------------------------------------------------
# common_teardown — remove temp workspace
# ---------------------------------------------------------------------------
common_teardown() {
  if [[ -n "${TEST_TEMP_DIR:-}" ]] && [[ -d "$TEST_TEMP_DIR" ]]; then
    rm -rf "$TEST_TEMP_DIR"
  fi
}

# ---------------------------------------------------------------------------
# source_ralph — source ralph with RALPH_TESTING=1 for function-level tests
# ---------------------------------------------------------------------------
source_ralph() {
  export RALPH_TESTING=1
  # shellcheck disable=SC1091
  source "${TEST_TEMP_DIR}/ralph"
}

# ---------------------------------------------------------------------------
# create_mock — write a mock executable into $TEST_TEMP_DIR/mocks/
# Usage: create_mock "curl" 'echo "mock curl called"'
# ---------------------------------------------------------------------------
create_mock() {
  local name="$1"
  local body="${2:-exit 0}"
  local mock_dir="${TEST_TEMP_DIR}/mocks"
  mkdir -p "$mock_dir"
  printf '#!/usr/bin/env bash\n%s\n' "$body" > "${mock_dir}/${name}"
  chmod +x "${mock_dir}/${name}"
  export PATH="${mock_dir}:${PATH}"
}

# ---------------------------------------------------------------------------
# install_fixture — copy a fixture JSON to features/<name>/prd.json
# Usage: install_fixture "prd-done.json" "my-feature"
# ---------------------------------------------------------------------------
install_fixture() {
  local fixture="$1"
  local feature_name="$2"
  mkdir -p "features/${feature_name}"
  cp "${FIXTURES_DIR}/${fixture}" "features/${feature_name}/prd.json"
}

# ---------------------------------------------------------------------------
# install_log_fixture — copy a fixture to features/<name>/agent-log.json
# Usage: install_log_fixture "agent-log.json" "my-feature"
# ---------------------------------------------------------------------------
install_log_fixture() {
  local fixture="$1"
  local feature_name="$2"
  mkdir -p "features/${feature_name}"
  cp "${FIXTURES_DIR}/${fixture}" "features/${feature_name}/agent-log.json"
}

# ---------------------------------------------------------------------------
# create_app_dir — create the appDir referenced in a fixture
# Usage: create_app_dir "myapp"
# ---------------------------------------------------------------------------
create_app_dir() {
  local name="$1"
  mkdir -p "$name"
}

# ---------------------------------------------------------------------------
# install_agents_and_commands — touch all agent/command files in .claude/
# ---------------------------------------------------------------------------
install_agents_and_commands() {
  mkdir -p .claude/agents .claude/commands
  for f in build-user-story.md run-lint.md run-playwright.md run-typecheck.md write-tests.md; do
    touch ".claude/agents/${f}"
  done
  for f in create-feature-from-json.md; do
    touch ".claude/commands/${f}"
  done
}

# ---------------------------------------------------------------------------
# create_settings_local — create .claude/settings.local.json with permissions
# Usage: create_settings_local '["Bash(jq:*)","Bash(custom:*)"]'
# ---------------------------------------------------------------------------
create_settings_local() {
  local perms="${1:-[]}"
  mkdir -p .claude
  printf '{"permissions":{"allow":%s}}' "$perms" > .claude/settings.local.json
}
