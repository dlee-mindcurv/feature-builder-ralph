#!/usr/bin/env bats
# Tests for permission management (ensure_permissions, check_permissions)

setup() {
  load helpers/setup
  common_setup
  # Mock curl so install doesn't hit the network
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
# ensure_permissions — creates file when missing
# ---------------------------------------------------------------------------

@test "ensure_permissions: creates settings.local.json when missing" {
  source_ralph
  setup_colors
  ensure_permissions
  [[ -f ".claude/settings.local.json" ]]
}

@test "ensure_permissions: created file is valid JSON" {
  source_ralph
  setup_colors
  ensure_permissions
  jq empty .claude/settings.local.json
}

@test "ensure_permissions: adds all required permissions" {
  source_ralph
  setup_colors
  ensure_permissions

  # Check all 4 permissions are present
  run jq -e '.permissions.allow | index("Bash(*)")' .claude/settings.local.json
  assert_success

  run jq -e '.permissions.allow | index("Write")' .claude/settings.local.json
  assert_success

  run jq -e '.permissions.allow | index("Edit")' .claude/settings.local.json
  assert_success

  run jq -e '.permissions.allow | index("Skill(ralph-wiggum:cancel-ralph)")' .claude/settings.local.json
  assert_success
}

@test "ensure_permissions: adds correct count of permissions" {
  source_ralph
  setup_colors
  ensure_permissions

  local count
  count="$(jq '.permissions.allow | length' .claude/settings.local.json)"
  # REQUIRED_PERMISSIONS has 4 entries
  [[ "$count" -eq 4 ]]
}

# ---------------------------------------------------------------------------
# ensure_permissions — preserves existing permissions
# ---------------------------------------------------------------------------

@test "ensure_permissions: preserves user-added permissions" {
  create_settings_local '["Bash(my-custom-tool:*)"]'
  source_ralph
  setup_colors
  ensure_permissions

  # Custom permission still present
  run jq -e '.permissions.allow | index("Bash(my-custom-tool:*)")' .claude/settings.local.json
  assert_success

  # Required permissions also added
  run jq -e '.permissions.allow | index("Bash(*)")' .claude/settings.local.json
  assert_success
}

# ---------------------------------------------------------------------------
# ensure_permissions — no duplicates on re-run
# ---------------------------------------------------------------------------

@test "ensure_permissions: no duplicates on repeated runs" {
  source_ralph
  setup_colors
  ensure_permissions
  local count_first
  count_first="$(jq '.permissions.allow | length' .claude/settings.local.json)"

  # Run again
  ensure_permissions
  local count_second
  count_second="$(jq '.permissions.allow | length' .claude/settings.local.json)"

  [[ "$count_first" -eq "$count_second" ]]
}

# ---------------------------------------------------------------------------
# ensure_permissions — handles empty file
# ---------------------------------------------------------------------------

@test "ensure_permissions: handles empty file" {
  mkdir -p .claude
  touch .claude/settings.local.json
  source_ralph
  setup_colors
  ensure_permissions
  run jq -e '.permissions.allow | index("Bash(*)")' .claude/settings.local.json
  assert_success
}

# ---------------------------------------------------------------------------
# ensure_permissions — handles skeleton without allow array
# ---------------------------------------------------------------------------

@test "ensure_permissions: handles {} skeleton" {
  mkdir -p .claude
  echo '{}' > .claude/settings.local.json
  source_ralph
  setup_colors
  ensure_permissions
  run jq -e '.permissions.allow | index("Bash(*)")' .claude/settings.local.json
  assert_success
}

@test "ensure_permissions: handles permissions without allow" {
  mkdir -p .claude
  echo '{"permissions":{}}' > .claude/settings.local.json
  source_ralph
  setup_colors
  ensure_permissions
  run jq -e '.permissions.allow | index("Bash(*)")' .claude/settings.local.json
  assert_success
}

# ---------------------------------------------------------------------------
# check_permissions — reports status
# ---------------------------------------------------------------------------

@test "check_permissions: reports all present when synced" {
  source_ralph
  setup_colors
  ensure_permissions
  run check_permissions
  assert_success
  assert_output --partial "all required permissions present"
}

@test "check_permissions: reports missing when file absent" {
  source_ralph
  setup_colors
  run check_permissions
  assert_failure
  assert_output --partial "not found"
}

@test "check_permissions: reports count of missing permissions" {
  create_settings_local '["Bash(jq:*)"]'
  source_ralph
  setup_colors
  run check_permissions
  assert_failure
  assert_output --partial "missing"
}

# ---------------------------------------------------------------------------
# install command — syncs permissions
# ---------------------------------------------------------------------------

@test "install: syncs permissions" {
  run ./ralph install
  assert_success
  assert_output --partial "Permissions synced"
  [[ -f ".claude/settings.local.json" ]]
  run jq -e '.permissions.allow | index("Bash(*)")' .claude/settings.local.json
  assert_success
}

# ---------------------------------------------------------------------------
# doctor command — reports permission status
# ---------------------------------------------------------------------------

@test "doctor: reports permissions status" {
  # Doctor mocks jq, so ensure_permissions won't work, but check_permissions
  # should at least report something about permissions
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
  create_mock "node" 'echo "v20.0.0"'
  create_mock "npm" 'echo "10.0.0"'
  create_mock "gh" 'echo "gh version 2.40.0"'
  # No settings file exists, doctor should report missing
  run ./ralph doctor
  assert_output --partial "permissions"
}
