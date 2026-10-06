# Contributing

The rules that govern this repository live in [`AGENTS.md`](AGENTS.md) and
[`.agents/`](.agents/), composed from
[`ninoverse/agent-config-sync`](https://github.com/ninoverse/agent-config-sync)
by the version this repository pins in `.agentprofile.yml`. They are not
agent-specific — they are the conventions, and they apply to humans identically.
This file is the short version and points at the authoritative one for each
topic.

## Setup

```bash
corepack enable                       # pnpm, at the version packageManager pins
pnpm install
pnpm exec playwright install chromium # the browser the tests run in
pnpm run ci                           # confirm a clean checkout passes
```

Node comes from [`.nvmrc`](.nvmrc), installed with the version manager you use.

## The loop

One branch, one PR, merged before the next begins. No stacked PRs.
Full rules in [`.agents/git-flow.md`](.agents/git-flow.md).

```bash
git switch main && git pull --ff-only
git switch -c <type>/<short-description>     # .agents/branch-naming.md
# ... change ...
pnpm run ci                                  # must pass before you push
git commit                                   # .agents/commit-conventions.md
git push -u origin <branch>
```

Then open a PR using the template. Who opens a PR and who merges it is in
[`.agents/pr-guidelines.md`](.agents/pr-guidelines.md).

## The four gates

```bash
pnpm run ci
```

`lint` · `typecheck` · `test` · `build`. All four, zero warnings, before you
push. CI runs the same scripts, one job per gate, plus a job that installs and
builds on the oldest Node `engines.node` allows, actionlint, and
`agentcfg check`. See [`.agents/typescript-testing.md`](.agents/typescript-testing.md)
and [`.agents/nextjs-testing.md`](.agents/nextjs-testing.md).

## Adding a route

Follow the steps in [`.agents/new-route.md`](.agents/new-route.md), or run
`/new-route <url>` in Claude Code, which executes them.

Two things that are easy to miss:

- Before writing Next.js code, read the matching guide in
  `node_modules/next/dist/docs/`, which ships with the installed version and may
  differ from what you remember.
- hmi-components' React wrappers render custom elements, so they belong in
  Client Components. A Server Component that imports one fails `pnpm build`.

A PR that changes what a page renders carries a visual check
([`.agents/browser-ui-visual-check.md`](.agents/browser-ui-visual-check.md)),
and one that adds a route or changes how one renders carries its lines from the
build's route table
([`.agents/nextjs-pr-guidelines.md`](.agents/nextjs-pr-guidelines.md)).

## What gets declined

This template biases toward simplicity. Additions that only serve one downstream
project, abstractions with a single caller, and configuration for situations that
have not happened yet are likely to be turned down — see the Behavioral
Guidelines in [`AGENTS.md`](AGENTS.md).

## Releases

Merging to `main` bumps `package.json`'s version from the subject of the squash
commit, which is the PR title, and pushes a matching tag.
[`.agents/commit-conventions.md`](.agents/commit-conventions.md) says which
subject cuts which release, so the convention is not only documentation: it
picks the version number.

Nothing deploys on that tag. This is a template; the tag exists so someone can
point at the version of it they copied. The workflow is not defined here — it
calls [`ninoverse/.github`](https://github.com/ninoverse/.github) and needs
organization-level app credentials. The README's *Deploying* section says what
a project adds to deploy on its tags.

Tagging by hand competes with it rather than complementing it. Don't.

## Dependency updates

Renovate opens them. It runs **centrally**, from
[`ninoverse/.github`](https://github.com/ninoverse/.github), so there is no
workflow and no token in this repository. `renovate.json` here is one line
extending the shared preset; deleting it would opt this repository out.

Review the changelog rather than rubber-stamping. Majors wait for approval on
the Dependency Dashboard issue; everything non-breaking arrives as one grouped
PR on Monday. Security fixes ignore the schedule entirely. A Next.js major gets
a PR of its own, which follows the upgrade guide the new version ships, as
[`.agents/nextjs-execution-order.md`](.agents/nextjs-execution-order.md) says.

The shared preset is configured **not** to touch `engines.node`. It is the
oldest Node the app supports, and CI's floor job installs and builds on exactly
that version, so raising it is a deliberate edit, made in `package.json` and the
`node-floor` input in `.github/workflows/ci.yml` together.

## If you forked this

Two things in this repository point at `ninoverse` and will not work as-is:

- `renovate.json` extends `github>ninoverse/.github`. Replace it with your own
  policy, or point it at your own preset.
- `.github/workflows/` calls reusable workflows from that same repository. They
  are public and pinned to a release, so they keep working — see the README for
  how to vendor them instead.

`SECURITY.md` and the issue forms are **not** in this repository; they come from
the organization defaults, which a fork does not inherit. Add your own.
