# Ralph: Subagent-Driven Feature Development

Ralph is a declarative feature development system built on [Claude Code](https://docs.anthropic.com/en/docs/claude-code). You define features as JSON specifications with user stories, and Claude Code subagents autonomously implement them — building code, writing tests, fixing type errors, and resolving lint violations.

## How It Works

```
features/pink-footer/prd.json          .claude/agents/
┌──────────────────────────┐     ┌──────────────────────────┐
│  User Story: US-001      │     │  build-user-story.md     │
│  ├─ build    → pending   │────▶│  write-tests.md          │
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
| `build-user-story` | Implements the story code | Read, Write, Edit |
| `write-tests` | Writes unit tests matching project patterns | Read, Write, Edit, Bash |
| `run-typecheck` | Runs `tsc --noEmit` and fixes errors | Read, Write, Edit, Bash |
| `run-lint` | Runs ESLint and fixes violations | Read, Write, Edit, Bash |

### Job Dependencies

Jobs declare dependencies via `dependsOn`. The orchestrator only dispatches a job when its dependency is resolved:

```
build (no dependency) → test → typecheck → lint
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

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd ralph-native-with-subagents

# Install application dependencies
cd example && npm install
```

### Creating a Feature

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

## License

Private repository.
