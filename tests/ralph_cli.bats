#!/usr/bin/env bats
# CLI-level tests: --version, --help, --no-color, unknown commands, smart shorthand

setup() {
  load helpers/setup
  common_setup
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Version
# ---------------------------------------------------------------------------

@test "--version prints ralph v1.0.0" {
  run ./ralph --version
  assert_success
  assert_output "ralph v1.0.0"
}

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------

@test "--help prints usage with COMMANDS section" {
  run ./ralph --help
  assert_success
  assert_output --partial "COMMANDS"
  assert_output --partial "run <feature>"
}

@test "help command prints usage" {
  run ./ralph help
  assert_success
  assert_output --partial "COMMANDS"
}

@test "-h prints usage" {
  run ./ralph -h
  assert_success
  assert_output --partial "COMMANDS"
}

@test "no arguments prints help" {
  run ./ralph
  assert_success
  assert_output --partial "COMMANDS"
}

# ---------------------------------------------------------------------------
# --no-color
# ---------------------------------------------------------------------------

@test "--no-color suppresses ANSI escape codes in help" {
  unset NO_COLOR
  run ./ralph --no-color help
  assert_success
  # Should not contain ESC character
  refute_output --partial $'\033'
}

# ---------------------------------------------------------------------------
# Unknown command
# ---------------------------------------------------------------------------

@test "unknown command exits 1 and prints error" {
  run ./ralph nosuchcommand
  assert_failure
  assert_output --partial "Unknown command: nosuchcommand"
}

@test "unknown command also shows help" {
  run ./ralph nosuchcommand
  assert_failure
  assert_output --partial "COMMANDS"
}

# ---------------------------------------------------------------------------
# Smart shorthand
# ---------------------------------------------------------------------------

@test "smart shorthand: feature name routes to run when feature exists" {
  install_fixture "prd-done.json" "my-feature"
  create_app_dir "myapp"
  install_agents_and_commands
  # Use --dry-run so it doesn't actually call claude
  create_mock "jq" "$(cat <<'MOCK'
# Pass through to real jq
exec /usr/bin/jq "$@"
MOCK
  )"
  # We need real jq and a mock claude + npm
  create_mock "claude" 'echo "mock claude"'
  create_mock "npm" 'exit 0'
  run ./ralph my-feature --dry-run
  assert_success
  assert_output --partial "Dry run"
}

@test "smart shorthand: non-existent feature name exits 1" {
  run ./ralph nonexistent-feature
  assert_failure
  assert_output --partial "Unknown command: nonexistent-feature"
}
