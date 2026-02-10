#!/usr/bin/env bats
# Tests for the reset command

setup() {
  load helpers/setup
  common_setup
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Basic reset
# ---------------------------------------------------------------------------

@test "reset: all jobs set to pending" {
  install_fixture "prd-done.json" "my-feature"
  ./ralph reset my-feature
  run jq -r '[.userStories[].jobs[].status] | unique | .[]' features/my-feature/prd.json
  assert_output "pending"
}

@test "reset: passes set to false" {
  install_fixture "prd-done.json" "my-feature"
  ./ralph reset my-feature
  run jq '.userStories[0].passes' features/my-feature/prd.json
  assert_output "false"
}

@test "reset: removes agent-log.json" {
  install_fixture "prd-done.json" "my-feature"
  install_log_fixture "agent-log.json" "my-feature"
  [[ -f "features/my-feature/agent-log.json" ]]
  ./ralph reset my-feature
  [[ ! -f "features/my-feature/agent-log.json" ]]
}

@test "reset: succeeds when no agent-log exists" {
  install_fixture "prd-done.json" "my-feature"
  run ./ralph reset my-feature
  assert_success
}

@test "reset: resets mixed feature completely" {
  install_fixture "prd-mixed.json" "my-feature"
  ./ralph reset my-feature
  run jq '[.userStories[] | .passes] | all(. == false)' features/my-feature/prd.json
  assert_output "true"
  run jq -r '[.userStories[].jobs[].status] | unique | .[]' features/my-feature/prd.json
  assert_output "pending"
}

@test "reset: prints success message" {
  install_fixture "prd-done.json" "my-feature"
  run ./ralph reset my-feature
  assert_success
  assert_output --partial "Reset all statuses"
}

# ---------------------------------------------------------------------------
# Error cases
# ---------------------------------------------------------------------------

@test "reset: requires argument" {
  run ./ralph reset
  assert_failure
  assert_output --partial "Usage"
}

@test "reset: fails for non-existent feature" {
  run ./ralph reset nonexistent
  assert_failure
  assert_output --partial "Feature file not found"
}
