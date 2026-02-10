# Ralph: Subagent-Driven Feature Development

Ralph is a declarative feature development system built on [Claude Code](https://docs.anthropic.com/en/docs/claude-code). You define features as JSON specifications with user stories, and Claude Code subagents autonomously implement them — building code, writing tests, fixing type errors, and resolving lint violations.

## How It Works

```
features/pink-footer/prd.json          .claude/agents/
┌──────────────────────────┐     ┌──────────────────────────┐
│  User Story: US-001      │     │  build-user-story.md     │
│  ├─ build    → pending   │────▶│  run-playwright.md       │
│  ├─ playwright→ pending  │     │  write-tests.md          │
│  ├─ test     → pending   │     │  run-typecheck.md        │
│  ├─ typecheck→ pending   │     │  run-lint.md             │
│  └─ lint     → pending   │     └──────────────────────────┘
└──────────────────────────┘
              │
              ▼
    /create-feature-from-json
    (orchestrator command)
              │
              ▼
     All jobs done → passes: true
     All stories pass → COMPLETED
```

1. **Define** a feature in `features/<name>/prd.json` with user stories and acceptance criteria
2. **Run** the orchestrator: `/create-feature-from-json features/<name>/prd.json`
3. **Agents execute** jobs in dependency order, running in parallel where possible
4. Each agent updates its job status to `"done"` in the feature file when complete
5. When all stories pass, the feature is complete

## Project Structure

```
├── features/                  # Feature definitions
│   ├── status.json            # Registry of all features
│   └── <feature-name>/
│       └── prd.json           # User stories, jobs, statuses
├── .claude/
│   ├── agents/                # Subagent definitions
│   │   ├── build-user-story.md
│   │   ├── run-playwright.md
│   │   ├── write-tests.md
│   │   ├── run-typecheck.md
│   │   └── run-lint.md
│   └── commands/
│       └── create-feature-from-json.md   # Orchestrator
├── example/                   # Target Next.js application (TaskFlow)
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/ui/     # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   └── __tests__/         # Vitest test suites
│   ├── package.json
│   └── ...config files
├── CLAUDE.md                  # Claude Code project instructions
└── README.md
```

## Subagents

Each agent handles one job type and receives the feature file path and app directory:

| Agent | Purpose | Tools |
|-------|---------|-------|
| `build-user-story` | Implements the story code, sets status to `"generated"` | Read, Write, Edit |
| `run-playwright` | Runs Playwright E2E tests, promotes build to `"done"` | Read, Write, Edit, Bash, Glob, Grep |
| `write-tests` | Writes unit tests matching project patterns | Read, Write, Edit, Bash |
| `run-typecheck` | Runs `tsc --noEmit` and fixes errors | Read, Write, Edit, Bash |
| `run-lint` | Runs ESLint and fixes violations | Read, Write, Edit, Bash |

### Job Dependencies

Jobs declare dependencies via `dependsOn`. The orchestrator only dispatches a job when its own status is `"pending"` and its dependency is resolved. This prevents completed jobs from being re-dispatched on subsequent invocations.

The build job uses a two-phase status flow: the build agent sets it to `"generated"`, then the Playwright agent promotes it to `"done"` after visual validation passes.

```
build (no dependency) → playwright (gates on "generated") → test → typecheck → lint
```

## Feature Specification Format

```json
{
  "project": "taskflow",
  "appDir": "example",
  "branchName": "feature/pink-footer",
  "description": "Add a distinctive, funky pink footer...",
  "userStories": [
    {
      "id": "US-001",
      "title": "Pink Footer Component",
      "description": "As a user, I want a funky pink footer...",
      "acceptanceCriteria": [
        "Footer uses semantic <footer> element",
        "Responsive layout: horizontal on desktop, vertical on mobile",
        "Dark mode support"
      ],
      "priority": 1,
      "model": "sonnet",
      "passes": false,
      "jobs": [
        { "name": "build", "agent": "build-user-story", "status": "pending", "dependsOn": null },
        { "name": "playwright", "agent": "run-playwright", "status": "pending", "dependsOn": "build" },
        { "name": "test", "agent": "write-tests", "status": "pending", "dependsOn": "build" },
        { "name": "typecheck", "agent": "run-typecheck", "status": "pending", "dependsOn": "test" },
        { "name": "lint", "agent": "run-lint", "status": "pending", "dependsOn": "typecheck" }
      ]
    }
  ]
}
```

## Target Application: TaskFlow

The `example/` directory contains **TaskFlow**, a task management app used as the build target.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 3.4 (class-based dark mode) |
| Linting | ESLint 9 (flat config) |
| Testing | Vitest 4 + React Testing Library |

### App Commands

Run from the `example/` directory:

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run typecheck    # Run tsc --noEmit
npm test             # Run Vitest
npm run test:watch   # Run Vitest in watch mode
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- `jq` (used by the orchestrator to parse feature JSON)

### Quick Start with `ralph` CLI

The easiest way to use Ralph is the portable `ralph` script. Copy it into any project:

```bash
curl -fsSL https://raw.githubusercontent.com/dlee-mindcurv/cc-automation-tools/main/ralph -o ralph && chmod +x ralph
```

Then:

```bash
./ralph doctor                              # Check prerequisites
./ralph init my-feature --app-dir src       # Scaffold a feature
# Edit features/my-feature/prd.json with your stories and acceptance criteria
./ralph run my-feature                      # Build the feature
./ralph status                              # Check progress
```

### `ralph` Commands

```
./ralph <command> [options]
./ralph <feature-name>              Shorthand for: ./ralph run <feature-name>

COMMANDS:
  run <feature>       Run the Ralph loop to implement a feature
  init <feature>      Scaffold a new feature with template prd.json
  status [feature]    Show feature progress (all features if omitted)
  reset <feature>     Reset all job statuses to pending
  logs <feature>      View agent execution log
  install             Download agents and commands from GitHub
  update              Force re-download latest agent/command versions
  clean               Remove downloaded agents and commands
  doctor              Check all prerequisites and system health
  self-update         Update the ralph script itself
  help                Show help text
```

The `run` command accepts smart feature arguments:

```bash
./ralph run pink-footer                     # Resolves to features/pink-footer/prd.json
./ralph run features/pink-footer/prd.json   # Used as-is
./ralph pink-footer                         # Shorthand for: run pink-footer
```

Run options:

| Option | Description |
|--------|-------------|
| `--max-iterations <n>` | Safety limit (default: 50) |
| `--dry-run` | Show claude command without executing |
| `--verbose` | Detailed output |
| `--model <model>` | Override Claude model |
| `--resume` | Resume last Claude session |
| `--skip-install` | Don't auto-install agents |
| `--dangerously-skip-permissions` | Pass through to claude CLI |

### Manual Setup

If you prefer not to use the `ralph` script, you can set up manually:

```bash
# Clone the repo
git clone <repo-url>
cd feature-builder

# Install application dependencies
cd example && npm install
```

1. Create a feature directory and `prd.json`:

```bash
mkdir -p features/my-feature
```

2. Write the `prd.json` with your user stories, acceptance criteria, and job definitions (see the format above).

3. Run the orchestrator in Claude Code:

```
/create-feature-from-json features/my-feature/prd.json
```

4. The orchestrator dispatches subagents to implement, test, type-check, and lint the feature automatically.

### Running with Ralph Wiggum (Manual)

For features with multiple user stories, the orchestrator processes one story per invocation. The **Ralph Wiggum loop** re-invokes the orchestrator automatically until all stories pass. The `ralph` CLI handles this automatically, but you can also invoke it directly:

```
/ralph-wiggum:ralph-loop "/create-feature-from-json features/<name>/prd.json" --completion-promise "RALPH-LOOP-COMPLETED" --max-iterations 50
```

**To cancel a running loop:**

```
/ralph-wiggum:cancel-ralph
```

> **Prerequisite:** The [Ralph Wiggum](https://github.com/dlee-mindcurv/ralph-wiggum) plugin must be installed in your Claude Code environment. The `ralph` CLI auto-installs it if missing.

## Testing

Ralph includes a [bats](https://github.com/bats-core/bats-core) test suite covering all CLI commands, utility functions, and edge cases.

### Prerequisites

```bash
brew install bats-core
```

The bats helper libraries (`bats-support` and `bats-assert`) are vendored in `tests/test_helper/` and don't need separate installation.

### Running Tests

```bash
bats tests/                     # All tests (~94)
bats tests/ralph_cli.bats      # Single file
bats -j 4 tests/               # Parallel execution
```

### Test Structure

```
tests/
├── helpers/
│   └── setup.bash              # Shared setup/teardown, mock helpers
├── fixtures/                   # JSON fixtures for features and logs
├── test_helper/                # Vendored bats-support and bats-assert
├── ralph_functions.bats        # Unit tests: resolve_feature_file, colors, constants
├── ralph_cli.bats              # --version, --help, --no-color, unknown cmd, smart shorthand
├── ralph_init.bats             # init with all option combos, duplicate rejection
├── ralph_status.bats           # Single/all features, done/pending/mixed progress
├── ralph_reset.bats            # Reset jobs, remove agent-log, edge cases
├── ralph_logs.bats             # Log table display, empty/missing log
├── ralph_clean.bats            # File removal, correct count reporting
├── ralph_run.bats              # --dry-run, validation errors, option pass-through
├── ralph_doctor.bats           # Tool checks, missing tool, agent/CLAUDE.md checks
└── ralph_install.bats          # Install/update with mocked curl, skip-existing behavior
```

Tests run in isolated temp directories and use mocked external dependencies (`curl`, `claude`), so no network calls or real Claude sessions are needed.

## License

Private repository.
