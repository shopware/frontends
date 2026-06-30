---
head:
  - - meta
    - name: og:title
      content: "Distribution channels"
  - - meta
    - name: og:description
      content: "How the @shopware/* packages are published: stable releases, canary snapshots, and per-PR previews, and when to use each."
nav:
  title: Distribution channels
  position: 260
---

# Distribution channels

The `@shopware/*` packages are published through three channels. Each serves a different need: shipping to production, testing what is already merged to `main`, or trying the code from a single open pull request.

Stable and canary cover all published packages:

- `@shopware/api-client`
- `@shopware/api-gen`
- `@shopware/cms-base-layer`
- `@shopware/composables`
- `@shopware/helpers`
- `@shopware/nuxt-module`
- `@shopware/unocss-design-tokens-layer`

:::tip TL;DR
Use [Stable](#stable) for production and everyday app development. Use [Canary](#canary) to test changes already merged to `main` but not yet released. Use [PR previews](#pr-preview) to try the exact code from a single open pull request.
:::

## Summary

| Channel                   | Source                  | Stability           | When to use                                         |
| ------------------------- | ----------------------- | ------------------- | --------------------------------------------------- |
| [Stable](#stable)         | npm tag `latest`        | Stable, semver      | Production and normal app development. The default. |
| [Canary](#canary)         | npm tag `canary`        | Unstable, no semver | Test changes merged to `main` but not yet released. |
| [PR preview](#pr-preview) | pkg-pr-new (not on npm) | Ephemeral, per-PR   | Try the code from one specific open pull request.   |

## Stable

Normal production releases, managed by [Changesets](https://github.com/changesets/changesets) and published to npm under the default `latest` dist-tag.

Contributors add a changeset in their PR (`pnpm changeset`). The `Release` GitHub workflow (`.github/workflows/release.yml`) aggregates pending changesets into a `chore: next version release` PR. Merging that PR runs `changeset publish`, which publishes to npm under `latest` and creates the matching git tags and GitHub releases.

```bash
# Latest stable
npm i @shopware/api-client

# Pin an exact version
npm i @shopware/api-client@1.5.0
```

:::tip When to use
Production and any normal app development. This is the default and the only channel with semver guarantees - if you are unsure, use this one.
:::

## Canary

Snapshot pre-releases published to npm under the `canary` dist-tag automatically on every push to `main` by the `publish-canary` job, except for the release commit `chore: next version release`. Only packages with pending (unreleased) changesets get a fresh canary snapshot.

The job runs:

```bash
pnpm run version --snapshot canary
pnpm changeset publish --no-git-tag --tag canary
```

Versions use the format `0.0.0-canary-<UTC-timestamp>`, for example `0.0.0-canary-20260629144551`.

```bash
# Newest canary snapshot
npm i @shopware/api-client@canary

# Pin an exact snapshot for reproducibility
npm i @shopware/api-client@0.0.0-canary-20260629144551
```

Because the `canary` tag always points at the newest snapshot, pin the exact snapshot version when you need a reproducible install.

:::tip When to use
To verify a fix or feature early, or for integration testing of changes that are merged to `main` but not yet in a stable release.
:::

:::warning Not for production
Canary snapshots are unstable, change frequently, and carry no semver guarantees.
:::

## PR preview

Per-pull-request preview builds powered by [pkg-pr-new](https://pkg.pr.new). These builds are **not** published to the npm registry; they are served directly from `pkg.pr.new`.

The `package-previews` workflow (`.github/workflows/package-previews.yml`) triggers on a pull request `labeled` event, only when the label is `publish-pkg-preview`. It builds the packages and runs:

```bash
npx pkg-pr-new publish ./packages/api-client ./packages/api-gen ./packages/cms-base-layer ./packages/composables ./packages/helpers ./packages/nuxt-module
```

The pkg-pr-new bot then comments the install commands on the PR. Install directly from the preview URL:

```bash
# By PR number
npm i https://pkg.pr.new/shopware/frontends/@shopware/api-client@1349

# A commit SHA also works in place of the PR number
npm i https://pkg.pr.new/shopware/frontends/@shopware/api-client@<commit-sha>
```

:::info Opt-in
Previews are opt-in: a maintainer adds the `publish-pkg-preview` label to the PR to trigger a build.
:::

:::tip When to use
To try the exact code from a specific open pull request before it is merged - for review, reproducing a bug fix, or validating against your app. Previews are ephemeral and tied to that PR.
:::

See the [installation guide](../installation.html) for setting up a project and [Best practices: Deployment](../best-practices/deployment.html) for production guidance.
