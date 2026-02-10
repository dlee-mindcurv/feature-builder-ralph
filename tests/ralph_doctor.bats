#!/usr/bin/env bats
# Tests for the doctor command

setup() {
  load helpers/setup
  common_setup
  # Create mocks for all tools doctor checks
  create_mock "claude" '
    case "$1" in
      --version) echo "claude 1.0.0" ;;
      plugin)
        case "$2" in
          list) echo "ralph-wiggum" ;;
          install) echo "installed" ;;
        esac
        ;;
    esac
  '
  create_mock "jq" 'echo "jq-1.7"'
  create_mock "curl" 'echo "curl 8.0"'
  create_mock "node" 'echo "v20.0.0"'
  create_mock "npm" 'echo "10.0.0"'
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# All tools present
# ---------------------------------------------------------------------------

@test "doctor: reports all tools present" {
  run ./ralph doctor
  assert_success
  assert_output --partial "claude"
  assert_output --partial "jq"
  assert_output --partial "curl"
  assert_output --partial "node"
  assert_output --partial "npm"
}

@test "doctor: exits 0 when all tools found" {
  install_agents_and_commands
  mkdir -p features
  touch CLAUDE.md
  run ./ralph doctor
  assert_success
  assert_output --partial "All checks passed"
}

# ---------------------------------------------------------------------------
# Missing tool
# ---------------------------------------------------------------------------

@test "doctor: reports missing tool" {
  # Remove jq mock — restrict PATH so real jq isn't found
  rm "${TEST_TEMP_DIR}/mocks/jq"
  # Use a very restricted PATH that only has our mocks + basic system bins
  export PATH="${TEST_TEMP_DIR}/mocks:/usr/bin:/bin"
  # Check if system jq exists; if so skip this test
  if command -v jq >/dev/null 2>&1; then
    skip "jq is in /usr/bin or /bin, cannot test missing tool"
  fi
  run ./ralph doctor
  assert_output --partial "not found"
}

# ---------------------------------------------------------------------------
# Directory checks
# ---------------------------------------------------------------------------

@test "doctor: checks .claude/agents directory" {
  install_agents_and_commands
  run ./ralph doctor
  assert_success
  assert_output --partial ".claude/agents/"
}

@test "doctor: checks .claude/commands directory" {
  install_agents_and_commands
  run ./ralph doctor
  assert_success
  assert_output --partial ".claude/commands/"
}

@test "doctor: checks features directory" {
  mkdir -p features/test-feat
  cp "${FIXTURES_DIR}/prd-done.json" features/test-feat/prd.json
  run ./ralph doctor
  assert_success
  assert_output --partial "features/"
  assert_output --partial "1 feature(s) found"
}

# ---------------------------------------------------------------------------
# CLAUDE.md
# ---------------------------------------------------------------------------

@test "doctor: checks CLAUDE.md present" {
  install_agents_and_commands
  touch CLAUDE.md
  run ./ralph doctor
  assert_success
  assert_output --partial "CLAUDE.md found"
}

@test "doctor: checks CLAUDE.md missing" {
  install_agents_and_commands
  run ./ralph doctor
  assert_success
  assert_output --partial "CLAUDE.md not found"
}

# ---------------------------------------------------------------------------
# Plugin check
# ---------------------------------------------------------------------------

@test "doctor: checks ralph-wiggum plugin" {
  run ./ralph doctor
  assert_success
  assert_output --partial "ralph-wiggum"
}
