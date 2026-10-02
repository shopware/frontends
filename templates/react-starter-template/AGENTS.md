# react-starter-template

Next.js App Router storefront template for Shopware 6, the React counterpart of
`vue-starter-template`. State: anonymous Store API reads, SEO URL routing and
CMS rendering work; there is no session yet, so cart, wishlist and forms are
stubs. `supportLevel` in `templates/manifest.json` is authoritative.

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
  that creates its own anonymous client and sets a `cacheLife` profile from
  `next.config.ts` (`catalog`, `listing`, `seo`, `reference`) and an `sw:` tag.
  When an endpoint has a GET variant (an `operations` key of the form
  `<operationId>Get get <path>`), the read uses it and sends its criteria as
  `query: { _criteria: encodeForQuery(criteria) }`. POST is only for endpoints
  without one. Unlike the Vue composables there is no `cacheableReads` switch
  and no POST fallback. Where the generated GET type does not declare
  `_criteria` yet (category, landing page), the read widens the query type
  locally, the precedent being `useCategorySearch.search` in composables.
  Let a failed read throw so the failure is not cached; the calling
  component handles it (`notFoundOn404` in `platform/shopware/errors.ts`).
- Import Store API types from `#shopware` (`shopware.d.ts`) with `import type`
  only. Point that file at `./api-types/storeApiTypes` after running
  `loadSchema` and `generate-types` to get the types of your own instance.

## Routing and CMS

- `app/[...path]/page.tsx` resolves every storefront URL in a server
  component: `/` maps to the sales channel's navigation category, technical
  paths (`/navigation/{id}`, `/detail/{id}`, `/landingPage/{id}`) are parsed
  with `getRouteFromPathInfo`, everything else is looked up in `/seo-url` with
  both the plain path and the path with a trailing slash. The result is
  dispatched to `features/cms/components/{NavigationPage,DetailPage,LandingPage}`.
- A miss calls `notFound()` inside a `<Suspense>` boundary, which streams a
  200 with `noindex`, not a real 404. Real 301/404/503 status codes need the
  lookup in `proxy.ts`; that is a later stage, do not try to fix it in the
  page.
- `skipTrailingSlashRedirect` is on because Shopware category paths end with
  `/`. The catch-all receives the segments without that slash, which is why
  the SEO lookup tries both spellings.
- CMS pages render through `@shopware/cms-base-layer-react`: `CmsPage` with a
  `CmsContext` built by `platform/cms/context.ts` (`createStorefrontCmsContext`,
  locale `en-GB`, currency from `/context`). Override a CMS component in
  `platform/cms/registry.ts` with `mergeCmsRegistries`, never by editing the
  package. `app/globals.css` imports the package stylesheet and adds `@source`
  for its `src`, otherwise Tailwind drops the component classes.
- Listing state lives in the URL (`manufacturer`, `properties`, `min-price`,
  `max-price`, `rating`, `shipping-free`, `order`, `limit`, `p`). When those
  params are present and the category layout contains a product listing,
  `NavigationPage` re-reads `/product-listing/{categoryId}` with them and
  passes the result as `ctx.listing`; otherwise the listing embedded in the
  CMS data is used.
- Reading `searchParams` or calling `connection()` makes a subtree dynamic, so
  it always happens inside a `<Suspense>` (`PageSkeleton` is the fallback).
  Catalog routes must never read `cookies()` or `headers()`.
- The home page calls `connection()` before its reads so `next build` does
  not need the Store API. Prerendering at build time is a later decision.

## Session and actions

- `features/storefront/components/StorefrontProviders.tsx` is the app side of
  the CMS actions port (`CmsActionsProvider`). Until the session architecture
  is decided, every action shows a "not connected" notification and returns
  `{ ok: false }`. Wire cart, wishlist, variant lookup and forms there, not in
  the CMS components.

## Rules the code does not show

- Colors come from `@shopware/design-tokens` (`tailwind.css`, `@theme static`).
  The class names match the Vue templates (`bg-brand-primary`,
  `text-surface-on-surface`), so markup ports between them. Add or change a
  color in that package, not here.
- The template reads `@shopware/design-tokens` from its build output, and
  `unbuild --stub` does not work in Next.js client bundles. After changing the
  package, rebuild it: `pnpm --filter @shopware/design-tokens build`.
  `@shopware/cms-base-layer-react` ships source, so its edits are live.
- `@shopware/design-tokens` and `@shopware/cms-base-layer-react` are linked
  with `workspace:*` until they are published, which is why the template is
  not scaffoldable yet.
