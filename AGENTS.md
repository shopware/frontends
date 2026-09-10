# AI Agent Guide for Shopware Frontends

Vue 3 / Nuxt 4 framework for building Shopware 6 storefronts. pnpm workspace
monorepo, Turbo for build orchestration.

Repository layout, dependency lists and available scripts are discoverable from
the repo itself — read `package.json`, `pnpm-workspace.yaml`, `turbo.json` and
`templates/manifest.json`. This file covers only what the code cannot tell you.

## Quick start

```bash
pnpm i                                        # install (postinstall builds ./packages/*)
pnpm run dev --filter=vue-starter-template    # run the supported template
pnpm run test
pnpm changeset                                # required for published-package changes
```

Before committing: `pnpm run lint:fix && pnpm format && pnpm run typecheck`

## Templates: read the manifest, never a hardcoded list

`templates/manifest.json` is the single source of truth for which templates
exist and what each needs. The list used to live in five places that had drifted
apart, so anything that needs to know about templates reads the manifest instead
of hardcoding a list or globbing `templates/`. `templates/manifest.schema.json`
is its definition; the field meanings live there, not here.

- **`vue-starter-template` is the supported starting point.**
  **`vue-demo-store` is deprecated** (#2667) — it stays as a reference
  implementation to read, and must never be offered as a base for new work.
  `supportLevel` in the manifest is authoritative if this ever disagrees.
- Two ids do not match their package name: `astro` is `shopware-astro`,
  `vue-starter-template-extended` is `lumora-demo-store`. Filter pnpm workspaces
  on `packageName`, identify directories on `id`.
- `pnpm run check:templates` validates the manifest against disk and against
  each template's `package.json` (ids, package names, build/dev scripts, node
  ranges, docs URLs, devcontainers, scaffold flags). It runs as its own
  `Templates manifest` CI workflow. **When you add or remove a template, or
  change its build or dev script, update the manifest in the same change.**
- Every template runs against a public demo backend with no configuration. The
  `env` vars in its manifest entry only re-point it at your own instance; the
  names differ per framework, so read them from the manifest.

## Build order and the two layer packages

Turbo handles ordering, but knowing it explains stale-code symptoms:

- `api-client` + `helpers` (independent) → `composables` → `nuxt-module`;
  `api-gen` builds after `api-client`.
- `cms-base-layer` and `unocss-design-tokens-layer` are **plain Nuxt layers with
  no build step**. They ship their sources as-is, so edits show up in templates
  immediately.
- `composables` needs no build for its main entries either: `.` resolves to
  `src/index.ts` and `./nuxt-layer` to `nuxt.config.ts`, so source edits are live.
  Only its `./lib` and `./dist` entries come from a build.
- Every remaining package must be built, or run in stub mode, before a template
  sees the change: `cd packages/<name> && pnpm run dev` (`unbuild --stub`).
- The layer packages' `typecheck` is `nuxt prepare && tsgo --noEmit`, so
  re-running `nuxt prepare` by hand before it adds nothing. When it fails, read
  where the error points instead of assuming a cause — it can be the layer's own
  `app/**`, the generated `.nuxt`, the checked-in `types/` shims, or an unbuilt
  dependency (`turbo.json` gives `typecheck` a `dependsOn: ["build", "^build"]`
  for that last case). The shims are the non-obvious one: `types/imports.d.ts`
  re-exports `@shopware/composables`' auto-imports alongside `../.nuxt/imports`,
  so a missing re-export reads as a type error with no faulty code behind it.
  Only `helpers` and `api-client` resolve through `dist` and need a build;
  `composables` resolves to `src`.
- For a stale Turbo cache, `rm -rf .turbo`. If dependencies themselves look
  wrong, `rm -rf node_modules && pnpm i` — **keep `pnpm-lock.yaml`**. It is
  committed and nearly every CI job installs with `--frozen-lockfile` (the
  StackBlitz template check is the exception), so regenerating it turns a local
  hunch into a repo-wide diff; what you lose are the pinned, reviewed
  resolutions and their integrity hashes. The `overrides` and `minimumReleaseAge`
  guard live in `pnpm-workspace.yaml` and are re-applied on every install, so
  those survive either way.
- Never hand-edit `packages/api-client/api-types/*.d.ts` — they are generated
  by `@shopware/api-gen`. See
  [packages/api-client/AGENTS.md](packages/api-client/AGENTS.md) for which
  script regenerates which file.

