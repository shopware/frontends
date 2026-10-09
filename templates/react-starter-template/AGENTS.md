# react-starter-template

Next.js App Router storefront template for Shopware 6, the React counterpart of
`vue-starter-template`. It is at the skeleton stage: anonymous Store API reads
work, while routing, the session and CMS rendering do not exist yet.
`supportLevel` in `templates/manifest.json` is authoritative.

## Next.js docs

Next.js ships docs that match the installed version in
`node_modules/next/dist/docs/`. Read the relevant guide there before writing
Next.js code: 16.3 differs from most training data (Cache Components,
`proxy.ts` instead of `middleware.ts`, async request APIs).

`agentRules` is `false` in `next.config.ts`, so `next dev` does not write its
own `AGENTS.md` block or a `CLAUDE.md` pointer file. The repository keeps
`AGENTS.md` files only.

## Store API

- `platform/shopware/` is the only place that creates API clients
  (`createShopwareClient`), and every module there imports `server-only`. The
  endpoint and access token are read on the server at request time
  (`SHOPWARE_ENDPOINT`, `SHOPWARE_ACCESS_TOKEN`) and fall back to the public
  demo backend, like the Vue starter's `nuxt.config.ts` defaults.
- Create one client per request, never at module scope. An instance adopts the
  `sw-context-token` of every response, so a shared one leaks sessions between
  users.
- Reads live in `platform/shopware/reads/`. Each is a `'use cache'` function
  that creates its own anonymous client and sets `cacheLife` and an `sw:` tag.
  When an endpoint has a GET variant (an `operations` key of the form
  `<operationId>Get get <path>`), the read uses it and sends its criteria as
  `query: { _criteria: encodeForQuery(criteria) }`. POST is only for endpoints
  without one. Unlike the Vue composables there is no `cacheableReads` switch
  and no POST fallback. Let a failed read throw so the failure is not cached;
  the calling component handles it.
- Until routing lands, a component that reads the Store API calls
  `connection()` first and renders inside `<Suspense>`, so `next build` never
  needs the Store API.
- Import Store API types from `#shopware` (`shopware.d.ts`) with `import type`
  only. Point that file at `./api-types/storeApiTypes` after running
  `loadSchema` and `generate-types` to get the types of your own instance.

## Rules the code does not show

- Cache Components are on. A catalog route must never read `cookies()` or
  `headers()`: that silently makes the route dynamic, and its HTML stops being
  cacheable.
- Colors come from `@shopware/design-tokens` (`tailwind.css`, `@theme static`).
  The class names match the Vue templates (`bg-brand-primary`,
  `text-surface-on-surface`), so markup ports between them. Add or change a
  color in that package, not here.
- The template reads `@shopware/design-tokens` from its build output, and
  `unbuild --stub` does not work in Next.js client bundles. After changing the
  package, rebuild it: `pnpm --filter @shopware/design-tokens build`.
- `@shopware/design-tokens` is linked with `workspace:*` until it is published,
  which is why the template is not scaffoldable yet.
