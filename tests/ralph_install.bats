#!/usr/bin/env bats
# Tests for the install and update commands

setup() {
  load helpers/setup
  common_setup
  # Mock curl: parse -o flag and create the output file
  create_mock "curl" '
    output_file=""
    while [[ $# -gt 0 ]]; do
      case "$1" in
        -o) output_file="$2"; shift 2 ;;
        *) shift ;;
      esac
    done
    if [[ -n "$output_file" ]]; then
      mkdir -p "$(dirname "$output_file")"
      echo "# mock downloaded content" > "$output_file"
    fi
  '
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# install
# ---------------------------------------------------------------------------

@test "install: creates .claude/agents/ directory" {
  run ./ralph install
  assert_success
  [[ -d ".claude/agents" ]]
}

@test "install: creates .claude/commands/ directory" {
  run ./ralph install
  assert_success
  [[ -d ".claude/commands" ]]
}

@test "install: downloads all 5 agents" {
  ./ralph install
  for f in build-user-story.md run-lint.md run-playwright.md run-typecheck.md write-tests.md; do
    [[ -f ".claude/agents/${f}" ]]
  done
}

@test "install: downloads command file" {
  ./ralph install
  [[ -f ".claude/commands/create-feature-from-json.md" ]]
}

@test "install: creates learnings.md if missing" {
  ./ralph install
  [[ -f "features/learnings.md" ]]
}

@test "install: preserves existing learnings.md" {
  mkdir -p features
  echo "my custom learnings" > features/learnings.md
  ./ralph install
  run cat features/learnings.md
  assert_output "my custom learnings"
}

@test "install: creates .ralph-version" {
  ./ralph install
  [[ -f ".claude/.ralph-version" ]]
  run cat .claude/.ralph-version
  assert_output "1.0.0"
}

@test "install: reports success count" {
  run ./ralph install
  assert_success
  assert_output --partial "5 agents"
  assert_output --partial "1 command(s)"
}

# ---------------------------------------------------------------------------
# install skip-existing behavior
# ---------------------------------------------------------------------------

@test "install: skips existing files on second run" {
  ./ralph install
  # Modify one file to check it's not overwritten
  echo "custom content" > .claude/agents/build-user-story.md
  ./ralph install
  run cat .claude/agents/build-user-story.md
  assert_output "custom content"
}

# ---------------------------------------------------------------------------
# update overwrites
# ---------------------------------------------------------------------------

@test "update: overwrites existing files" {
  ./ralph install
  echo "custom content" > .claude/agents/build-user-story.md
  ./ralph update
  run cat .claude/agents/build-user-story.md
  assert_output "# mock downloaded content"
}

# ---------------------------------------------------------------------------
# curl failure
# ---------------------------------------------------------------------------

@test "install: handles curl failure" {
  # Override mock to always fail
  create_mock "curl" 'exit 1'
  run ./ralph install
  assert_failure
  assert_output --partial "Failed to download"
}
