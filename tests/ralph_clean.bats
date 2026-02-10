#!/usr/bin/env bats
# Tests for the clean command

setup() {
  load helpers/setup
  common_setup
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Basic clean
# ---------------------------------------------------------------------------

@test "clean: removes agent files" {
  install_agents_and_commands
  ./ralph clean
  for f in build-user-story.md run-lint.md run-playwright.md run-typecheck.md write-tests.md; do
    [[ ! -f ".claude/agents/${f}" ]]
  done
}

@test "clean: removes command files" {
  install_agents_and_commands
  ./ralph clean
  [[ ! -f ".claude/commands/create-feature-from-json.md" ]]
}

@test "clean: removes .ralph-version" {
  install_agents_and_commands
  mkdir -p .claude
  echo "1.0.0" > .claude/.ralph-version
  ./ralph clean
  [[ ! -f ".claude/.ralph-version" ]]
}

@test "clean: reports correct count" {
  install_agents_and_commands
  run ./ralph clean
  assert_success
  assert_output --partial "Removed 6 file(s)"
}

@test "clean: reports 0 when nothing to remove" {
  run ./ralph clean
  assert_success
  assert_output --partial "Removed 0 file(s)"
}

@test "clean: does not remove feature files" {
  install_agents_and_commands
  install_fixture "prd-done.json" "my-feature"
  ./ralph clean
  [[ -f "features/my-feature/prd.json" ]]
}
