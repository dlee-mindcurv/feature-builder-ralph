#!/usr/bin/env bats
# Unit tests for ralph utility functions (sourced mode)

setup() {
  load helpers/setup
  common_setup
  source_ralph
}

teardown() {
  common_teardown
}

# ---------------------------------------------------------------------------
# resolve_feature_file
# ---------------------------------------------------------------------------

@test "resolve_feature_file: bare name resolves to features/<name>/prd.json" {
  local result
  result="$(resolve_feature_file "pink-footer")"
  assert_equal "$result" "features/pink-footer/prd.json"
}

@test "resolve_feature_file: directory path appends /prd.json" {
  local result
  result="$(resolve_feature_file "features/pink-footer")"
  assert_equal "$result" "features/pink-footer/prd.json"
}

@test "resolve_feature_file: full .json path returned as-is" {
  local result
  result="$(resolve_feature_file "features/pink-footer/prd.json")"
  assert_equal "$result" "features/pink-footer/prd.json"
}

@test "resolve_feature_file: nested directory path appends /prd.json" {
  local result
  result="$(resolve_feature_file "some/nested/dir")"
  assert_equal "$result" "some/nested/dir/prd.json"
}

# ---------------------------------------------------------------------------
# feature_dir_from_file
# ---------------------------------------------------------------------------

@test "feature_dir_from_file: extracts dirname correctly" {
  local result
  result="$(feature_dir_from_file "features/pink-footer/prd.json")"
  assert_equal "$result" "features/pink-footer"
}

# ---------------------------------------------------------------------------
# setup_colors
# ---------------------------------------------------------------------------

@test "setup_colors: NO_COLOR disables all ANSI codes" {
  export NO_COLOR=1
  setup_colors
  assert_equal "$RED" ""
  assert_equal "$GREEN" ""
  assert_equal "$BOLD" ""
  assert_equal "$RESET" ""
}

@test "setup_colors: _use_color=false disables all ANSI codes" {
  unset NO_COLOR
  _use_color=false
  setup_colors
  assert_equal "$RED" ""
  assert_equal "$YELLOW" ""
  assert_equal "$CYAN" ""
}

@test "setup_colors: colors enabled when NO_COLOR unset and _use_color=true" {
  unset NO_COLOR
  _use_color=true
  setup_colors
  # RED should contain escape sequence
  [[ "$RED" == *"31m"* ]]
  [[ "$GREEN" == *"32m"* ]]
  [[ "$BOLD" == *"1m"* ]]
}

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

@test "RALPH_VERSION is set" {
  [[ -n "$RALPH_VERSION" ]]
}

@test "FEATURES_DIR defaults to features" {
  assert_equal "$FEATURES_DIR" "features"
}

@test "COMPLETION_PROMISE is set" {
  assert_equal "$COMPLETION_PROMISE" "RALPH-LOOP-COMPLETED"
}
