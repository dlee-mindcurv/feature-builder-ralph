#!/usr/bin/env bats
# Tests for the init command

setup() {
  load helpers/setup
  common_setup
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# Basic init
# ---------------------------------------------------------------------------

@test "init: creates prd.json with correct defaults" {
  run ./ralph init test-feature
  assert_success
  assert_output --partial "Created features/test-feature/prd.json"
  [[ -f "features/test-feature/prd.json" ]]
}

@test "init: created JSON is valid" {
  ./ralph init test-feature
  run jq empty features/test-feature/prd.json
  assert_success
}

@test "init: default appDir is ." {
  ./ralph init test-feature
  run jq -r '.appDir' features/test-feature/prd.json
  assert_success
  assert_output "."
}

@test "init: default branch is feature/<name>" {
  ./ralph init test-feature
  run jq -r '.branchName' features/test-feature/prd.json
  assert_success
  assert_output "feature/test-feature"
}

@test "init: has US-001 with 5 jobs and passes=false" {
  ./ralph init test-feature
  run jq -r '.userStories[0].id' features/test-feature/prd.json
  assert_output "US-001"
  run jq '.userStories[0].jobs | length' features/test-feature/prd.json
  assert_output "5"
  run jq '.userStories[0].passes' features/test-feature/prd.json
  assert_output "false"
}

# ---------------------------------------------------------------------------
# Options
# ---------------------------------------------------------------------------

@test "init: --app-dir sets appDir" {
  ./ralph init test-feature --app-dir src
  run jq -r '.appDir' features/test-feature/prd.json
  assert_output "src"
}

@test "init: --project sets project name" {
  ./ralph init test-feature --project my-project
  run jq -r '.project' features/test-feature/prd.json
  assert_output "my-project"
}

@test "init: --branch sets branchName" {
  ./ralph init test-feature --branch fix/my-branch
  run jq -r '.branchName' features/test-feature/prd.json
  assert_output "fix/my-branch"
}

@test "init: all options combined" {
  ./ralph init test-feature --app-dir src --project myproj --branch dev/test
  run jq -r '.appDir' features/test-feature/prd.json
  assert_output "src"
  run jq -r '.project' features/test-feature/prd.json
  assert_output "myproj"
  run jq -r '.branchName' features/test-feature/prd.json
  assert_output "dev/test"
}

# ---------------------------------------------------------------------------
# Error cases
# ---------------------------------------------------------------------------

@test "init: rejects duplicate feature" {
  ./ralph init test-feature
  run ./ralph init test-feature
  assert_failure
  assert_output --partial "Feature already exists"
}

@test "init: requires feature name" {
  run ./ralph init
  assert_failure
  assert_output --partial "Usage"
}

@test "init: rejects unknown option" {
  run ./ralph init test-feature --unknown
  assert_failure
  assert_output --partial "Unknown init option"
}
