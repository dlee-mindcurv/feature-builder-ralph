#!/usr/bin/env bats
# Tests for the status command

setup() {
  load helpers/setup
  common_setup
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Single feature status
# ---------------------------------------------------------------------------

@test "status: shows PASS and 1/1 stories for done feature" {
  install_fixture "prd-done.json" "done-feature"
  run ./ralph status done-feature
  assert_success
  assert_output --partial "PASS"
  assert_output --partial "1/1 stories complete"
}

@test "status: shows WIP and 0/1 stories for pending feature" {
  install_fixture "prd-pending.json" "pending-feature"
  run ./ralph status pending-feature
  assert_success
  assert_output --partial "WIP"
  assert_output --partial "0/1 stories complete"
}

@test "status: shows mixed PASS/WIP and 1/2 stories" {
  install_fixture "prd-mixed.json" "mixed-feature"
  run ./ralph status mixed-feature
  assert_success
  assert_output --partial "PASS"
  assert_output --partial "WIP"
  assert_output --partial "1/2 stories complete"
}

@test "status: shows job names and statuses" {
  install_fixture "prd-done.json" "done-feature"
  run ./ralph status done-feature
  assert_success
  assert_output --partial "build"
  assert_output --partial "done"
}

# ---------------------------------------------------------------------------
# All features
# ---------------------------------------------------------------------------

@test "status: no args discovers all features" {
  install_fixture "prd-done.json" "feat-a"
  install_fixture "prd-pending.json" "feat-b"
  run ./ralph status
  assert_success
  assert_output --partial "feat-a"
  assert_output --partial "feat-b"
}

@test "status: no features shows info message" {
  run ./ralph status
  assert_success
  assert_output --partial "No features found"
}

# ---------------------------------------------------------------------------
# Error cases
# ---------------------------------------------------------------------------

@test "status: non-existent feature exits 1" {
  run ./ralph status nonexistent
  assert_failure
  assert_output --partial "Feature file not found"
}

# ---------------------------------------------------------------------------
# Shorthand resolution
# ---------------------------------------------------------------------------

@test "status: resolves feature shorthand" {
  install_fixture "prd-done.json" "my-feat"
  run ./ralph status my-feat
  assert_success
  assert_output --partial "my-feat"
}

@test "status: resolves explicit path" {
  install_fixture "prd-done.json" "my-feat"
  run ./ralph status features/my-feat/prd.json
  assert_success
  assert_output --partial "my-feat"
}
