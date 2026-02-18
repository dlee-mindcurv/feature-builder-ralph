#!/usr/bin/env bats
# Tests for the feature-complete-stop.sh hook and ralph startup cleanup

setup() {
  load helpers/setup
  common_setup
  # Copy the hook script into the test workspace
  mkdir -p .claude/hooks
  cp "${REPO_ROOT}/.claude/hooks/feature-complete-stop.sh" .claude/hooks/
  chmod +x .claude/hooks/feature-complete-stop.sh
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Hook: marker + state file present → both deleted
# ---------------------------------------------------------------------------

@test "hook: deletes both marker and state file when marker exists" {
  mkdir -p .claude
  echo "done" > .claude/ralph-completed
  echo "state" > .claude/ralph-loop.local.md

  run .claude/hooks/feature-complete-stop.sh
  assert_success
  assert_output --partial "Feature completion marker detected"
  [ ! -f .claude/ralph-completed ]
  [ ! -f .claude/ralph-loop.local.md ]
}

# ---------------------------------------------------------------------------
# Hook: marker present, no state file → marker deleted, no error
# ---------------------------------------------------------------------------

@test "hook: deletes marker even when state file is absent" {
  mkdir -p .claude
  echo "done" > .claude/ralph-completed

  run .claude/hooks/feature-complete-stop.sh
  assert_success
  assert_output --partial "Feature completion marker detected"
  [ ! -f .claude/ralph-completed ]
}

# ---------------------------------------------------------------------------
# Hook: no marker → no-op, state file preserved
# ---------------------------------------------------------------------------

@test "hook: no-op when marker file does not exist" {
  mkdir -p .claude
  echo "state" > .claude/ralph-loop.local.md

  run .claude/hooks/feature-complete-stop.sh
  assert_success
  refute_output --partial "Feature completion marker detected"
  [ -f .claude/ralph-loop.local.md ]
}

# ---------------------------------------------------------------------------
# Hook: neither file exists → clean exit
# ---------------------------------------------------------------------------

@test "hook: clean exit when neither marker nor state file exists" {
  mkdir -p .claude

  run .claude/hooks/feature-complete-stop.sh
  assert_success
  refute_output --partial "Feature completion marker detected"
}

# ---------------------------------------------------------------------------
# Ralph startup: cleans stale ralph-completed marker
# ---------------------------------------------------------------------------

@test "run: cleans stale .claude/ralph-completed at startup" {
  install_agents_and_commands
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"

  mkdir -p .claude
  echo "done" > .claude/ralph-completed

  # Use --dry-run so we don't need a real claude
  create_mock "claude" 'echo "mock claude: $*"'
  create_mock "npm" 'exit 0'
  run ./ralph run my-feature --dry-run
  assert_success
  [ ! -f .claude/ralph-completed ]
}

@test "run: startup proceeds normally without stale marker" {
  install_agents_and_commands
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"

  create_mock "claude" 'echo "mock claude: $*"'
  create_mock "npm" 'exit 0'
  run ./ralph run my-feature --dry-run
  assert_success
  [ ! -f .claude/ralph-completed ]
}

# ---------------------------------------------------------------------------
# Ralph startup: cleans stale marker even when all stories pass
# ---------------------------------------------------------------------------

@test "run: cleans stale marker before short-circuit exit" {
  install_agents_and_commands
  install_fixture "prd-done.json" "my-feature"
  create_app_dir "myapp"

  mkdir -p .claude
  echo "done" > .claude/ralph-completed

  create_mock "claude" 'echo "mock claude: $*"'
  create_mock "npm" 'exit 0'
  run ./ralph run my-feature
  assert_success
  assert_output --partial "already passing"
  [ ! -f .claude/ralph-completed ]
}
