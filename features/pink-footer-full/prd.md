# PRD: Pink Footer Full

## Introduction

TaskFlow currently lacks a footer component, and its visual design follows conventional productivity app aesthetics. The Pink Footer feature adds a distinctive, funky-styled footer to the application that intentionally breaks from the standard design system. This creates a memorable brand signature, injects personality into the app, and provides a functional space for navigation links and app information -- all while delighting users with bold, unconventional design.

## Goals

- Establish a distinctive visual brand element that differentiates TaskFlow from competing task management apps
- Provide a functional footer with navigation links, branding, and app information
- Create a "funky" design that feels intentional and delightful, not accidental
- Ensure the footer is fully responsive and accessible across desktop and mobile
- Support both light and dark mode themes

## User Stories

### US-001: Render Pink Footer on All Pages
**Description:** As a user, I want to see a styled pink footer at the bottom of every page so that the app feels complete and has a consistent brand identity.

**Acceptance Criteria:**
- [ ] A `Footer` component exists at `src/components/ui/Footer.tsx`
- [ ] The footer renders at the bottom of the page via the root layout (`layout.tsx`)
- [ ] The footer has a pink background color (e.g., `bg-pink-500` or a gradient involving pink tones)
- [ ] The footer displays the TaskFlow brand name and a copyright line (e.g., "TaskFlow 2026")
- [ ] Tests pass with 80% coverage
- [ ] Typecheck/lint passes
- [ ] Verify in browser using pdm-webapp-testing skill

### US-002: Add Funky Visual Styling to Footer
**Description:** As a user, I want the footer to have a funky, eye-catching design so that the app feels unique and memorable.

**Acceptance Criteria:**
- [ ] The footer uses a bold pink color scheme (gradient, pattern, or layered pinks)
- [ ] The footer includes at least one funky design element (e.g., wave/curved top border, decorative pattern, playful typography, or subtle animation)
- [ ] The design feels intentionally bold, not like a styling mistake
- [ ] The footer contrasts appropriately with the main content area to create visual distinction
- [ ] Tests pass with 80% coverage
- [ ] Typecheck/lint passes
- [ ] Verify in browser using pdm-webapp-testing skill

### US-003: Add Navigation Links to Footer
**Description:** As a user, I want the footer to contain useful navigation links so that I can access key areas of the app from the bottom of the page.

**Acceptance Criteria:**
- [ ] The footer includes at least three navigation links (e.g., "Home", "About", "Privacy")
- [ ] Links are styled to be legible against the pink background (e.g., white or dark text with hover effects)
- [ ] Links have visible hover/focus states for interactivity feedback
- [ ] Tests pass with 80% coverage
- [ ] Typecheck/lint passes
- [ ] Verify in browser using pdm-webapp-testing skill

### US-004: Responsive Footer Layout
**Description:** As a user on a mobile device, I want the footer to adapt to smaller screens so that it remains usable and visually appealing on any device.

**Acceptance Criteria:**
- [ ] On desktop (md+), footer content is laid out horizontally (e.g., links on one side, branding on the other)
- [ ] On mobile (<md), footer content stacks vertically and is centered
- [ ] Text and links remain readable and tappable on small screens (minimum 44px touch targets)
- [ ] The footer does not overflow or cause horizontal scrolling on any viewport
- [ ] Tests pass with 80% coverage
- [ ] Typecheck/lint passes
- [ ] Verify in browser using pdm-webapp-testing skill

### US-005: Dark Mode Support for Footer
**Description:** As a user who prefers dark mode, I want the pink footer to adapt its colors in dark mode so that it remains visually cohesive and comfortable to view.

**Acceptance Criteria:**
- [ ] In dark mode, the footer uses a darker or muted pink variant (e.g., `dark:bg-pink-900` or a dark pink gradient)
- [ ] Text and links in the footer remain legible in dark mode
- [ ] The footer maintains its funky character in both light and dark themes
- [ ] Tests pass with 80% coverage
- [ ] Typecheck/lint passes
- [ ] Verify in browser using pdm-webapp-testing skill

## Functional Requirements

- FR-1: The system must render a `Footer` component at the bottom of every page via the root layout
- FR-2: The footer must use a pink-dominant color scheme that is visually distinct from the rest of the application
- FR-3: The footer must display the TaskFlow brand name and copyright year
- FR-4: The footer must include navigation links that are styled for legibility against the pink background
- FR-5: The footer must include at least one decorative "funky" design element (wave border, gradient, pattern, playful typography, or animation)
- FR-6: The footer must be responsive, switching from a horizontal layout on desktop to a stacked layout on mobile
- FR-7: The footer must support dark mode with adjusted pink tones and legible text
- FR-8: All interactive elements in the footer must have visible focus states for keyboard navigation
- FR-9: The footer must not interfere with the main task management content or cause layout shifts

## Non-Goals

- The footer will NOT include dynamic content or data from the task store (e.g., task counts, user info)
- The footer will NOT include social media integration or external service links
- The footer will NOT include a newsletter signup or any form inputs
- The footer will NOT require changes to the existing color palette or design tokens used elsewhere in the app
- The footer will NOT include animations that require JavaScript (CSS-only transitions are acceptable)

## Design Considerations

- The footer should use Tailwind CSS utility classes consistent with existing component patterns
- Use pink color variants from Tailwind's default palette (`pink-400` through `pink-900`) or custom gradient combinations
- Consider a wave or curved SVG top border to create visual separation from main content
- Typography can be playful -- consider using a slightly different font weight or letter-spacing within the footer
- The existing `Logo` component (`src/components/ui/Logo.tsx`) may be reused or referenced in the footer branding area
- A new `Footer.tsx` component should be created under `src/components/ui/`
- Associated unit tests must be written for the new Footer component

## Technical Considerations

- The footer component will be added to `src/app/layout.tsx` after the main content area
- No new dependencies are required -- Tailwind CSS and existing Next.js setup are sufficient
- The footer must work with the existing `ThemeProvider` for dark mode toggling
- The component should use semantic HTML (`<footer>` element) for accessibility
- SVG decorative elements (if used for wave borders) should have `aria-hidden="true"`

## Success Metrics

- Footer renders correctly on all pages without layout regressions
- Footer passes WCAG 2.1 AA contrast requirements for text against pink backgrounds
- Footer is visually distinct and identifiable as a deliberate design choice (validated via browser testing)
- All unit tests pass with minimum 80% coverage on the Footer component
- Lighthouse accessibility score remains 90+ after footer addition

## Open Questions

- Should the footer include an app version number for transparency?
- What specific shade of pink best balances "funky" with readability (to be determined during implementation)?
- Should the wave/decorative border be animated on scroll or static?
