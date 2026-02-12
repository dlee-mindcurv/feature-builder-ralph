#!/usr/bin/env bats
# Tests for the run command

setup() {
  load helpers/setup
  common_setup
  install_agents_and_commands
  # Mock claude so we never actually call it
  create_mock "claude" 'echo "mock claude: $*"'
  # Mock npm so worktree npm ci doesn't fail
  create_mock "npm" 'exit 0'
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Dry run
# ---------------------------------------------------------------------------

@test "run: --dry-run shows command with feature path" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run
  assert_success
  assert_output --partial "Dry run"
  assert_output --partial "features/my-feature/prd.json"
}

@test "run: --dry-run includes completion promise" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run
  assert_success
  assert_output --partial "RALPH-LOOP-COMPLETED"
}

@test "run: --dry-run includes max-iterations" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run
  assert_success
  assert_output --partial "50"
}

# ---------------------------------------------------------------------------
# Banner
# ---------------------------------------------------------------------------

@test "run: shows banner with feature info" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run
  assert_success
  assert_output --partial "Feature:"
  assert_output --partial "App dir:"
  assert_output --partial "Progress:"
  assert_output --partial "Max iters:"
}

# ---------------------------------------------------------------------------
# Option pass-through
# ---------------------------------------------------------------------------

@test "run: --model passes through in dry-run command" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run --model opus
  assert_success
  assert_output --partial "--model opus"
}

@test "run: --resume shows resume mode in banner" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run --resume
  assert_success
  assert_output --partial "resume"
}

@test "run: --max-iterations custom value" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run --max-iterations 100
  assert_success
  assert_output --partial "100"
}

@test "run: --dangerously-skip-permissions passes through" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run --dangerously-skip-permissions
  assert_success
  assert_output --partial "dangerously-skip-permissions"
}

# ---------------------------------------------------------------------------
# Error cases
# ---------------------------------------------------------------------------

@test "run: fails with missing argument" {
  run ./ralph run
  assert_failure
  assert_output --partial "Usage"
}

@test "run: fails with missing feature file" {
  run ./ralph run nonexistent
  assert_failure
  assert_output --partial "Feature file not found"
}

@test "run: fails with missing appDir" {
  install_fixture "prd-pending.json" "my-feature"
  # Don't create the appDir "myapp"
  run ./ralph run my-feature --dry-run
  assert_failure
  assert_output --partial "App directory not found"
}

@test "run: rejects unknown option" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --unknown-flag
  assert_failure
  assert_output --partial "Unknown run option"
}

# ---------------------------------------------------------------------------
# Short-circuit when all stories pass
# ---------------------------------------------------------------------------

@test "run: exits immediately when all stories already pass" {
  install_fixture "prd-done.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature
  assert_success
  assert_output --partial "already passing"
  assert_output --partial "nothing to do"
}

@test "run: does not invoke claude when all stories pass" {
  install_fixture "prd-done.json" "my-feature"
  create_app_dir "myapp"
  # Mock claude to write a marker file if called
  create_mock "claude" 'touch "$TEST_TEMP_DIR/claude-was-called"; echo "mock claude"'
  run ./ralph run my-feature
  assert_success
  [ ! -f "$TEST_TEMP_DIR/claude-was-called" ]
}

@test "run: shows feature status when all stories pass" {
  install_fixture "prd-done.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature
  assert_success
  assert_output --partial "PASS"
  assert_output --partial "1/1 stories complete"
}

@test "run: does not short-circuit when stories are pending" {
  install_fixture "prd-pending.json" "my-feature"
  create_app_dir "myapp"
  run ./ralph run my-feature --dry-run
  assert_success
  refute_output --partial "already passing"
  assert_output --partial "Dry run"
}
