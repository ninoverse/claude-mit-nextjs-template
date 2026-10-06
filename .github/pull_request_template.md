<!--
Title format: <type>(<scope>): <description>, under 72 characters.
See .agents/pr-guidelines.md and .agents/commit-conventions.md.

Note: the title becomes the subject of the squash commit on `main`, and that
subject picks the next version, as .agents/commit-conventions.md says. Get it
right here.
-->

## What
<!-- One-paragraph summary of the change -->

## Why
<!-- Motivation: bug, feature request, refactor reason -->

## How
<!-- Non-obvious implementation decisions. Skip what the diff already says. -->

## Testing
<!-- What you ran, and what it proved. Say plainly if a gate could not run. -->

<!--
A change to what a page renders adds a Visual check section
(.agents/browser-ui-visual-check.md). A new route, or a change to how one
renders, adds a Routes section (.agents/nextjs-pr-guidelines.md).
-->

---

- [ ] `pnpm run ci` passes — all four gates, zero warnings
- [ ] One logical change (see `.agents/git-flow.md`)
- [ ] `'use client'` only where a component needs state, effects or the browser
- [ ] `engines.node` not raised incidentally
