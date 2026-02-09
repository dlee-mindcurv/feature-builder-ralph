# Shared Learnings for Subagents

Patterns and conventions discovered during feature implementation. Read this before starting any job.

## Stack Versions

| Package | Version | Notes |
|---------|---------|-------|
| Next.js | ^15.1.0 | App Router |
| React | ^19.0.0 | `ref` as regular prop, no `forwardRef` |
| TypeScript | ^5.7.0 | Strict mode |
| Tailwind CSS | ^3.4.17 | Class-based dark mode (`"class"` strategy) |
| Vitest | ^4.0.18 | Unit tests with jsdom |
| Playwright | ^1.58.2 | E2E tests |
| ESLint | ^9.16.0 | Flat config via `@eslint/eslintrc` compat |
| React Testing Library | ^16.1.0 | With `@testing-library/jest-dom` matchers |

## Component Patterns

- **`"use client"` directive** — Required on any component that uses hooks, event handlers, or browser APIs. Server components (no interactivity) must NOT have it.
- **Named exports only** — Use `export function Foo()`, never `export default`. All imports use named syntax: `import { Foo } from "@/components/ui/Foo"`.
- **Path alias** — `@/*` maps to `./src/*`. Use it everywhere: `import { Button } from "@/components/ui/Button"`.
- **React 19 refs** — Pass `ref` as a regular prop in the interface. No `forwardRef` wrapper needed.
- **Context consumption** — Import the hook directly: `import { useTheme } from "@/context/ThemeContext"`, `import { useTasks } from "@/context/TaskContext"`.
- **ThemeContext** — Toggles `dark` class on `<html>` element. Uses `localStorage` + `prefers-color-scheme` for initial value.
- **TaskContext** — In-memory CRUD. IDs generated with `crypto.randomUUID()`. Interface: `{ id, title, description, completed, createdAt }`.

## Unit Testing Patterns

- **Framework**: Vitest + React Testing Library + jsdom
- **Imports**: Always explicit — `import { describe, expect, it, vi } from "vitest"`
- **Test file location**: `src/__tests__/components/ComponentName.test.tsx` (mirrors component path)
- **Setup file**: `vitest.setup.ts` imports `@testing-library/jest-dom/vitest` for DOM matchers
- **Mocking contexts**: Use `vi.mock` at the top level and `vi.mocked` for type-safe access:
  ```ts
  vi.mock("@/context/ThemeContext", () => ({
    useTheme: vi.fn(() => ({ theme: "light", toggleTheme: vi.fn() })),
  }));
  ```
- **Complete mock objects** — When mocking a context, provide ALL fields the component reads. Missing fields cause runtime errors.
- **User events**: Use `@testing-library/user-event` with `userEvent.setup()` before interactions.
- **Run command**: `cd <appDir> && npm test`

## E2E Testing Patterns (Playwright)

- **Test file location**: `src/__e2e__/us-NNN.spec.ts` (named after story ID)
- **Imports**: `import { test, expect } from "@playwright/test"`
- **Base URL**: Configured in `playwright.config.ts`, use `page.goto("/")`
- **Dark mode toggling**: `await page.locator("html").evaluate(el => el.classList.add("dark"))`
- **Viewport testing**: `await page.setViewportSize({ width: 375, height: 667 })` for mobile
- **Reduced motion**: `await page.emulateMedia({ reducedMotion: "reduce" })` to test animation opt-out
- **Run command**: `cd <appDir> && npx playwright test`

## Lint & Typecheck Notes

- **Lint command**: `cd <appDir> && npm run lint` (runs `next lint`)
- **Typecheck command**: `cd <appDir> && npm run typecheck` (runs `tsc --noEmit`)
- **Common lint fixes**: Missing `"use client"`, unused imports, missing React key prop
- **Common type fixes**: Missing interface properties, incorrect event handler types, missing null checks

## Accessibility Patterns

- **Decorative SVGs**: Add `aria-hidden="true"` to all decorative/ornamental SVGs
- **Interactive elements**: Provide `aria-label` when visible text is insufficient
- **Live regions**: Use `aria-live="polite"` for dynamic content updates (e.g., task count badges)
- **Semantic HTML**: Use `<footer>`, `<nav>`, `<main>`, `<header>` elements — not generic `<div>` wrappers
- **Focus indicators**: Tailwind classes `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- **Skip links and headings**: Maintain logical heading hierarchy (`h1` > `h2` > `h3`)

## Animation & Styling

- **Global animations**: Define keyframes in `globals.css` or use Tailwind's built-in utilities (`animate-spin`, `animate-pulse`)
- **`prefers-reduced-motion`**: Always provide a reduced-motion fallback. Use `motion-safe:` Tailwind prefix or a CSS media query.
- **Gradients**: Use Tailwind gradient classes (`bg-gradient-to-r from-pink-500 to-pink-600`) for GPU-efficient rendering.
- **Dark mode**: Prefix classes with `dark:` — e.g., `dark:bg-gray-900 dark:text-white`. The `dark` class is toggled on `<html>`.

## Workflow & Status Management

- **Build agent** sets its job status to `"generated"`, NOT `"done"`. The Playwright agent promotes `build` to `"done"` after visual validation passes.
- **All other agents** (lint, typecheck, test, playwright) set their own job status to `"done"` when complete.
- **Feature file path** is provided by the orchestrator — always use it, never hardcode paths.
- **Story completion**: When all jobs for a story are `"done"`, the orchestrator sets `passes: true`.

## Common Mistakes to Avoid

1. **Missing `"use client"`** — If your component uses `useState`, `useEffect`, `useContext`, `onClick`, or any hook, it MUST have `"use client"` at the top.
2. **Default exports** — Never use `export default`. Always use named exports (`export function ComponentName`).
3. **Incomplete context mocks** — When mocking `useTheme` or `useTasks`, return ALL fields the component accesses. A partial mock causes `undefined` property errors.
4. **Wrong test directory** — Unit tests go in `src/__tests__/`, E2E tests go in `src/__e2e__/`. Do not mix them.
5. **Missing vitest imports** — Always import `{ describe, expect, it, vi }` from `"vitest"` explicitly. Do not rely on globals.
6. **Hardcoded feature file paths** — Always use the path provided by the orchestrator (`$FEATURE_FILE`), never hardcode `features/pink-footer/prd.json`.
7. **Setting build status to "done"** — Only the Playwright agent promotes `build` to `"done"`. The build agent sets it to `"generated"`.
8. **Forgetting `aria-hidden` on decorative elements** — All SVG decorations (waves, icons, spinners) need `aria-hidden="true"`.
9. **Missing dark mode styles** — Every visible element must have `dark:` variants. Test by toggling `<html class="dark">`.
10. **Ignoring reduced motion** — Animations must degrade gracefully with `prefers-reduced-motion: reduce`. Use Tailwind's `motion-safe:` prefix.
