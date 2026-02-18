#!/usr/bin/env bats
# Tests for agent guardrails: learnings write-back and iteration caps

setup() {
  load helpers/setup
  AGENTS_DIR="${REPO_ROOT}/.claude/agents"
}

# ---------------------------------------------------------------------------
# Learnings write-back: run-playwright
# ---------------------------------------------------------------------------

@test "run-playwright: contains Write learnings instruction" {
  run grep -c "Write learnings" "${AGENTS_DIR}/run-playwright.md"
  assert_success
  [[ "$output" -ge 1 ]]
}

@test "run-playwright: write-back references \$LEARNINGS_FILE" {
  run grep "append.*\\\$LEARNINGS_FILE" "${AGENTS_DIR}/run-playwright.md"
  assert_success
}

@test "run-playwright: write-back format includes [run-playwright] tag" {
  run grep '\[run-playwright\]' "${AGENTS_DIR}/run-playwright.md"
  assert_success
}

# ---------------------------------------------------------------------------
# Learnings write-back: write-tests
# ---------------------------------------------------------------------------

@test "write-tests: contains Write learnings instruction" {
  run grep -c "Write learnings" "${AGENTS_DIR}/write-tests.md"
  assert_success
  [[ "$output" -ge 1 ]]
}

@test "write-tests: write-back references \$LEARNINGS_FILE" {
  run grep "append.*\\\$LEARNINGS_FILE" "${AGENTS_DIR}/write-tests.md"
  assert_success
}

@test "write-tests: write-back format includes [write-tests] tag" {
  run grep '\[write-tests\]' "${AGENTS_DIR}/write-tests.md"
  assert_success
}

# ---------------------------------------------------------------------------
# Learnings write-back: build-user-story
# ---------------------------------------------------------------------------

@test "build-user-story: contains Write learnings instruction" {
  run grep -c "Write learnings" "${AGENTS_DIR}/build-user-story.md"
  assert_success
  [[ "$output" -ge 1 ]]
}

@test "build-user-story: write-back references \$LEARNINGS_FILE" {
  run grep "append.*\\\$LEARNINGS_FILE" "${AGENTS_DIR}/build-user-story.md"
  assert_success
}

@test "build-user-story: write-back format includes [build-user-story] tag" {
  run grep '\[build-user-story\]' "${AGENTS_DIR}/build-user-story.md"
  assert_success
}

# ---------------------------------------------------------------------------
# Playwright iteration cap
# ---------------------------------------------------------------------------

@test "run-playwright: contains 3-iteration cap" {
  run grep "3 times" "${AGENTS_DIR}/run-playwright.md"
  assert_success
}

@test "run-playwright: iteration cap instructs to stop iterating" {
  run grep "stop iterating" "${AGENTS_DIR}/run-playwright.md"
  assert_success
}

@test "run-playwright: iteration cap instructs to set error in JSON" {
  run grep 'set.*"error"' "${AGENTS_DIR}/run-playwright.md"
  assert_success
}

@test "run-playwright: iteration cap says not to continue beyond 3" {
  run grep "Do not continue beyond 3 iterations" "${AGENTS_DIR}/run-playwright.md"
  assert_success
}

# ---------------------------------------------------------------------------
# Learnings format consistency
# ---------------------------------------------------------------------------

@test "all agents: write-back format uses consistent pattern" {
  # All three agents should use the `- [agent-name] <story-id>: <finding>` format
  for agent in run-playwright write-tests build-user-story; do
    run grep "\[${agent}\].*<story-id>" "${AGENTS_DIR}/${agent}.md"
    assert_success
  done
}
