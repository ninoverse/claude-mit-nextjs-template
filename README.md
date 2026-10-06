# Claude Code Next.js Template

[![CI](https://github.com/ninoverse/claude-mit-nextjs-template/actions/workflows/ci.yml/badge.svg)](https://github.com/ninoverse/claude-mit-nextjs-template/actions/workflows/ci.yml)
[![Audit](https://github.com/ninoverse/claude-mit-nextjs-template/actions/workflows/audit.yml/badge.svg)](https://github.com/ninoverse/claude-mit-nextjs-template/actions/workflows/audit.yml)

Scaffolding for **Next.js** projects. Use it as a template, or copy it, to start
a project with Next.js's App Router, hmi-components for the UI, the merge gates
wired to CI, and the agent rules already in place.

## What's bundled

| File | Purpose |
|------|---------|
| `package.json` | The scripts every gate and CI call, `engines.node` (the oldest Node the app supports, 22.12.0) and pnpm, pinned in `packageManager`. |
| `pnpm-lock.yaml` | The lockfile, committed. CI installs from it with `--frozen-lockfile`. |
| `.nvmrc` | The Node version development and CI run on. |
| `next.config.ts` | Next.js's configuration. `agentRules: false` keeps `next dev` from writing its own agent rules into AGENTS.md, since agentcfg writes them. |
| `tsconfig.json` | Strict TypeScript, the Next.js plugin, and the `@/*` alias for `src/`. |
| `biome.json` | Format and lint, with Biome's Next.js and React rules. It leaves agentcfg's files alone, since `agentcfg check` compares them byte for byte. |
| `vitest.config.ts` | Tests in Vitest's browser mode, in Chromium through Playwright. |
| `src/app/` | The App Router: a root layout that imports hmi's theme, and one page whose content is a Client Component using hmi's Card and Badge, with its test. A placeholder, to replace with your first route. |
| `.github/workflows/ci.yml` | Calls the organization's `node-ci.yml`: lint, typecheck, test and build as separate jobs, and a job that installs and builds on the Node in `engines.node`. Also `actionlint.yml`, which lints the workflow files, and an `agentcfg check` job. |
| `.github/workflows/audit.yml` | Calls `node-audit.yml`: `pnpm audit`, on Mondays and on dependency changes. |
| `.github/workflows/bump-version.yml` | Calls `node-bump-version.yml`: reads the merged commit's type, bumps `package.json`'s version and pushes a tag. Nothing deploys on it. |
| `renovate.json` | One line extending the organization's shared preset. Renovate runs centrally; there is no workflow or token here. |
| `scripts/agentcfg.sh` | Runs the agentcfg release `.agentprofile.yml` pins, fetched once into the gitignored `.agentcfg/`. Called as `pnpm agentcfg <command>`. |
| `CONTRIBUTING.md` | Setup, the git flow, the gates: the short version of the rules in `.agents/`. |
| `.github/CODEOWNERS` | Review ownership, weighted toward the rule files and CI. |
| `.github/pull_request_template.md` | The What/Why/How/Testing template `.agents/pr-guidelines.md` specifies. |
| `.agentprofile.yml` | The one rule file a human writes. Everything below is composed from it: see *Rule files*. |
| `AGENTS.md` | A section about this template, written by hand, then the composed always-on rules and an index pointing at the rest. |
| `CLAUDE.md` | An `@AGENTS.md` import, plus what is true only for Claude Code. |
| `.agents/` | Agent-neutral rule files, read on demand, and the templates `/new-route` copies. |
| `.claude/` | Claude Code's settings, hooks, path-scoped rules and skills: `/gates`, `/new-route`, `/new-package`, `/take-screenshot`, `/why`. |

### Not in this repository

`SECURITY.md`, `CODE_OF_CONDUCT.md` and `.github/ISSUE_TEMPLATE/` come from
[`ninoverse/.github`](https://github.com/ninoverse/.github), which GitHub serves
as the default to every repository in the organization that has none of its own.
They are not copied here because they name `ninoverse` throughout, so a copy
would be wrong for anyone else anyway.

`CONTRIBUTING.md` and the pull request template stay, because overriding is
all-or-nothing per file, and both carry Node and Next.js specifics the generic
versions leave out.

## Start a project

```bash
# 1. Create the repository: "Use this template" on GitHub, or clone and start
#    a fresh history
git clone https://github.com/ninoverse/claude-mit-nextjs-template my-app
cd my-app
rm -rf .git && git init

# 2. The toolchain, once per machine: the Node .nvmrc names, then pnpm through
#    Corepack, and the Chromium the tests run in
corepack enable
pnpm install
pnpm exec playwright install chromium

# 3. Verify
pnpm run ci
```

Then make it yours:

- In `package.json`, set `name` and `description`, and reset `version` to
  `0.0.0`, which the first merge then bumps.
- In `.agentprofile.yml`, remove `template` from `concerns`, then run
  `pnpm agentcfg sync`. The template's own rules, about keeping its example
  minimal, don't apply to a project.
- Replace the page in `src/app/` with your first route, as a change of its own.
  In Claude Code, `/new-route` walks through it.

What the workflows need from GitHub:

- **Squash merging only**, with the pull request title as the commit message.
  The title picks the release, as `.agents/commit-conventions.md` says.
- **The release app**, for `bump-version.yml`: the organization's
  `RELEASE_APP_ID` variable and `RELEASE_APP_PRIVATE_KEY` secret, and the app
  installed on the repository and allowed to push to `main`. A tag pushed with
  `GITHUB_TOKEN` would trigger nothing.
- **Renovate**, installed on the repository, for `renovate.json` to take effect.

### If you forked this

`.github/workflows/` calls reusable workflows from
[`ninoverse/.github`](https://github.com/ninoverse/.github). That repository is
public and each call is pinned to a release, so they keep working in your fork
with no setup, but someone else maintains the job definitions. To own them,
copy [`node-ci.yml`](https://github.com/ninoverse/.github/blob/main/.github/workflows/node-ci.yml),
[`node-audit.yml`](https://github.com/ninoverse/.github/blob/main/.github/workflows/node-audit.yml),
[`node-bump-version.yml`](https://github.com/ninoverse/.github/blob/main/.github/workflows/node-bump-version.yml)
and [`actionlint.yml`](https://github.com/ninoverse/.github/blob/main/.github/workflows/actionlint.yml)
into your own `.github/workflows/`, and drop the `uses:` lines. They call the
same `package.json` scripts either way.

`renovate.json` extends `github>ninoverse/.github`: replace it with your own
policy. Community health files, such as `SECURITY.md` and the issue forms, also
come from that repository, and GitHub serves organization defaults only within
the organization that owns them, so **your fork inherits none**. Add your own.

## Daily commands

The `package.json` scripts are the single source of truth for every command: CI
and the rules call them rather than repeating the tools behind them.

```bash
pnpm dev             # the development server, on http://localhost:3000
pnpm run ci          # every merge gate, in order: run before every commit
pnpm lint            # gate 1: Biome, warnings as errors
pnpm typecheck       # gate 2: next typegen, then tsc
pnpm test            # gate 3: Vitest, in Chromium
pnpm build           # gate 4: next build, with its route table
pnpm start           # serve the production build
pnpm format          # format in place
pnpm agentcfg check  # the composed rules match .agentprofile.yml
```

`ci` is called as `pnpm run ci`: `pnpm ci` is pnpm's own command and never
reaches the script.

## Deploying

The template doesn't deploy: `bump-version.yml` tags every release, and nothing
watches the tag.

To deploy each release to [Firebase App Hosting](https://firebase.google.com/docs/app-hosting),
which builds the app from its source and runs it, server rendering included:

1. Run `firebase init apphosting` once. It creates the backend in your Firebase
   project, which needs billing enabled, and writes the `apphosting` entry in
   `firebase.json` and an `apphosting.yaml`, where the backend's environment and
   secret references go.
2. Add a `.github/workflows/release.yml` that calls `firebase-deploy.yml` from
   [`ninoverse/.github`](https://github.com/ninoverse/.github) on every
   `v*.*.*` tag, with `only: apphosting`. Its README shows the caller and the
   service account secret it needs.
3. In the same change, set `deployment: site` in `.agentprofile.yml` and run
   `pnpm agentcfg sync`, so the composed rules describe the deploy.

A site with no server work can deploy more cheaply to Firebase Hosting, as a
static export: `output: 'export'` in `next.config.ts`, which makes `pnpm build`
write the site to `out/`, a `hosting` target in `firebase.json` that serves
`out/` and whose `predeploy` runs `pnpm build`, and `only: hosting:<target>` in
the caller. Every route must then be static, ○ or ● in the build's route table.

## Rule files

The rules are not written here. They are composed from
[`ninoverse/agent-config-sync`](https://github.com/ninoverse/agent-config-sync)
by `agentcfg`, at the version this repository pins:

| File | What it is |
|------|------------|
| `.agentprofile.yml` | This repository's value on each axis, such as its language, framework, deployment and concerns, and the `config_version` it pins. The only file in the list a human edits. |
| `AGENTS.md` | Everything loaded in every session, plus one index line per rule that is not. Read by every agent that reads AGENTS.md. |
| `CLAUDE.md` | An `@AGENTS.md` import, plus what is true only for Claude Code. |
| `.agents/*.md` | One file per on-demand rule, such as the git flow, commit conventions, the route workflow and the review checklists. Agent-neutral. |
| `.claude/` | The settings and hooks, the path-scoped rules, and the task rules again as Claude Code skills. One fragment, two renderings. |

Every composed block opens with a provenance comment naming the fragment it came
from, so a rule is always traceable to one file upstream. To find which, run
`pnpm agentcfg why "<phrase>"`. To change a rule for every repository, open a
pull request against that fragment. To change it for this one only, put it
outside the `<!-- agentcfg:start -->` and `<!-- agentcfg:end -->` markers, as
AGENTS.md's opening section is: regeneration never touches what sits outside
them.
