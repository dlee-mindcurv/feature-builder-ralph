# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **subagent-driven feature development system** for building a Next.js application called **TaskFlow**. Features are defined declaratively in per-feature JSON files under `features/` with user stories, and Claude Code subagents execute jobs (build, lint, typecheck, test) to implement them.

The application code directory is specified by the `appDir` field in each feature's `prd.json` (e.g., `"appDir": "."`). The orchestration infrastructure (features/, .claude/, CLAUDE.md) lives at the repo root alongside the application code.

## Architecture

### Workflow Engine

1. **`features/<name>/prd.json`** — Defines a feature's branch, app directory (`appDir`), user stories, and their jobs with statuses
2. **`/create-feature-from-json <path>` command** — Orchestrator that reads the provided feature JSON file (e.g., `features/pink-footer/prd.json`), finds the first incomplete story, identifies runnable jobs (dependency-resolved), and invokes subagents in parallel
3. **Subagents** (in `.claude/agents/`) — Each reads `features/learnings.md` for shared patterns, then handles one job type:
   - `build-user-story` — Implements the story code (Read/Write/Edit only)
   - `run-lint` — Runs linter, fixes violations
   - `run-typecheck` — Runs type checker, fixes errors
   - `write-tests` — Writes unit tests using existing project patterns
4. Each agent updates its job status to `"done"` in the feature file path provided by the orchestrator when complete
5. When all jobs for a story are done, the story's `passes` field is set to `true`
6. When all stories pass, the orchestrator outputs `<Promise>COMPLETED</Promise>`

### Git Worktree Isolation

Each feature runs in an isolated git worktree at `.worktrees/<feature-name>/` on its own branch (specified by `branchName` in `prd.json`). The `ralph` CLI creates the worktree before invoking Claude, and the orchestrator auto-detects it to override `$APP_DIR` transparently. This enables parallel feature development without file conflicts. When a feature completes, changes are committed, pushed, and a PR is created automatically.

### Job Dependencies

Jobs have a `dependsOn` field. A job is runnable when its dependency is `null` or the dependency job's status is `"done"`. The orchestrator resolves these before dispatching.

### Target Application Stack

- **Next.js 13+** with App Router
- **TypeScript**
- **Tailwind CSS** with dark mode
- **NextAuth** for authentication (JWT strategy, no database)
- **React Context** for state (ThemeContext, TaskProvider, SessionProvider)

## Agent Skills

Skills from `~/.agents/skills/` to inject into subagents. The orchestrator reads this mapping and passes skill content inline to each agent type. Append `:full` to a skill name to load AGENTS.md (full rules with code examples) instead of the default SKILL.md (compact index).

| Agent | Skills                             |
|-------|------------------------------------|
| `build-user-story` | `vercel-react-best-practices:full` |
| `write-tests` |                                    |
| `run-playwright` |                                    |
| `run-typecheck` |                                    |
| `run-lint` |                                    |

## Directory Structure

```
/                         # Repo root — orchestration tooling
├── features/             # Per-feature definitions
│   ├── status.json       # Registry of all features and their statuses
│   ├── learnings.md      # Ephemeral scratch pad for agent learnings (gitignored)
│   └── <feature-name>/   # One folder per feature
│       └── prd.json      # Feature definition (appDir, stories, job statuses)
├── .worktrees/           # Git worktrees for parallel features (gitignored)
│   └── <feature-name>/   # Isolated checkout on feature branch
├── CLAUDE.md             # This file
├── .claude/
│   ├── agents/*.md       # Subagent definitions (build, lint, typecheck, test)
│   └── commands/*.md     # Orchestrator command definition
├── package.json          # Application dependencies
├── src/                  # Application source code
├── tsconfig.json         # TypeScript configuration
└── ...config files       # Next.js, Tailwind, ESLint, Vitest, Playwright
```

## Key Files

| File | Purpose |
|------|---------|
| `features/status.json` | Registry of all features and their statuses |
| `features/<name>/prd.json` | Feature definition with user stories and job statuses |
| `.claude/commands/create-feature-from-json.md` | Orchestrator command definition |
| `features/learnings.md` | Shared patterns and conventions for all subagents |
| `.claude/agents/*.md` | Subagent definitions (build, lint, typecheck, test) |

## Commands

All application commands run from the project root:

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler check (tsc --noEmit)
npm test             # Run test suite
```

The orchestrator uses `jq` to parse the feature file:
```bash
jq '[.userStories[] | {id, passes, jobs: [.jobs[] | {name, status, dependsOn}]}]' features/pink-footer/prd.json
```

## Learnings

Findings integrated from feature development runs. This section is automatically updated by the orchestrator when a feature completes.