## Caching

The full reference is [Best practices: Caching](apps/docs/src/best-practices/caching.md).
The essentials for code changes:

- **`cacheableReads` (request layer)** — an opt-in context flag (default
  `false`) that switches a defined set of anonymous read composables from POST to
  the cacheable GET variant of the Store API. Wired `nuxt.config`
  (`shopware: { cacheableReads: true }`) → `createShopwareContext` →
  `useShopwareContext()`. GET-over-POST is a Shopware platform decision: POST
  bodies are not HTTP-cacheable, so reads compress the Criteria into a
  `_criteria` query param via `encodeForQuery` from `@shopware/api-client/helpers`
  (JSON → gzip → base64url, matching the backend `RequestCriteriaBuilder`).
  - When adding or editing a read composable, branch on `cacheableReads` and call
    the GET route with `query: { _criteria: encodeForQuery(criteria) }`; keep the
    POST variant as the `else`. Mutations always stay POST/PATCH. Where a GET
    variant does not declare `_criteria` in the generated types yet, there is one
    precedent for a local intersection type — `useCategorySearch.search`. Which
    reads have already moved shifts as the platform ships GET variants, so read
    that from the composables rather than from a list here.
- **`routeRules` (render layer)** — page-level caching lives in each template's
  `nuxt.config.ts`: `isr` for catalog/content, `ssr: false` for personalized
  routes (`/checkout`, `/account/**`), immutable `Cache-Control` for static
  assets. Never bake personalized data into ISR-cached HTML.
- **Client state** — `createSharedComposable` and `provide`/`inject` dedupe work
  in-memory per session. They are not a durable response cache.

## Nuxt component registration (templates)

Which directories are registered `global: true`, why, and the trap of
registering one path twice are all commented at the `components` key of
`templates/vue-starter-template/nuxt.config.ts`. The one rule that is not
written there:

- **An override of a CMS component must sit under a path registered
  `global: true`** — in the starter that is `app/components/cms/`. Dropping it
  anywhere else (including plain `app/components/`) leaves it out of
  `resolveComponent`'s reach, so the base layer's version keeps rendering with
  no error. `pathPrefix: false` on that entry means the name comes from the
  filename alone, so subdirectory depth under it does not matter.

## Testing

- Unit tests (Vitest) live next to their sources as `*.test.ts`. `pnpm run
coverage` exists only in `packages/composables`.
- `pnpm run test:e2e` is `playwright test --grep @vue-demo-store`, so it only
  covers the deprecated demo store. The `@accessibility` specs are
  template-agnostic and run against any storefront via `BASE_E2E_URL`:

```bash
cd apps/e2e-tests
BASE_E2E_URL=https://frontends-starter-template.vercel.app/ \
  pnpm exec playwright test --grep @accessibility --project=chromium
```

- Install the browsers once with `pnpm exec playwright install chromium`.

## Pull requests

- Conventional Commits title (`feat:`, `fix:`, `docs:`, `chore:`).
- A changeset is required for any change to a published package; commit the
  generated `.changeset/*.md` with your change.
- Don't break exported types or public APIs without a major bump.

## References

- Docs: [developer.shopware.com/frontends](https://developer.shopware.com/frontends/)
- Package details: every package has a `README.md`, and some also have an
  `AGENTS.md` — check the package directory
- Repository: [github.com/shopware/frontends](https://github.com/shopware/frontends)

## Maintaining these files

`AGENTS.md` is what agents read; Claude Code reads `CLAUDE.md`, so every
`AGENTS.md` has a one-line `CLAUDE.md` beside it containing `@AGENTS.md` — add
both together, or the file is invisible to it. The root pair is resident in
every session; a nested one loads when an agent works in that directory.

**Keep the root pair under 200 lines.** Past that it costs more context and gets
followed less, so the budget is a correctness rule, not tidiness. Nested files
are bounded by relevance rather than context cost, which is why moving
package-specific detail down out of this file is a real saving.

Limit them to what an agent cannot derive by reading the repo: gotchas,
rationale, and conventions that differ from tool defaults. Layouts, dependency
lists, standard scripts and inventories belong in the code or the docs site.
Prefer pointing at the file that owns a fact over restating it — a condensed
copy drifts from the original, and the original is the one with an owner.
Update these files in the same change that makes them wrong.
