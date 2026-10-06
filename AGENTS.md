Scaffolding for new Next.js projects: the App Router, hmi-components for the
UI, the merge gates wired to CI, and the agent rules already in place. Fork or
copy it to start a project.

This section is the template's own and written by hand. Everything between the
`agentcfg` markers below is composed from `.agentprofile.yml` by
`pnpm agentcfg sync`: a correction to it goes into agent-config-sync's
fragments, not here.

## hmi-components

- The UI comes from `@ninoverse/hmi-components`, through the React wrappers
  under `@ninoverse/hmi-components/react/<name>`. They render custom elements,
  which only the browser upgrades, so they are used in Client Components alone.
  A Server Component that imports one fails `pnpm build`, which then defines the
  element twice.
- The root layout imports hmi's theme: its tokens, one color theme, one
  structure theme and `base.css`. Styles use the tokens, such as `--primary`,
  rather than values of their own.

<!-- agentcfg:start -->
<!-- language/typescript/tooling.md · v1.2.0 -->
# Build and test commands

**Toolchain:** TypeScript on Node, with pnpm only — never `npm` or `yarn`, whose lockfiles and resolution differ. pnpm is pinned by `packageManager` in `package.json`, and Node by `.nvmrc`. Once per machine, install the Node `.nvmrc` names and run `corepack enable`, which then provides the pnpm `packageManager` names.

Commands live in the `package.json` scripts, which are the single source of
truth — do not copy the underlying tool invocations into docs or CI, call the
script.

```bash
pnpm install    # install from the lockfile
pnpm run ci     # every merge gate, in order — run this before every commit
pnpm lint       # gate 1 — format and lint, warnings as errors
pnpm typecheck  # gate 2 — tsc
pnpm test       # gate 3 — the test suite
pnpm build      # gate 4 — the build
pnpm format     # format in place
```

`ci` is called as `pnpm run ci`: `pnpm ci`, like `pnpm audit` and `pnpm docs`,
is pnpm's own command and never reaches the script. Biome and Vitest are the
defaults behind `lint`, `format` and `test`, with `lint` as
`biome check --error-on-warnings .` so a warning fails the gate. A repository
that needs another tool changes the script; the script names stay.

## Architecture & Workspace Rules

**Layout:** One package at the repository root, with its own `package.json`, `tsconfig.json` and `src/`. Once there are several, a pnpm workspace: `pnpm-workspace.yaml` lists `packages/*`, each package lives in `packages/<name>/`, and the root holds the shared tooling.

**Dependencies:** Added with `pnpm add`, recorded in the committed `pnpm-lock.yaml`, and installed in CI with `--frozen-lockfile`. What the shipped code imports goes in `dependencies`; tools only the build and tests use go in `devDependencies`.

**Node floor:** `engines.node` is the oldest Node the package supports, repeated as the `node-floor` input of the workflow that calls `node-ci.yml`, whose floor job fails a partial bump. Raising it means editing both together. Do not raise it incidentally. `.nvmrc` only pins development, and moves freely.

<!-- core/behavior.md · v1.2.0 -->
# Behavioral guidelines

**Maintain the Build:** Never leave the codebase in a state where build, lint,
or tests fail. Run the relevant commands in *Build and test commands* to verify
your work before concluding a task.

**Tradeoff:** Bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, stop and ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, propose it. Push back when warranted.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked. No abstractions for single-use code.
- No "flexibility" or error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Match existing style exactly.
- Remove imports/variables/functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

- Transform tasks into verifiable goals (e.g., "Add validation" → "Write tests for invalid inputs, then make them pass").
- For multi-step tasks, state a brief plan and verify each step independently.

<!-- framework/nextjs/docs.md · v1.2.0 -->
# Next.js documentation

The installed Next.js may not be the one you learned: its APIs, file
conventions and defaults change between releases, minor ones included. Before
writing or changing Next.js code, read the matching guide in
`node_modules/next/dist/docs/`, which ships with the installed version. The App
Router's are under `01-app/`: getting started, guides, and a reference for
every file convention, function and config option. Where a guide and what you
remember disagree, the guide wins, and so do its deprecation notices.

Keep `agentRules: false` in `next.config.ts`. This section replaces the block
`next dev` would otherwise write into AGENTS.md.

<!-- concerns/template/rules.md · v1.2.0 -->
# Template repository

This repository is a GitHub template: new projects start as a copy of it, and
every copy inherits everything here.

- Keep the example code minimal. It demonstrates the conventions and keeps the
  gates green on a fresh copy; it holds no real business logic.
- Where the template ships placeholder code, it is there because the gates
  fail without it, and because what the template builds, such as the binary a
  `Dockerfile` packages, needs something to build. Remove a placeholder only
  once real code covers its role, as a change of its own, and in that change
  point whatever names the placeholder at the real code.
- A project created from this template removes `template` from `concerns` in its
  `.agentprofile.yml`.

<!-- agentcfg:index · v1.2.0 -->
# Extended rules

Read these when they apply; they are not loaded by default.

**By activity:**

- **Any change that ends in a PR:** [Git flow](.agents/git-flow.md) and [Releases](.agents/tag-only-release.md)
- **Creating branches:** [Branch naming](.agents/branch-naming.md)
- **Reviewing PRs:** [Code review](.agents/code-review.md), [TypeScript code review](.agents/typescript-code-review.md) and [Next.js review](.agents/nextjs-code-review.md)
- **Committing code:** [Commit message guidelines](.agents/commit-conventions.md)
- **Deciding what to build next / branching strategy:** [Execution order](.agents/execution-order.md) and [Route sequencing](.agents/nextjs-execution-order.md)
- **Opening PRs:** [PR instructions](.agents/pr-guidelines.md), [Route table](.agents/nextjs-pr-guidelines.md) and [Visual check](.agents/browser-ui-visual-check.md)
- **Creating new files:** [Directories and file naming](.agents/typescript-file-naming.md) and [App files](.agents/nextjs-file-naming.md)
- **Checking your work:** [Merge gates](.agents/gates.md)
- **Adding or modifying a package:** [Adding a package](.agents/new-package.md)
- **Testing/Verifying:** [Testing instructions](.agents/typescript-testing.md) and [Next.js tests](.agents/nextjs-testing.md)
- **Adding or modifying a route:** [Adding a route](.agents/new-route.md)
- **Capturing what a page renders:** [Taking a screenshot](.agents/take-screenshot.md)

**By file:**

- [App Router](.agents/nextjs-app-router.md) — before touching `app/**` or `src/app/**`
<!-- agentcfg:end -->
