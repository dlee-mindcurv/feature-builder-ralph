#!/usr/bin/env bats
# Tests for the logs command

setup() {
  load helpers/setup
  common_setup
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Log display
# ---------------------------------------------------------------------------

@test "logs: displays table header" {
  install_fixture "prd-done.json" "my-feature"
  install_log_fixture "agent-log.json" "my-feature"
  run ./ralph logs my-feature
  assert_success
  assert_output --partial "Story"
  assert_output --partial "Job"
  assert_output --partial "Agent"
  assert_output --partial "Status"
}

@test "logs: shows all log entries" {
  install_fixture "prd-done.json" "my-feature"
  install_log_fixture "agent-log.json" "my-feature"
  run ./ralph logs my-feature
  assert_success
  assert_output --partial "build"
  assert_output --partial "build-user-story"
  assert_output --partial "write-tests"
  assert_output --partial "run-lint"
}

@test "logs: shows iteration counts" {
  install_fixture "prd-done.json" "my-feature"
  install_log_fixture "agent-log.json" "my-feature"
  run ./ralph logs my-feature
  assert_success
  assert_output --partial "3"
  assert_output --partial "2"
  assert_output --partial "5"
}

# ---------------------------------------------------------------------------
# Edge cases
# ---------------------------------------------------------------------------

@test "logs: handles empty log" {
  install_fixture "prd-done.json" "my-feature"
  install_log_fixture "agent-log-empty.json" "my-feature"
  run ./ralph logs my-feature
  assert_success
  assert_output --partial "Agent log is empty"
}

@test "logs: handles missing log file" {
  install_fixture "prd-done.json" "my-feature"
  run ./ralph logs my-feature
  assert_success
  assert_output --partial "No agent log found"
}

# ---------------------------------------------------------------------------
# Error cases
# ---------------------------------------------------------------------------

@test "logs: requires argument" {
  run ./ralph logs
  assert_failure
  assert_output --partial "Usage"
}
