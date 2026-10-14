# react-starter-template

Next.js App Router storefront template for Shopware 6, the React counterpart of
`vue-starter-template`. State: anonymous Store API reads, SEO URL routing, CMS
rendering, the header/footer layout, a browser session with login,
registration and logout, the cart, the checkout with the order confirmation,
the customer account area (`/account/**`), the wishlist, product reviews,
search (`/search` and header suggestions), variant switching, the CMS contact
and newsletter forms, the footer newsletter box, the double opt-in links
(`/registration/confirm`, `/newsletter-subscribe`), password recovery
(`/account/recover`) and the three UI locales of the Vue starter (`en-GB`,
`/pl-PL/…`, `/de-DE/…`) work.
`supportLevel` in `templates/manifest.json` is authoritative.

## Next.js docs

Next.js ships docs that match the installed version in
`node_modules/next/dist/docs/`. Read the relevant guide there before writing
Next.js code: 16.4 differs from most training data (Cache Components,
`proxy.ts` instead of `middleware.ts`, async request APIs).

`agentRules` is `false` in `next.config.ts`, so `next dev` does not write its
own `AGENTS.md` block or a `CLAUDE.md` pointer file. The repository keeps
`AGENTS.md` files only.

## Store API

- Server clients come only from `platform/shopware/client.ts`
  (`createShopwareClient({ contextToken?, languageId? })`), and every module
  there imports `server-only` except `publicConfig.ts`, `shopSettings.ts`,
  `reads/countryOptions.ts`, `reads/languageOptions.ts` and
  `reads/cacheTags.ts`. The one browser
  client is `features/session/browserClient.ts` (see Session and actions).
  The config is read on the server at request time (`getShopwareConfig`:
  `SHOPWARE_ENDPOINT`, `SHOPWARE_ACCESS_TOKEN`, `SHOPWARE_PUBLIC_ENDPOINT`,
  `SHOPWARE_DEV_STOREFRONT_URL`, `SHOPWARE_MEDIA_ORIGIN`) and falls back to
  the public demo backend,
  like the Vue starter's `nuxt.config.ts` defaults. Server reads use
  `endpoint`; `publicEndpoint` (defaults to `endpoint`) is what the browser
  calls, for setups where the server reaches Shopware on an internal URL.
  `.env.template` leaves `SHOPWARE_PUBLIC_ENDPOINT` and
  `SHOPWARE_DEV_STOREFRONT_URL` empty on purpose: a demo value left there
  after `SHOPWARE_ENDPOINT` is re-pointed sends the shop's logins and
  registrations to the demo host. `getShopwareConfig` warns once per process
  when that happens.
- `platform/shopware/requestOptions.ts` reads `SHOPWARE_API_TIMEOUT`,
  `SHOPWARE_API_HEADERS` and `SHOPWARE_PUBLIC_API_HEADERS` at request time
  and parses each raw value once. `createShopwareClient` passes the timeout
  (whole milliseconds, 10000 when empty, `0` turns it off) as the client's
  `fetchOptions.timeout`, so every server call gets it and a per-call
  `fetchOptions.timeout` wins (the proxy's 2.5 s SEO lookups, the
  imitation's `READ_TIMEOUT_MS`). The default exists because `next start`
  has no fill timeout for `'use cache'` at request time and concurrent
  requests share one fill per key: without it, one hung read holds every
  request for that key until undici gives up (300 s, then ofetch retries
  the GET). It covers the wait for response headers only, and
  `readCountries` can take up to ten timeouts.
- The server sends `{ ...public, ...private }` headers (`SHOPWARE_API_HEADERS`
  wins per name) under its own `sw-language-id`. Names are trimmed and
  lowercased, because `createHeaders` and `defu` are case-sensitive and would
  send both spellings. Dropped with a warning: every `sw-*` name, with `_`
  read as `-` because PHP behind FastCGI maps both spellings to one server
  variable (it would replace the access key or the context token, or change a
  `'use cache'` response outside its key), `accept`, `content-type` and the transport
  headers undici consumes or throws on (`host`, `content-length`,
  `connection`, `keep-alive`, `transfer-encoding`, `upgrade`, `expect`, `te`,
  `trailer`); invalid names; values outside `\t\x20-\x7e\x80-\xff` (undici
  throws on them at request time); and, in the public variable only,
  browser-forbidden names (`isBrowserForbiddenHeader`). Bad input never
  throws, because a throw in the proxy or a read fails every request.
  Warnings go out once per message and never print a value or an invalid
  name, since values may be secrets.
- Create one server client per request, never at module scope. An instance
  adopts the `sw-context-token` of every response, so a shared one leaks
  sessions between users.
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
- Every read takes a trailing `languageId: string | null`, which sets the
  `sw-language-id` header and is part of the cache key; with a language id
  the read also tags `<tag>:<languageId>` next to its usual `sw:` tag
  (`languageCacheTags`). Pages get the id from
  `resolveLanguageId(locale)` (`reads/languages.ts`, cached `GET /language`):
  a locale maps to the Shopware language whose `translationCode.code`
  equals it, otherwise `null` and the default language is used, like
  `getLanguageIdFromCode` in the Vue `app.vue`. The demo backend has only
  English (US), so every locale reads in English there and only the UI
  labels change.
- Shop settings. `readShopSettings()` (`platform/shopware/reads/shopSettings.ts`,
  `getShopSettings get /shop-settings`, Shopware 6.7.14 and later) is the one
  read of the sales channel's system configuration. It takes no `languageId`,
  because system config is per sales channel and never translated (the
  `readLanguages` exception), and sets `cacheLife("hours")` and the tag
  `sw:shop-settings`, so an Administration change shows within the hour. A 404
  means a backend before 6.7.14 and is cached as `null`; any other failure
  throws and is not cached. The demo backend serves the route.
  - Pages read it only through `loadShopSettings()`
    (`platform/shopware/loadShopSettings.ts`), after `connection()` or another
    dynamic API, never from the root layout. It copies, group by group, only
    the fields of `ShopSettings` (`platform/shopware/shopSettings.ts`) whose
    answer has the fallback's type over `TEMPLATE_SHOP_SETTINGS`
    (`site/shopSettings.ts`), so a missing or renamed field falls back alone
    and no other setting reaches a client component. It warns once per process
    when the route is missing, logs a failed read as `apiFailureSummary` on
    every call, returns a fresh object and never rejects.
  - `site/shopSettings.ts` is the override point for a shop on an older
    backend, next to `site/theme.css`. Its values reproduce the template before
    it read any setting: the account-type select, a password minimum of
    `REGISTRATION_MIN_LENGTHS.password` (8), no other registration field, no
    order cancellation and no customer comment. It reads that constant when it
    loads, so `features/account/registrationSchema.ts` must never import it,
    directly or through another module: the cycle leaves the constant
    uninitialized.
  - A server component passes a client component only the slice it uses
    (`cart.enableOrderRefunds`, `loginRegistration`, `toCheckoutSettings`), as
    props. To use another field, add it to `ShopSettings` and to
    `TEMPLATE_SHOP_SETTINGS` with the value that keeps today's behaviour.
    Tests mock `loadShopSettings` and build values with `shopSettings()` from
    `platform/shopware/shopSettings.fixture.ts`.
  - Its consumers are the registration forms (`loadRegistrationReferences`,
    see Account), the two order pages (`cart.enableOrderRefunds`) and the
    checkout (data protection, password minimum and customer comment, see
    Checkout). The demo turns on the salutation select and the checkout
    comment, keeps the account-type select and leaves cancellation off.
- The Store API caps `limit` at 100 and the demo backend has 250 countries, so
  `readCountries` pages through `/country` with `"total-count-mode": "exact"`
  until `elements.length >= total` (ten pages at most) and returns
  `CountryOption`s. The sort is `position`, then `name`, then `id`: most
  countries share one position, and paging on a non-unique sort returns the
  same country on several pages (153 unique out of 250 on the demo). The mapping and the per-page criteria sit in
  `reads/countryOptions.ts` without `server-only`, so client islands and tests
  can import the type and the pure helpers.
- Import Store API types from `#shopware` (`shopware.d.ts`) with `import type`
  only. Point that file at `./api-types/storeApiTypes` after running
  `loadSchema` and `generate-types` to get the types of your own instance.

## Routing and CMS

- Every page lives under `app/[locale]/` (see Internationalization);
  `app/api/**`, `app/robots.ts`, `app/sitemap.xml/` and `app/sitemap/` (see
  Crawling, sitemap and resource hints), `app/globals.css` and
  `app/favicon.ico` stay outside. The
  root layout `app/[locale]/layout.tsx` holds only `<html lang>`, `<body>`,
  `I18nProvider` and `StorefrontProviders`.
  Two route groups carry the two Vue layouts. `app/[locale]/(shop)/layout.tsx`
  (`Header`, `<main>` labelled `layout.ariaLabels.mainContent`, `Footer`; the
  Vue default layout) holds `/` (`app/[locale]/(shop)/page.tsx`), the catch-all
  `app/[locale]/(shop)/[...path]/page.tsx`, the account area (see Account) and the
  order pages under `app/[locale]/(shop)/checkout/success/[id]/`. `app/[locale]/(checkout)/layout.tsx`
  (`CheckoutHeader`, `<main>` labelled `layout.ariaLabels.checkout`; the Vue
  `layouts/checkout.vue`) holds `/checkout` and `/checkout/cart`. Both groups
  have a `checkout` folder; that is fine as long as no URL resolves in both.
  A static segment wins over the catch-all, so a new page goes into the group
  whose layout it needs.
- `app/[locale]/(shop)/page.tsx` renders the sales channel's navigation category for
  `/`. `app/[locale]/(shop)/[...path]/page.tsx` resolves every other storefront URL in
  a server component: technical paths (`/navigation/{id}`, `/detail/{id}`,
  `/landingPage/{id}`) are parsed with `getRouteFromPathInfo`, everything
  else is looked up in `/seo-url` with both the plain path and the path with
  a trailing slash. The result is dispatched to
  `features/cms/components/{NavigationPage,DetailPage,LandingPage}` and
  `features/account/customerGroup/CustomerGroupRegistrationPage`.
- Status codes come from `proxy.ts`, not from the page: a `notFound()` inside
  the page's `<Suspense>` can only stream a 200 with `noindex`. Before a
  catalog path renders, the proxy asks `seoResolver` (`platform/routing/`,
  an in-memory LRU per instance: hits 1 h, redirects 5 min (so a renamed
  SEO URL cannot loop for long), misses 1 min, stale answers served while one
  lookup refreshes them, maintenance and failures never cached; paths over
  750 characters or with `//` are rejected before the cache):
  - a stored SEO path renders as before (the page repeats its own cached
    lookup);
  - another case or slash spelling, a superseded URL (`isCanonical` is
    `NULL`, not `false`, on old rows) and a technical path with an SEO URL
    get a 301 to the stored canonical spelling, query kept, trailing slash
    kept (unlike Vue's `getCanonicalPathForTechnicalPath`, which drops it and
    then misses its own lookup);
  - a miss or a route name without a page is rewritten to
    `app/[locale]/(shop)/sw/not-found`, a static page that only calls
    `notFound()`, so it answers a real 404 with the shop layout;
  - `FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE` answers a 503 page from
    the proxy (`maintenancePage.ts`, `<h1>503</h1><h2>…</h2>`, `Retry-After`).
    `maintenanceMonitor` probes `/context` once per 30 s per instance so `/`
    and the account pages get it too. The Store API checks the IP allowlist
    against the Next server's IP, not the visitor's.
  - A timeout, 429 or 5xx with nothing cached lets the request render as it
    did before (soft 404 at worst) instead of answering 503: every visible
    `<Link>` prefetch runs the proxy, and the demo backend's per-IP limit
    would otherwise turn prefetches into errors. After such a failure the
    resolver skips lookups of uncached paths for 5 s. The same pass-through
    applies while `GET /language` has never been read: a lookup without
    `sw-language-id` runs in the default language and would 404 or redirect
    translated paths.
  - Only live lookups report to `maintenanceMonitor` (`onLookup` in
    `shopwareRouting.ts`), so cached answers cannot keep clearing it. A 301
    whose target would leave the request's origin, or whose stored path
    holds a backslash or a control character, is never sent.
  - `RENDERED_ROUTE_NAMES` (`platform/shopware/routeNames.ts`) is the one
    list of route names the storefront renders, used by the proxy and the
    page's own lookup. The proxy and `readLanguages` both keep the language
    list for an hour, so they agree on the locale's language.
- `/`, `/account/**`, `/checkout/**`, `/newsletter-subscribe`,
  `/registration/**`, `/search` and `/wishlist` (`APP_ROUTE_SEGMENTS` in
  `platform/routing/paths.ts`, checked against the app folders by
  `proxy.test.ts`) skip the lookup. Real statuses only show on `next start`;
  `next dev` and unit tests cannot prove the 404 of the rewritten page.
- `skipTrailingSlashRedirect` is on because Shopware category paths end with
  `/`. The catch-all receives the segments without that slash, which is why
  the SEO lookup tries both spellings.
- CMS pages render through `@shopware/cms-base-layer-react`: `CmsPage` with a
  `CmsContext` built by `platform/cms/context.ts` (`createStorefrontCmsContext`
  with the page `locale` and `languageId`: `ctx.locale`, `ctx.urlPrefix` from
  `localePrefix`, `ctx.translations` from `getMessagesFor`, currency from
  `/context`). Override a CMS component in
  `platform/cms/registry.ts` with `mergeCmsRegistries`, never by editing the
  package. `app/globals.css` imports the package stylesheet and adds `@source`
  for its `src`, otherwise Tailwind drops the component classes.
- `ctx.navigation`, the tree of the `category-navigation` element, comes from
  `readCategoryNavigation(cmsPage, rootId, languageId)` in
  `platform/cms/categoryNavigation.ts`. It reads only when the layout holds a
  `category-navigation` slot (`hasCmsElement` in `platform/cms/cmsElements.ts`,
  no `server-only`), otherwise it gives `undefined` without a request.
  Category pages read the current category's children
  (`readNavigation(navigationId, 2, languageId)`, so a leaf category shows no
  sidebar, like Vue). The home, landing and product pages read
  `readNavigation("main-navigation", 2, languageId)`, the Header's cache entry
  and tags, so they add no Store API call; keep the alias and the depth in step
  with the Header or they stop sharing it. A failed read logs
  `[CMS] reading the category navigation failed` once and renders the page
  without the sidebar, while `readNavigation` itself still throws, so the
  failure is not cached. Landing and product pages get no active path: the
  main navigation shows its top level collapsed, and the active id is
  `ctx.category?.id`, which only category pages set. Landing and product
  pages hand the read to `createStorefrontCmsContext` as a promise, so it runs
  next to the sales channel context read instead of before it.
- Listing state lives in the URL (`manufacturer`, `properties`, `min-price`,
  `max-price`, `rating`, `shipping-free`, `order`, `limit`, `p`). When those
  params are present and the category layout contains a product listing,
  `NavigationPage` re-reads `/product-listing/{categoryId}` with them and
  passes the result as `ctx.listing`; otherwise the listing embedded in the
  CMS data is used. A param the URL leaves out (a page change sends only
  `p`) is filled from that embedded listing, which is page 1:
  `buildListingQueryParams(searchParams, { limit, order: sorting })`. Never
  default to fixed values: page 1 uses the sales channel's
  `core.listing.productsPerPage` and default sorting (24 and `name-asc` on a
  default Shopware, 15 on the demo), so a fixed `limit: 15` re-paged a
  24-per-page listing, repeating and skipping products and changing the
  page count after the first click. Without an embedded listing the read
  sends neither, and the backend applies the same defaults.
- Reading `searchParams` or calling `connection()` makes a subtree dynamic, so
  it always happens inside a `<Suspense>` (`PageSkeleton` is the fallback).
  Catalog routes must never read `cookies()` or `headers()`.
- The home page (`app/[locale]/(shop)/page.tsx`) calls `connection()` before its
  reads so `next build` does not need the Store API. Prerendering at build
  time is a later decision. It passes its `searchParams` to `NavigationPage`
  like the catch-all, so a root category with a product listing sorts,
  filters and pages on `/` too, and its metadata gets `?p=N` in the
  canonical.

## HTTP cache headers

- `next.config.ts` `headers()` returns `cacheHeaderRules()` from
  `platform/routing/cacheHeaders.ts`, which has no `server-only` and only
  relative imports because next.config loads it.
- `PERSONAL_AREAS` (`account`, `checkout`, `wishlist`, `registration/confirm`
  and `newsletter-subscribe`, unprefixed and under `/pl-PL` and `/de-DE`) get
  `Surrogate-Control: no-store` and `Cache-Control` set to
  `PERSONAL_CACHE_CONTROL` (`private, no-cache, no-store, max-age=0, must-revalidate`).
  `/<area>/:path*` also matches the bare path and a trailing slash, not
  `/accountancy`. Without them `next start` sends `s-maxage=31536000` for the
  fully static `/checkout/cart`. The two double opt-in entries are there
  because their URL carries a one-time hash; their HTML is already `private`
  (Header and Footer call `connection()`), so the rule is defence in depth,
  like `/wishlist`. The entry is `registration/confirm`, not `registration`, so
  a customer-group page at `/registration` keeps the Next headers. `/en-GB/*`
  is left out because the proxy 308-redirects it.
- `PUBLIC_ASSETS` lists every file in `public/` (a test fails when they
  drift apart) with `public, max-age=604800`: one week, not `immutable`, so a
  brand swap does not stay stuck in browsers for a year.
- Never add a rule that matches every path, `/_next/**`, `/api/**` or catalog
  paths: a matching config header replaces the `immutable` on
  `/_next/static`, a route handler's own `Cache-Control` and the `private`
  Next sends for PPR pages. Headers set by the proxy win over config headers;
  the proxy sets them only on the responses it answers itself (301, the
  rewritten 404, 503).
- Catalog HTML stays `private` while Header and Footer call `connection()`;
  CDN-cacheable catalog HTML needs that changed (a prerender flag or params
  passed into Header and Footer) and is a later decision.
- Rules match the incoming path before the proxy rewrite, case-insensitively.
  `next dev` always sends `no-store`, so check with `next build`,
  `next start` and curl. Unit tests use `unstable_getResponseFromNextConfig`
  from `next/experimental/testing/server`.

## Crawling, sitemap and resource hints

- `app/robots.ts`, `app/sitemap.xml/route.ts` and
  `app/sitemap/[...file]/route.ts` sit outside `app/[locale]`: robots.txt and
  sitemaps belong to the host, not to a locale. Each awaits `connection()`
  before it reads `STOREFRONT_URL`; a metadata route that only reads
  `process.env` is prerendered with the build's environment.
- robots.txt (`buildRobots` in `platform/seo/robots.ts`) keeps the Shopware
  storefront defaults `Allow: /`, `Disallow: /*?` and
  `Allow: /*referringSalesChannel=`, and adds `Allow: /*?p=` (listing
  canonicals keep `?p=N`, and the longest rule wins) and `Disallow: /api/`
  (the slash keeps `/apiary` crawlable). Account, checkout, wishlist,
  `/search` and the email-link pages are not disallowed on purpose: they are
  `noindex` (`PRIVATE_PAGE_ROBOTS`, `EMAIL_LINK_ROBOTS`), and a crawler that
  robots.txt keeps out never sees that, so the bare URL can still be indexed
  from links. `?search=` URLs are already covered by `Disallow: /*?`; a bare
  `Disallow: /search` would also block category paths such as
  `/search-engines/`. `Sitemap:` is listed only with `STOREFRONT_URL`, even
  when `/sitemap.xml` would 404, so robots.txt makes no Store API call. The
  Store API exposes neither the merchant's
  `core.basicInformation.robotsRules` nor `core.staging`, so there is no
  staging switch.
- Shopware generates the sitemaps; the storefront only serves them.
  `/sitemap.xml` is a `<sitemapindex>` of the files `GET /sitemap` lists
  (`readSitemapFiles`, read in each domain's language) for the sales channel
  domains whose origin is `STOREFRONT_URL`'s and whose path is a locale
  prefix (`isServedDomain`: `""`, `/pl-PL`, `/de-DE`). A file is matched to
  its domain by the domain id in its name
  (`salesChannel-{salesChannelId}-{languageId}/{salesChannelId}-{domainId}-sitemap-…`),
  and only when that domain has the language read; a name without a domain
  id (before 6.6.7) is skipped. Each file is listed as
  `/sitemap/<salesChannel-…>/<file>.xml.gz` on the storefront and streamed
  from `GET /sitemap/{filePath}` in the file's language, like the Shopware
  storefront's `frontend.sitemap.proxy`. The body is the gzip file itself
  (`Content-Type: application/gzip`, no `Content-Encoding`). The file route
  recomputes the index and answers 404 for a path that is not in it, without
  a file request. The `<loc>`s inside a file are built from the domain URL,
  so the storefront origin and its `/<locale>` paths must be sales channel
  domains with the matching languages. On the demo no domain matches (its
  domain is `/figma` on the backend host), so `/sitemap.xml` answers 404 and
  warns once. Headless sales channels get sitemap files only from Shopware
  6.7.15, and their SEO URLs use `store-api.*` route names that the routing
  does not resolve yet.
- `readSitemapFiles` is cached (`seo`, `sw:sitemap` plus its language tag)
  because `GET /sitemap` generates the files synchronously under the live
  refresh strategy. File bodies are not `'use cache'`d (binary, up to 49 999
  URLs each). Both sitemap routes send `SITEMAP_CACHE_CONTROL`
  (`public, max-age=0, s-maxage=3600`) for a CDN, and a miss sends
  `s-maxage=60`. A failed read answers 503 with `no-store` and
  `Retry-After: 300` and logs `[SEO] reading the Shopware sitemap failed`
  with `apiFailureSummary` on every failure. The domain list comes from
  `readSalesChannelContext(null)` (`reference`), so a domain change shows
  after `revalidateTag("sw:context")` or within a week.
- hreflang: catalog and home metadata add `alternates.languages` only when
  `STOREFRONT_URL` is set, at least two storefront locales have a Shopware
  language of their own (`hreflangLocales`; a locale on the default language
  only changes UI labels and is no translation), the page's locale is one of
  them and the page has an SEO URL. A technical fallback gets none, and
  neither does a customer-group registration page. The demo has no such
  locale, so it emits nothing and reads nothing. Every other locale's path
  is the entity's canonical SEO URL in its language (`readCanonicalSeoPath`,
  `GET /seo-url` by `routeName` and `foreignKey`, `seo`, `sw:seo-url`; the
  rendered product's id, not the requested one), one cached read per
  locale, because the Store API filters `/seo-url` to the request's
  language. A locale without one is left out, like the Shopware
  `HreflangLoader`, and a failed read drops only that locale.
  `buildLanguageAlternates` never throws, so the canonical is never lost.
  The home page needs no read, `?p=N` is carried like the canonical,
  `x-default` is the unprefixed `en-GB` URL (only when `en-GB` takes part)
  and `salesChannel.hreflangActive` is ignored (the Administration offers it
  only for storefront sales channels).
- `ResourceHints` (`features/layout/components/`, its own
  `<Suspense fallback={null}>` at the top of the shop layout, after
  `connection()`) preconnects to the media origin and, with
  `crossOrigin: "anonymous"`, to the public Store API origin, the pool the
  browser client's CORS fetches use (`resourceHintOrigins`). The media origin
  is `SHOPWARE_MEDIA_ORIGIN` (`mediaOrigin` of `getShopwareConfig`, never
  sent to the browser), else `https://cdn.shopware.store` for the demo, else
  the public Store API origin. An unusable value is ignored with one warning
  that names the variable, never the value. An origin equal to
  `STOREFRONT_URL`'s is skipped. The checkout layout gets none. Never move it
  into the root layout: a request-time read there makes every static page
  partially dynamic, and a build-time value ignores the runtime environment.
  There is no `dns-prefetch`, because every supported browser implements
  preconnect, and no web manifest, because there are no square icons. Keep
  `lcpImagePreload` off: the package preloads `media.url` with `format` and
  `quality` while `CmsMedia` renders `media.url` with a `srcset`, so the
  preload fetches a file the page never uses.
- Check these on `next build` and `next start`, not in unit tests:
  `/sitemap.xml` must stay a plain route handler with its own `Content-Type`
  and `Cache-Control`, and `curl -s / | grep preconnect` must show both
  hints. React hoists preconnect links in a full render, so no unit test can
  prove their place in a resumed stream.

## Layout

- `app/[locale]/(shop)/layout.tsx` renders `features/layout/components/Header` and
  `Footer` (both take the `locale`) around the `<main>` landmark. Both are
  server components. The parts that read the Store API
  (`readNavigation("main-navigation", 2, languageId)` for the header,
  `"footer-navigation"` with depth 1 for the footer) await
  `connection()` inside their own `<Suspense>`, so the hermetic build works
  and the header bar renders before the navigation streams in. The two header
  readers share one `cache()`d loader.
- Categories cross into client islands only as `NavigationNode` trees
  (`features/navigation/navigationTree.ts`: id, name, href from
  `getCategoryUrl` run through `withLocale`, `external` for
  `externalLink`/`linkNewTab`, children).
  `NavigationLink` turns `external` into `target="_blank" rel="noopener"`.
  Never pass `Schemas["Category"]` to a client component.
- Client islands: `TopNavigation` (desktop menubar with the flyout, hidden
  below `lg`), `MobileMenu` (burger plus a `<dialog>` drawer with
  `data-testid="sidebar-left"`, focus trap and body scroll lock), `HeaderBar`
  (logo, search, account/wishlist/cart buttons, mobile search toggle),
  `HeaderSearch`, `NewsletterBox`, `MetaNavigation` and `StickyHeader` (the
  `<header>` element itself, wrapping the server-rendered rows).
- The header is, from the top, the `shell-ink` meta bar, a white row (logo,
  sand search pill, account/wishlist/cart with a visible label under each
  icon from `lg`, equal to the button's `aria-label`) and, from `lg`, a
  full-width `shell-ink` navigation band with centred uppercase items. The
  band never wraps (`overflow-x-auto`, `justify-center-safe`, non-shrinking
  items), so `TopNavigationPlaceholder` keeps its height; only a classic
  scrollbar on an overflowing band adds to it, and the measured height below
  absorbs that. It is sticky from `lg` only (`lg:sticky lg:top-0 lg:z-30`),
  because below that it would cover half of a phone or 400%-zoom viewport.
  Everything that must clear it reads one property, `--sticky-header-height`:
  `StickyHeader` writes the measured height onto `<html>` with a
  `ResizeObserver`, and `app/globals.css` gives the pre-hydration value
  (11.3125rem, the 181px header) only while a `header[data-sticky-header]` is
  on the page, so the static `CheckoutHeader` gets no offset. Its users are
  the `scroll-padding-top` (WCAG 2.4.11), the flyout's and the mini cart's
  `max-h` (the mini cart opens 49px above the header's bottom edge) and the
  sticky summary of `OrderConfirmation`; never hardcode the header height
  elsewhere. `CheckoutHeader` is the meta bar
  plus a white row with the logo and an outlined "Continue Shopping" pill,
  not sticky. The footer has three tiers: the newsletter band on sand (its
  title stays a `<p>`), the `shell-ink` main footer (white logo,
  `FooterColumns`) and an ink bottom bar with `layout.footer.builtWith`.
- `MetaNavigation` (above the header bar and above `CheckoutHeader`, like the
  Vue default and checkout layouts, but on `shell-ink` with the switcher
  right-aligned) holds `LanguageSwitcher`, which lists
  the storefront locales of `i18n/config.ts` by their own names
  (`localeNames`: English, Polski, Deutsch, never translated) and is always
  shown. It is a disclosure button with a list of plain `<a>` links, not the
  Vue `<select>`: a select that navigates on change breaks WCAG 3.2.2, while
  links carry `hreflang`/`lang` and open in a new tab.
  The button names the current locale (`lang` on the name, the
  `layout.ariaLabels.languageSwitcher` label in `sr-only`). The list closes
  on Escape (focus back on the button only when focus is in the switcher or
  on `<body>`), on focus moving outside it, an outside `mousedown`, a
  followed link elsewhere on the page, `popstate` and a `pageshow` from the
  bfcache; choosing the current locale closes it and puts focus back on the
  button. Every close drops a pending choice.
- The hrefs are computed from `window.location` when the list opens and
  again on a click when the URL changed since (`pathForLocale` in
  `features/layout/localeSwitchPath.ts`: same path, search and hash under
  the other prefix), never from `usePathname()` during render, because the
  switcher sits in the header and that hook fails `next build` under
  `app/[locale]/(shop)/[...path]`. Home, `/account/**`, `/checkout/**` and
  technical paths only swap the prefix. On a catalog path, opening the list
  starts the lookup of every other locale whose Shopware language differs
  (`resolveLocaleSwitchPath`: `GET /seo-url` with the current
  `sw-language-id`, then the canonical SEO URL of that `routeName` and
  `foreignKey` in the chosen one, because Shopware stores SEO URLs per
  language) and replaces each href once it answers, so a plain click, a
  modified click and "open in new tab" all reach the page in the target
  language; closing the list aborts the lookup. Only when both locales read
  the same Shopware language (the demo: every locale reads English US) is
  the prefix swap the final href without a request. The Shopware language
  of a locale comes from `useShopwareLanguages()`
  (`features/session/components/ShopwareLanguagesContext.tsx`, the list the
  session store already read) via `findLanguageId`, else the sales
  channel's default language; while that list is unknown or its read
  failed, the switcher calls `useLoadShopwareLanguages()` (the store's
  `loadLanguages`, which reads `GET /language` again after a failure) first,
  and a failed read sends the locale to its home page instead of a prefix
  swap that may not resolve.
- Every plain click on another locale is a full page load
  (`window.location.assign`), never `router.push` or `next/link`: the
  `[locale]` root layout is soft-navigated, and Next keeps the previous
  locale's tree in a hidden `<Activity>` with its own session store, cart
  store and API client, which a switch back would revive with a stale
  token and cart. Until the new page loads, the chosen link is
  `aria-busy`/`aria-disabled` and dimmed, the button `aria-busy`, and a
  persistent `<output>` (role `status`) announces `layout.languageSwitcher.pending`.
  A click made before the href's lookup answered waits for it; a later
  choice replaces a waiting one, a repeat click on it is ignored, and the
  answer is dropped when the list closed, the switcher unmounted or the URL
  changed meanwhile. A Shopware
  language without a storefront locale cannot be chosen: add the locale
  and its messages to offer it.
- `MetaNavigation` also holds `CurrencySwitcher`, left of `LanguageSwitcher`
  so the language button does not move when it appears after hydration. It
  is a disclosure button (`data-testid="currency-switcher-button"`,
  `CurrencyIcon`, the `layout.ariaLabels.currencySwitcher` label in
  `sr-only` before the current label) with a list of `<button>`s
  (`currency-switcher-option`, `aria-current="true"` on the current one),
  not the Vue `<select>`, for the same WCAG 3.2.2 reason. Labels are
  "ISO (symbol)", or the ISO code alone (`currencyLabel` in
  `features/session/currencyOptions.ts`, a port of the Vue
  `useCurrencySwitcher`). The list comes from `useShopwareCurrencies()`;
  once the session status is not `"loading"` the switcher loads it through
  the store's memoized `loadCurrencies` (`readCurrencyGet get /currency`
  with `_criteria` sorted by `position` then `name`), retried on the next
  call after a failure. Nothing renders on the server, before that read,
  with fewer than two currencies or without a context currency. The list
  closes like the language list.
- Choosing another currency calls `useSessionActions().setCurrency(id)` and
  never loads a page, unlike the Vue `window.location.reload()`. While it
  runs, the button and the chosen option are `aria-busy`, every option is
  `aria-disabled`, further choices are ignored and an `<output>` announces
  `layout.currencySwitcher.pending`. On success the list closes, focus
  returns to the button, the `<output>` says `layout.currencySwitcher.changed`
  and `router.refresh()` re-renders the server components; on failure the
  action has shown its toast and the list stays open. When the PATCH
  succeeded but the session (read again through `retrySession()`) still holds
  the old currency, the page reloads like Vue, otherwise the cart would keep
  the old currency while the backend places the order in the new one. A
  failed currency read is retried on `online` and on a visible tab.
- Known divergence: the catalog keeps the sales channel's default currency.
  CMS pages render anonymously on the server and are cached for every
  visitor, and `ctx.currencyCode` comes from the anonymous `/context`, so
  catalog prices and the listing price filter stay consistent with each
  other but can differ from the cart, checkout, account and wishlist, even
  after a reload. Converting the catalog needs the price-bearing
  `'use cache'` reads to send `sw-currency-id` and take the currency as part
  of their cache key; `router.refresh()` cannot do it alone.
- Session data comes from `useSession()` in `features/session`, filled in the
  browser by `ShopwareSessionProvider` (see Session and actions). The account
  button sends a guest to `/account/login?redirect=<encoded path>` like the
  Vue header's `route.fullPath`, and `LoginForm` and `RegistrationForm`
  follow that `redirect` after a login or a registration.
  They read `window.location` in the event handler, never `usePathname()` or
  `useSearchParams()` during render: with Cache Components those hooks
  suspend the shop layout under `app/[locale]/(shop)/[...path]` (an unknown catch-all
  param), which fails `next build`, and would drop the login form out of the
  static shell. `AccountMenu` and `MiniCart` may call `usePathname()` only
  because they render after a click, never on the server.
- Logged in, the account button is a disclosure (`aria-expanded`,
  `aria-controls`) for `AccountMenu`: the "Signed in as" line, the four
  account links of `ACCOUNT_MENU_LINKS` (the `/account` one carries
  `data-testid="header-my-account-link"`, which the e2e `openMyAccount`
  clicks) and Logout. It closes on Escape, an outside `mousedown`, a route
  change, a followed link and a logout.
  With status `"error"` the click is not a guest click: it awaits
  `retrySession()` (the button is `aria-busy` meanwhile) and opens the menu or
  goes to the login page depending on the session it returns.
  `LoggedInRedirect` on `/account/login` decides once, on the first status
  that is not `"loading"`, and replaces to the redirect target only for a
  customer who arrived logged in; a login or registration on the page
  navigates from the form. Both resolve the same target
  (`resolveRedirectFromSearch`, which returns the URL-normalized path and
  refuses any whose normalized pathname starts with `//`, such as
  `/.//evil.example`), so a login during the first session read,
  which can trigger both, still lands on one URL. `LoggedInRedirect` takes
  a `fallback` (default `/`) for a URL without a usable `redirect`; the
  customer-group registration page passes `/account`, like the Vue
  `RegistrationForm`.
- The cart button reads `useCart().count` and is a disclosure for `MiniCart`
  (see Cart) that opens only while the count is above 0. The wishlist button
  is a `LocaleLink` to `/wishlist` (see Wishlist). The search field is a
  search form with suggestions (see Search), and the footer newsletter form
  goes through `subscribeNewsletter` of the actions port (see Forms).
- UI copy comes from the messages (see Internationalization). Layout,
  navigation and form-control keys the Vue files lack live in
  `i18n/<locale>/react/layout.json` (search keys in `react/search.json`);
  `layout.logo` is the brand name and stays the same in every locale.
  Active-link checks compare paths without the locale prefix (`pagePath` in
  `TopNavigation`, `isCurrentAccountPage`). Keep the Vue `data-testid`s and roles
  (`header-account-button[data-logged-in]`, `header-wishlist-button`,
  `header-mini-cart-button`, `header-search-input`,
  `[role="menubar"] [role="menuitem"]` for top-level entries only); the e2e
  suite asserts them.
- Icons are hand-ported meteor SVGs in `components/icons/index.tsx` (fill
  `currentColor`, `aria-hidden`). Shared class lists live in
  `components/input.ts`, `features/layout/headerAction.ts` and
  `features/layout/shellButton.ts` (the filled and outlined ink pills;
  variant classes only, so each call site adds its own display, padding and
  size through `cx`).
- `pnpm --filter react-starter-template test` runs two Vitest projects:
  `*.test.{ts,tsx}` in node (SSR markup through `test/render.tsx`) and
  `*.dom.test.tsx` in happy-dom for the interactive contract (drawer,
  flyout). A test that imports a `server-only` module, directly or through
  `i18n/server.ts`, mocks it with `vi.mock("server-only", () => ({}))`;
  components that call `connection()` are not rendered in tests.

## Internationalization

- Three locales, like the `i18n` block of the Vue starter's `nuxt.config.ts`
  (`prefix_except_default`, `detectBrowserLanguage: false`): `en-GB`
  (default, no URL prefix), `pl-PL` and `de-DE` (`/pl-PL/…`, `/de-DE/…`).
  `i18n/config.ts` owns the list and the path helpers (`isLocale`,
  `localePrefix`, `withLocale`, `stripLocale`). There is no i18n library;
  `i18n/translate.ts` implements the part of vue-i18n the Vue messages use.
- `proxy.ts` (Next 16's `middleware.ts`) rewrites an unprefixed path to
  `/en-GB/<path>` internally, redirects `/en-GB/<path>` to `/<path>` with a
  308 and passes `/pl-PL/*` and `/de-DE/*` through, after the status checks
  described under Routing and CMS. Any other first segment is a page path of
  the default locale, so `/xx-XX/…` goes through the SEO lookup and gets
  the 404 page. It skips `/api`, `/_next`, sitemap files
  (`/sitemap/<dir>/<file>.xml.gz`, `SITEMAP_FILE`, also copied into
  `config.matcher`; any other `/sitemap…` path stays a page path, and `.gz` is
  not a static extension) and static files, a closed list of asset extensions (`STATIC_FILE`, kept
  as a literal copy in `config.matcher` because Next reads `config`
  statically). Shopware product SEO URLs end in the product number and
  landing-page URLs are free text, so `/Shirt/TS-100.XL` and
  `/summer-sale.html` are pages; never add `html` or a generic extension
  pattern to the list.
- `app/[locale]/layout.tsx` returns every locale from
  `generateStaticParams`, so the locale param is known at build time and
  layouts can await it at the top (`localeFromParams` in `i18n/server.ts`
  validates it and calls `notFound()`). A page whose params also hold an
  unknown dynamic segment (`[...path]`, `[id]`, `[deepCode]`) gets a
  params promise that never resolves while prerendering, so its body awaits
  params only inside its `<Suspense>`; its `generateMetadata` may await them.
- Messages are the Vue starter's JSON files, copied unchanged into
  `i18n/<locale>/`, merged in the order of the Vue `en-GB.ts`
  (`i18n/<locale>/<locale>.ts`), then
  `i18n/<locale>/react/*.json` (one file per area, imported in `<locale>.ts`
  and listed in `REACT_AREAS` of `i18n/keys.test.ts` and
  `i18n/messages.test.ts`) deep-merged over them for keys only this template
  has, then everything over `en-GB` so a missing key falls back
  (`i18n/messages.ts`). Edit the Vue files only
  together with the Vue starter.
- `react/core.json` also carries the English defaults that
  `@shopware/cms-base-layer-react` components keep in their local
  `translationDefaults` (buy box, listing prices, pagination, filters,
  reviews, product card toasts, contact and newsletter forms) with Polish and
  German texts. The Vue JSON files lack them, which is why the Vue starter
  shows those labels in English under `/pl-PL`. When a package component
  gains a default, add its key here in all three locales; the English value
  must stay identical (e2e asserts `has been added to cart.`). The tab title
  "Category" in the description/reviews element is hardcoded in the package,
  as in the Vue layer, and stays English. Defaults that a package component
  gained with an area's feature live in that area's file instead:
  `product.variantConfigurator.*` in `react/variants.json`, and
  `form.messages.newsletterConfirmationSent` and
  `form.messages.newsletterUnsubscribed` in `react/forms.json`. Their English
  value must still equal the package default. `form.requiredFieldsNote` comes
  from the Vue `form.json`; its English equals the package default.
- Adding a key: reuse a Vue key when one fits (`grep` `i18n/en-GB/*.json`).
  Otherwise add it, in the same nested style, to the `react` file of its
  area in all three locales with real English, Polish and German text:
  `core` (CMS, metadata, shared API errors), `layout` (header, footer,
  navigation, form controls), `account`, `checkout` (checkout, plus the older
  cart keys `cart.remove`, `cart.itemImageAlt` and `cart.miniCart.close`),
  `search` (header suggestions and `/search`), `variants` (the variant
  configurator), `forms` (CMS contact and newsletter forms, the footer box),
  `emailLinks` (the double opt-in pages, and
  `errors.CHECKOUT__CUSTOMER_OPTIN_NOT_COMPLETED`, the 401 of a login before
  the confirmation, whose `detail` names the customer id; it lives there, not
  in `core`, so do not add it again), `recovery` (the password recovery
  pages, the login form's forgot link, and
  `errors.CHECKOUT__PASSWORD_POLICIES_UPDATED`, the 400 of a login whose
  stored password hash fails the current policy), `cart` (cart page,
  promotion codes, cart totals, and the cart error messages the Vue
  `errors.json` lacks), `checkoutExtras` (the checkout's sign-in prompt,
  address choice, terms and comment), `accountExtras` (the registration
  fields the shop settings switch on, the birthday field, order cancellation
  and the account order comment). Reference it with a literal key.
  `i18n/keys.test.ts` parses every non-test source file and fails for a literal key without an `en-GB`
  message (a `t("…")` or `translate("…")` argument, or any string shaped
  like `<namespace>.<key>` whose namespace exists, which covers key tables
  such as `ACCOUNT_MENU_LINKS`) and for a `react` file whose keys or
  `{placeholders}` differ between locales. A key built at runtime
  (`errors.${code}`) is not checked, so guard it with `hasTranslation`.
- `i18n/translate.ts` semantics: `{name}` and `{0}` params, a missing param
  renders empty, `{n}` and `{count}` carry the count. `a | b` and
  `a | b | c` plurals are picked with `Intl.PluralRules(locale)`: two forms
  are one/other, three forms one/few/other, and no count picks the last
  form. That deliberately differs from vue-i18n's index rule (three forms
  are zero/one/many there), which turns the Polish `search.result`
  ("wynik | wyniki | wyników") into "1 wyniki"; here Polish says 1 wynik,
  2 wyniki, 5 wyników, 22 wyniki and 0 wyników. A key missing in `en-GB`
  too returns the key and warns once in development.
- Server components translate with `getTranslator(locale)`; client
  components with `useTranslations()`, `useLocale()`, `useLocalePath()`
  and `useMessages()` from `i18n/I18nProvider.tsx`, which the root layout
  fills with `getMessagesFor(locale)`. Without a provider (tests) they give
  English. A server `generateMetadata` cannot call a function exported from
  a `"use client"` module, so shared copy helpers live in plain modules
  (`features/checkout/paymentResult.ts`). Tests wrap a node in
  `withI18n(node, locale)` and get a translator from
  `testTranslator(locale)` (`test/i18n.tsx`).
- Internal links go through `components/LocaleLink.tsx` (`next/link` with
  the href run through `useLocalePath()`), and `router.push`/`replace` take
  `useLocalePath()(path)`. Server code prefixes with
  `withLocale(path, locale)`. All three leave external URLs and
  already-prefixed paths alone, so a prefixed href (navigation trees, a `redirect` query) can pass through
  them again. Payment finish and error URLs and the login `redirect`
  carry the prefix, so the customer comes back in the same locale.
- Validation and API messages come from the messages too: the zod schema
  factories take a translator (`createLoginSchema(t)`,
  `createRegistrationSchema(options, t)`,
  `createCheckoutSchema(options, t)`, …), and `resolveApiErrorMessages(error, t, context?)` resolves
  `errors.<code>` (see Session and actions). `components/Price.tsx` and
  every `Intl.DateTimeFormat` format in the page locale (`useLocale()` or
  the server page's locale), with one cached formatter per locale.
- Metadata: pages export `generateMetadata({ params })` with
  `getTranslator(await localeFromParams(params))`, never a static
  `metadata` title. The root layout keeps the brand title
  (`%s | Shopware Frontends Demo Store`) in every locale and translates
  only `meta.description`.
- Catalog metadata (`platform/seo/`, built by `buildRouteMetadata` and
  `buildHomeMetadata`) follows the Shopware storefront, not Vue: title
  `metaTitle || name`, description `metaDescription` or the stripped
  description cut to 255 characters, `keywords`, a canonical from the
  entity's canonical SEO URL (technical path as fallback) with only `?p=N`
  for N > 1, and Open Graph (`ogTitle`/`ogDescription`/`openGraphMedia` for
  products, the category media, no image for landing pages; `og:type` stays
  `website` because Next has no `product` type). Pages with a translation in
  another storefront locale also get hreflang alternates (see Crawling,
  sitemap and resource hints). Absolute URLs need
  `STOREFRONT_URL`; without it the canonical is relative and `og:url` and the
  JSON-LD URLs are left out. The request host is never used, because the
  catalog does not read `headers()`. The home title stays the brand unless
  the root category has a `metaTitle`: `homeMetaTitle` is not exposed by the
  Store API.
- The product page renders `Product` JSON-LD and every catalog page with a
  trail a `BreadcrumbList` (`components/JsonLd.tsx` escapes `<`, `>`, `&` and
  the line separators). Prices are the anonymous default-currency prices the
  page shows. Breadcrumbs come from `GET /breadcrumb/{id}` with an explicit
  `type` (the default `product` tries the product first); 204 means no main
  category and gives no trail, a failed read renders the page without one,
  and the home page skips the read. The trail is hidden below `lg`, like Vue.
- Account, checkout, cart, wishlist, login, password recovery, search and the
  order success pages are `noindex, follow` (`PRIVATE_PAGE_ROBOTS`), like the
  Shopware storefront. Pages whose URL carries a secret are
  `noindex, nofollow`: the deep-link order page, the password reset page
  (which also sets `referrer: "no-referrer"`) and the double opt-in pages
  (`EMAIL_LINK_ROBOTS` in `features/emailLinks/metadata.ts`).
- The Shopware language follows the URL locale, like the Vue `app.vue`: a
  locale maps to the Shopware language whose `translationCode.code` equals
  it, otherwise the default language is used and only the UI labels change.
  Server reads pass `resolveLanguageId(locale)` (see Store API); the
  browser session applies the same mapping to the context (see Session and
  actions). The demo backend has only English (US), so product, category,
  country, salutation and method names stay English under `/pl-PL` and
  `/de-DE` there. The language and currency switchers are described under
  Layout.
- `<html lang>` is the URL locale, so Shopware text in another language
  declares its own (WCAG 3.1.2): `contentLanguageFor` in
  `platform/shopware/reads/languageOptions.ts` returns the code of the
  content language only when its primary subtag differs from the locale's
  (`en-US` under `pl-PL`, nothing under `en-GB`). On the server,
  `resolveContentLanguage(locale)` in `platform/shopware/reads/languages.ts`
  returns the `languageId` plus that `contentLang` for the default language
  (`languageIdChain[0]` of an anonymous context), and Header and Footer put
  it on every `NavigationNode.lang`. In the browser,
  `ShopwareSessionProvider` derives it from the languages the session store
  already read (`getLanguages()`, no extra request) and the session's
  `languageIdChain[0]`, and provides it through `ContentLanguageProvider`
  (`useContentLang()`). The root layout never reads Shopware: a rejected
  `'use cache'` read during prerendering fails the build even when the
  caller catches it. Put `lang={contentLang}` only on the element that
  holds Shopware data (category, line-item, method, delivery-time, order
  state, country, salutation and state names), never on a wrapper that also
  renders `t(...)`, and keep mixed strings such as the cart image `alt`
  without it. Limits: the CMS elements of `@shopware/cms-base-layer-react`
  (product names and descriptions, text blocks, listing cards, sorting and
  filter names) have no `lang` until that package takes a content language
  in its context, and wrapping `<CmsPage>` is wrong because it also renders
  `ctx.translations`; a field that falls back to the system language
  (`languageIdChain[1]`) cannot be detected; axe cannot check any of it, so
  the unit tests assert where `lang` appears.
- CMS components get `ctx.translations` (the same merged messages, the Vue
  `cmsTranslations`) and `ctx.urlPrefix`. A few labels hardcoded in
  `@shopware/cms-base-layer-react` ("Go to slide N", the star ratings) and
  internal links inside CMS rich text stay English and unprefixed; that is
  package behaviour. The 404 is `app/[locale]/(shop)/not-found.tsx`, so every
  `notFound()` under `(shop)` renders `NotFoundContent` (translated
  `<title>`, heading from `errors.message-404` and a localized home link)
  inside the shop layout and under the locale's `<html lang>`, as
  `<h1>404</h1><h2>{message}</h2>`, the shape `apps/e2e-tests/fixtures.ts`
  parses;
  `app/[locale]/not-found.tsx` is the fallback for other groups. A
  streamed 404 keeps the metadata `<title>` first in `<head>`, so the
  catch-all's `generateMetadata` titles an unresolved path with
  `errors.message-404` itself. The
  `notFound()` in the root layout itself (unknown locale) is not caught by
  either, but `proxy.ts` never routes there. The Inter font loads
  `latin-ext` for Polish glyphs.

## Session and actions

- The session lives in the browser, like `packages/nuxt-module/plugin.ts`:
  `features/session/browserClient.ts` creates the browser `@shopware/api-client`
  instance (`createBrowserClient`) with the context token from the
  JS-readable `sw-context-token` cookie, and an `onContextChanged` hook writes
  every new token back with `js-cookie`: 365 days, path `/`, `sameSite: "lax"`,
  `secure` when the page itself is served over `https:`. Nuxt keys `secure` on
  the endpoint protocol instead, but the cookie belongs to the page, so the
  page protocol is what counts. The module never imports a `server-only` file.
- Server rendering stays anonymous. Reads in `platform/shopware/reads/` create
  anonymous clients and never read `cookies()` or `headers()`, so the catalog
  stays static and cached: reading the cookie would move catalog routes to
  request-time rendering, and personalized catalog HTML must never be cached
  and shared. Anything personal is read in the browser after hydration;
  `StorefrontSession.status` is `"loading"` until then.
- The browser gets the endpoint, the access token and `devStorefrontUrl` from
  the route handler `app/api/shopware/config/route.ts` (`GET`, `connection()`
  first, `Cache-Control: no-store`), never from `NEXT_PUBLIC_*`: those are
  inlined at build time, so one build could not be re-pointed at another
  instance. `proxy.ts` skips `/api`, so the route handler is never rewritten
  under a locale.
  `loadPublicConfig` fetches it once per page load and forgets a failure, so
  the next caller retries; `parsePublicShopwareConfig` in
  `platform/shopware/publicConfig.ts` validates the payload. That fetch and
  the `/context` read give up after `READ_TIMEOUT_MS`
  (`features/session/readTimeout.ts`; ofetch retries the read once), because
  every action waits for them. Mutations other than `createOrder` have no
  timeout; `createOrder` gives up after `ORDER_TIMEOUT_MS` (60 s, same file),
  and ofetch never retries a POST, so the timeout cannot place a second
  order.
  The route also sends `headers`: `SHOPWARE_PUBLIC_API_HEADERS` through
  `getPublicApiHeaders()`, never `SHOPWARE_API_HEADERS`.
  `parsePublicShopwareConfig` re-applies the lowercase, reserved and
  browser-forbidden filter (the helpers live in the browser-safe
  `publicConfig.ts`), and `createBrowserClient` passes `config.headers` as
  `defaultHeaders`. Shopware's CORS preflight allows only `Content-Type`,
  `Authorization` and the core `sw-*` headers, so a custom header there
  blocks every browser call until a `CorsHeaderProviderInterface` service or
  an edge allows it. There is no browser timeout variable on purpose: a
  client-wide default would put a timeout on the login, register and cart
  mutations, which have none.
- `features/session/components/ShopwareSessionProvider.tsx`, mounted by
  `StorefrontProviders`, binds one `createSessionStore()`
  (`features/session/sessionStore.ts`) with `useSyncExternalStore`; the
  server snapshot is `anonymousSession`. The store creates the client once
  (also under StrictMode), reads `/context`, ignores a read that a newer one
  overtook, and derives the `StorefrontSession` (`sessionFromContext.ts`:
  `isLoggedIn` exactly like `useUser`, an active customer that is not a
  guest; `isGuestSession` is `!!customer?.guest`, also like `useUser`;
  `context` is the whole `SalesChannelContext` of the last read, `null`
  before it and after a failure). A failed read gives status `"error"`,
  logged to the console without a toast. A failed first read, and a failed
  re-read inside `login`, `register` or `logout` (the identity changed, so
  the old snapshot would be wrong), give a logged-out session with `context`
  `null`. A failed `refreshSession()` or `retrySession()` re-read keeps the
  last good session and its `context` with only the status set to
  `"error"`, so a flaky network does not log the customer out of the page
  or change the cart's session key. Only a successful first read is
  memoized, so after a failure the next action reads `/context` again before
  it runs. While the status is `"error"` the provider re-reads on `online`
  and on `visibilitychange` to a visible tab, and `retrySession()` on the
  actions port re-reads and resolves the new session (it never rejects).
  The session carries no wishlist data; the cart and the wishlist have their
  own stores (see Cart and Wishlist).
- The store applies the page locale like the Vue `app.vue`
  (`ShopwareSessionProvider` gets it from `StorefrontProviders` through
  `useLocale()`). After the first `/context` read it reads `GET /language`
  once and always applies `sw-language-id` for the locale's language (the
  matching one, else `salesChannel.languageId`) to the client's default
  headers. Only when that language differs from
  `context.languageIdChain[0]` does it also patch `/context` with
  `{ languageId }` and re-read `/context`. The header is what keeps a
  language changed by another tab on the same token, or restored at login,
  from taking over this tab. `getClient()` and the actions resolve only
  after that, so the first cart read already uses the language. The patch
  uses `READ_TIMEOUT_MS`, so a hanging one is a logged failure and never
  holds back `getClient()`, `getLanguages()` and the actions. A locale
  without a matching language switches the context to
  `salesChannel.languageId`, the default the server reads use, so the URL
  alone decides the language (`/de-DE` then `/pl-PL` does not keep German
  cart and method names, and a language set elsewhere, such as the
  Shopware storefront on the same backend, does not stick). A failure is
  logged and keeps the session. `setLocale` re-applies a new locale, but
  the language switcher loads every locale change as a new document (see
  Layout), so within one page load the locale normally stays the same.
  `loadLanguages()` reads `GET /language` on demand (again after a failed
  read) and returns the list with `salesChannel.languageId`;
  `ShopwareSessionProvider` exposes it through `useLoadShopwareLanguages()`
  and keeps the list it returns.
- Every other customer call in the browser (cart, checkout, account pages)
  goes through the same client. `ShopwareSessionProvider` mounts
  `ShopwareClientProvider`
  (`features/storefront/components/ShopwareClientContext.tsx`) with the
  store's `getClient()`, and `useShopwareClient()` returns that getter with a
  stable identity. It resolves only after the first `/context` read settled
  (a failed first read is retried, like the actions), so no request goes out
  before the cookie token is adopted, and it rejects while the public config
  cannot be loaded. Never create a second browser client: it would not see
  the tokens the session client adopts.
- After a mutation that changes what `/context` returns (`updateContext`,
  `changeProfile`, an address, an order), call `refreshSession()` on the
  actions port. It waits for the first read, re-reads `/context` and never
  rejects; a failed re-read is logged and gives status `"error"` with the
  last good session kept.
- Login, registration, the double opt-in confirmation (`confirmRegistration`,
  see Email links) and logout go through the session actions port
  (`features/session/components/SessionActionsContext.tsx`:
  `SessionActionsProvider`, `useSessionActions`), implemented by
  `createSessionActions` in `features/session/sessionActions.ts`: the Store
  API call, then a `/context` re-read, mirroring `useUser`. The forms send
  the real payload (`RegistrationInput` is the `/account/register` body
  without `storefrontUrl`); `register` adds `storefrontUrl` from
  `storefrontUrl.ts`, a port of `getStorefrontUrl`
  (`devStorefrontUrl`, else the page origin, matched against the sales
  channel domains), resolved after the client and its config are ready.
  A logout rejected with 403 `FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN`
  means the session already ended (another tab, an expired context), so it
  refreshes the session and resolves `{ ok: true }` without a toast; every
  other logout failure stays a failure. Actions called before the client is
  ready wait for it and for the first `/context` read, so a late guest token
  cannot overwrite the login token. A failed re-read after a successful
  mutation does not turn it into a failure.
- The actions never reject. On an error they resolve every message with
  `resolveApiErrorMessages(error, t, context?)` (`apiErrors.ts`, a port of
  the Vue `useApiErrorsResolver` that resolves `errors.<code>` through the
  translator of `useTranslations()`), show one error toast per message themselves and
  resolve `{ ok: false, message }` with the first one, so the forms must not
  notify `{ ok: false }` again. Anything that is not an `ApiClientError`
  resolves to `errors.message-default`. `confirmRegistration` is the
  exception to the toasts: it never toasts and resolves `{ status }`
  (`confirmed` with `guest`, `alreadyConfirmed`, `invalidLink` or `failed`),
  because its page shows the outcome inline.
- `StorefrontProviders` is also the app side of the CMS actions port
  (`CmsActionsProvider`). `addToCart` goes to the cart (see Cart),
  `toggleWishlist` and `isInWishlist` to the wishlist (see Wishlist),
  `getCustomerState`, `loadProductReviews` and `submitProductReview` to the
  reviews (see Reviews), `findVariant` to `findProductVariant` (see
  Variants), and `submitContactForm` and `subscribeNewsletter` to
  `createFormActions` (see Forms). Wire a new member there, not in the CMS
  components.
- `StorefrontProviders` renders the toasts of `notify()`. A toast's
  `action` is a `LocaleLink` rendered after the
  `data-testid="notification-element-message"` element, never inside it:
  `ProductPage.addToCart` in the e2e suite asserts that the last message's
  text ends with "has been added to cart.". Following the link or the close
  button dismisses the toast. A toast without `timeout` stays 5 seconds, a
  positive finite `timeout` is respected, and `0`, a negative or an infinite
  one keeps it until it is closed (the checkout's persistent errors).

- `setCurrency(currencyId)` sends `updateContext patch /context
{ currencyId }`, then re-reads `/context` with `keepLastGood`. The
  identity does not change, so a failed re-read keeps the last session with
  status `"error"`, as `refreshSession()` does. A failure resolves
  `{ ok: false, message }` after its own toasts. It never touches the cart;
  the new `context.currency.id` changes `cartSessionKey`. The currency
  belongs to the context token, so it survives page loads; a login restores
  the customer's stored context, currency included, and a logout starts in
  the default currency.
- `features/session/contextTokenCookie.ts` (no `server-only`) is the one
  definition of the session cookie: `CONTEXT_TOKEN_COOKIE`,
  `CONTEXT_TOKEN_LIFETIME_DAYS` (365), `contextTokenCookieAttributes(secure)`
  (`path "/"`, `sameSite "lax"`) and `contextTokenExpiry()`, the same date as
  js-cookie's `expires: 365`. `browserClient.ts` re-exports
  `CONTEXT_TOKEN_COOKIE` because several tests mock that module.
- The server writes the session cookie in one place only:
  `app/[locale]/(shop)/account/login/imitate-customer/route.ts`, the
  Administration's "Login as customer" (Vue
  `server/routes/account/login/imitate-customer.post.ts`).
  - It is a route handler, not a Server Action: the Administration posts a
    cross-origin `<form method=POST>` with urlencoded `token`, `customerId`
    and `userId`, and Server Actions abort when Origin ≠ Host. It exports
    only `POST`, so the token never appears in a URL.
  - It calls `imitateCustomer(createShopwareClient(), credentials)`
    (`features/session/imitateCustomer.ts`, `imitateCustomerLogin post
/account/login/imitate-customer`) on a fresh client without the
    visitor's token, so a guest cart is not merged and a logged-in customer
    is replaced. The new token comes from
    `client.defaultHeaders["sw-context-token"]`.
  - The cookie gets the browser client's attributes: `secure` when the
    request is https (or the first `x-forwarded-proto` is `https`), never
    `httpOnly`, because the browser client reads it. Success answers 303 to
    `withLocale("/account", locale)` with a relative `Location` and
    `no-store`; any failure answers 303 to the locale home without a
    cookie, like Vue. The `redirectUrl` in the answer is ignored.
  - Never log the error object or its message: the 400
    `CHECKOUT__IMITATE_CUSTOMER_INVALID_TOKEN` carries the token in `detail`
    and `meta.parameters`. Only the status and the codes are logged.
  - Requirements: the sales channel must be storefront type, its domain URLs
    must use exactly `/pl-PL` and `/de-DE`, and `SHOPWARE_ACCESS_TOKEN` must
    belong to the token's sales channel. An already open storefront tab
    keeps the old token in memory and writes it back on its next context
    change.

## Cart

- `features/cart/cartStore.ts` (`createCartStore`) holds the cart.
  `CartProvider` (`features/cart/components/CartProvider.tsx`, mounted by
  `StorefrontProviders` under the session provider) creates one store with
  `useShopwareClient()`, and `useCart()` (`features/cart/useCart.ts`) binds
  it with `useSyncExternalStore`; the server snapshot is
  `{ status: "loading", cart: null }`. `useCart()` adds the values of the Vue
  `useCart` computeds (`summarizeCart`): `count` sums `quantity` over the
  line items with `good === true`, `isEmpty` is `count <= 0`, `subtotal` is
  `price.positionPrice`, `totalPrice` is `price.totalPrice`,
  `shippingCosts` is `deliveries` and `appliedPromotionCodes` is the
  promotion line items (the Vue name). Its action functions keep their identity
  across cart updates. Without a provider it stays loading and the actions
  warn and resolve `{ ok: false }`.
- The store reads `readCart get /checkout/cart` (with `READ_TIMEOUT_MS`)
  once the session's first `/context` read settled, ready or failed, and
  again whenever `cartSessionKey` changes: the customer id, the guest flag,
  the context token, the context language or the context currency
  (`context.currency.id`), so after a login, a registration (guest or not),
  a logout, a language switch and a currency switch; the backend
  recalculates the cart in the new currency. An order keeps the token
  (`CartOrderRoute` only deletes the cart), and so does any other context
  switch (shipping or payment method, country), so neither re-reads on its
  own: call `refresh()`, `refreshWithResult()` or the function of
  `useCartRefresh()` after it; the checkout uses `useCartRefresh()` to toast
  the errors that read added. Between a currency
  switch and that re-read the mini cart shows the old amounts with the new
  symbol, and the checkout does not re-read its shipping and payment
  methods. A failed read is logged, sets status `"error"` and keeps
  the last cart.
- Mutations: `addProduct` posts `addLineItem` with
  `{ items: [{ id, referencedId: id, quantity, type: "product" }] }`
  (`quantity` defaults to 1, where the Vue `addProduct` sends 0),
  `removeItem` posts `removeLineItem` with `{ ids: [id] }`, and
  `changeQuantity` patches `updateLineItem` with `{ items: [{ id, quantity }] }`.
  Every returned cart replaces the stored one.
  - `addProducts(items)` sends all items in one `addLineItem` (an empty list
    resolves `{ ok: true, errors: [] }` without a request); the account's
    repeat order uses it.
  - `addPromotionCode(code)` posts `addLineItem` with
    `{ items: [{ type: "promotion", referencedId }] }`, the trimmed code with
    no id or quantity, like the Vue `submitPromotionCode`. A blank code
    resolves `{ ok: false, applied: false, message }` without a request. The
    result adds `applied`: whether a promotion line item of the returned cart
    references the code, ignoring case. `promotion-discount-added` is no
    proof, because automatic promotions raise it too. One code can create
    several promotion line items; `removeItem` on any of them makes the
    backend drop its siblings and the code. A code that is valid but not
    eligible stays in the cart without a line item and raises
    `promotion-not-eligible*` on every calculation. When the code is not
    applied and the filter left no error, the result carries the returned
    cart's `promotion-not-eligible*` entries anyway: with two stored codes
    that are not eligible, the entry raised last (the lower-priority
    promotion) replaces the other, so the filter alone would drop the new
    code's notice.
- All cart operations run one after another in request order. A request
  counter like the session store's is not enough here: two cart writes on one
  context token in flight at once can lose an update in Shopware, and a read
  started by a session change would win over an add-to-cart answer that
  arrived first. A `refresh()` still queued behind the same operation is
  joined instead of sent twice. `refreshWithResult()` joins that same queued
  read and resolves `{ ok: true, cart, errors, newErrors }`, or
  `{ ok: false }`; `refresh()` keeps resolving `void`. `errors` is every error
  of the read (no dedupe). `newErrors` leaves out the state errors the stored
  cart already had right before the read published (the mutation filter, so
  a mutation that ran in between is the baseline); joined callers share one
  result object. `useCartRefresh()`
  (`features/cart/components/useCartRefresh.ts`) returns a stable
  `() => Promise<CartReadResult>` that calls `refreshWithResult()`, toasts
  `newErrors` through `useCartNotifier()` once per result object and resolves
  the read unchanged. Cart
  mutations have no timeout (only
  `createOrder` has one, see Checkout), so a hung one holds the queue until
  the browser gives up.
- The actions never reject and never notify. Success resolves
  `{ ok: true, errors }`, where `errors` are `CartActionError`s:
  `CmsActionError` plus the backend `key` and `level` (0 notice, 10 warning,
  20 error; anything else counts as 20). A failure resolves
  `{ ok: false, message }` with the first `resolveApiErrorMessages` message,
  resolved with the translator `CartProvider` hands the store (`setTranslate`
  keeps it current). The caller decides what to show; the `messageKey`s are
  the `errors.<key>` messages.
  - The mapping is `cartErrors.ts`: `getErrorsCodes` of `useCartNotification`
    (keyed map only, without `promotion-discount-added`), then
    `resolveCartError` of `useCartErrorParamsResolver`
    (`product-stock-reached` gets `name` and `quantity` from the line item's
    label and `maxPurchase`, or becomes `product-stock-reached-empty` without
    them; `shipping-method-blocked` gets `name`; anything else carries all its
    fields as params).
  - A mutation leaves out a _state_ error (`CART_STATE_ERRORS`: blocked
    shipping or payment methods, blocked or invalid addresses, the
    calculator's `promotion-not-eligible`, `-not-logged-in`,
    `-specific-products`, `promotion-excluded`,
    `promotion-discount-zero-value`, `promotions-on-cart-price-zero-error`)
    when the cart before it already had the same
    `(key, messageKey, message)`. Shopware raises these on every calculation;
    without the filter every add-to-cart repeats them, and the CMS islands
    then skip their success toast. Every `promotion-not-eligible*` shares the
    key `promotion-not-eligible` and the cart keeps one entry per key: the
    `messageKey` keeps a one-shot `-already-added` from hiding a later
    `-not-logged-in`, and the `message` (`"Promotion <name> not eligible for cart!"`)
    tells two stored promotions apart. One-shot errors (stock, not
    found, already added or redeemed) are always returned.
  - The Store API exposes no `isPersistent` flag, and without
    `DEFERRED_CART_ERRORS` it loses a one-shot error raised while another
    request built the context, so the client can only show what the cart
    responses carry.
- CMS add-to-cart: `StorefrontProviders` maps the port's
  `addToCart({ productId, quantity })` to `addProduct` and returns its result
  unchanged. The islands (`SwProductAddToCartForm`,
  `SwProductCardAddToCartButton`) notify the success with the "View cart"
  action and the cart errors themselves, so the provider must not notify.
- `components/Price.tsx` formats with `formatPrice` from the CMS package,
  in the page locale (`useLocale()`). The currency is the `currencyCode`
  prop, else the session context's currency (`EUR` until it is read). It
  renders nothing for `null` or `undefined`. Order views pass the order's
  own currency (`getOrderCurrencyCode` in `features/checkout/orderDetails.ts`,
  from the `currency` association in `orderAssociations`), because an order
  keeps the currency it was placed in. Cart, checkout and wishlist amounts
  come in the session currency and pass none.
- The cart UI sits in `features/cart/components/`. `CheckoutProductTile` ports
  the Vue `checkout/ProductTile.vue`: `data-product-id` is the line item's
  `referencedId`, the quantity select shows only for stackable products
  (clamped to `quantityInformation`, snapped to `purchaseSteps`), Remove only
  for removable ones, and the payload options render as "Group: Option"
  under `cart-product-options`. `MiniCart` is the header panel (closes on
  Escape, an outside `mousedown`, a route change and once the cart is
  empty); `CartPageContent` is `/checkout/cart`
  (`app/[locale]/(checkout)/checkout/cart/page.tsx`). The cart page, the mini
  cart and the checkout `SummaryBox` go through `useLineItemActions`.
  - `CartPageContent` and `CheckoutPageContent` call `useCartLoadNotices()`.
    When the store already holds a cart (or its last read failed), it calls
    `refreshWithResult()` on mount and again each time Next reveals the page
    from its hidden `<Activity>` (effect cleanups reset it; state and refs
    survive), and toasts that read's errors. StrictMode's double effect run
    calls it twice in one commit; the store joins both into one request and
    a run counter lets only the latest run toast, so a hidden or unmounted
    page never toasts a read it left behind. On a
    cold load it toasts the errors of the first ready cart and sends no
    extra request. This is the Shopware Storefront's flash-on-load: blocked
    methods and stock changes show when the page opens, not only after a
    mutation. On `/checkout` this read comes on top of the two method reads,
    so every open costs three requests against the demo's per-IP limit. Load
    toasts take their type from the level and the default timeout, never
    `timeout: 0`, because toasts survive client navigation and would stack.
  - A failed first read shows the error with a "Try again" button that calls
    `refresh()`; the store keeps status `"error"` during that re-read, so the
    button holds its own pending state (`disabled`, `aria-busy`).
  - `useCartNotifier()` / `cartNotifications()` in `useLineItemActions.ts`
    are the one place that turns a cart result into toasts: one per error,
    with the message `errors.<messageKey>`, else the backend's
    `translatedMessage` (6.7.10+, tags stripped, ignored when it echoes
    `checkout.<messageKey>`), else `params.message`, and the type from the
    level; then the failure message, only when there are no errors.
    `cartResultMessages` returns the same strings. The CMS islands keep their
    own `"error"` toasts (package code).
  - `CartTotals` renders the subtotal (`cart-subtotal`), one shipping row per
    delivery (`cart-shipping-cost`), the `calculatedTaxes` lines (`cart-tax`:
    "incl." after the total for gross, "plus" before it for net, none for
    tax-free) and the total (`cart-total`). The cart page passes
    `withShippingMethod` and `withShippingEstimate` (the country of
    `deliveries[0].location.country`, the sales channel default for anonymous
    visitors); `SummaryBox` passes neither. The cart page has no country or
    method selector: the checkout owns method selection, and a server
    country list would make the static `/checkout/cart` dynamic. The mini
    cart keeps the subtotal and `cart.miniCart.taxEstimation`.
  - `PromotionCodeForm` sits on the cart page and in `SummaryBox` (the mini
    cart's "Proceed to checkout" skips the cart page), never in the mini
    cart. Results are toasts: `cart.promotionCode.added` when `applied`,
    followed by any side notices; otherwise the cart errors through
    `cartNotifications`, or `cart.promotionCode.notApplied` when there are
    none. A code that was not applied (or a failed request) also becomes the
    field error: the first of those messages, `aria-invalid`,
    `aria-describedby` and focus back on the input, because the toast
    disappears after its timeout. The code stays in the field so it can be
    corrected, and typing clears the error. An empty
    code is a field error (`validations.required`, `aria-invalid`, focus
    moves to the input), and a code already applied is an info toast without
    a request. The submit button never uses `BaseButton loading`, which
    disables it and drops focus; it sets `aria-busy` instead.
  - `CheckoutProductTile` hands `type === "promotion"` line items to
    `PromotionLineItemTile`: `TagIcon`, the name with `lang` plus the
    `cart.promotion` badge without it, no quantity, and Remove
    (`aria-describedby` the name) only when `removable`. The root keeps
    `checkout-product-tile-item`, `data-product-id` and adds
    `data-line-item-type="promotion"`; the inner ids come from vue-demo-store
    `PromotionItem.vue`. `TagIcon` lives in `components/icons/index.tsx` by
    choice, which avoids a `features/cart` → `features/checkout` import
    cycle through `SummaryBox`.
  - `useLineItemActions().remove` announces a successful removal with a
    `success` toast (`cart.promotionCode.removed` for a promotion,
    `cart.lineItemRemoved` with the label for any other item, none without a
    label) before the cart errors, and keeps keyboard focus: when the
    focused element sat in the removed `<li>`, it moves after the commit to
    the Remove button (`data-line-item-remove`) of the next item, else the
    previous one, else to the promo code input (`name="promoCode"`) beside
    the list. The cart page, `SummaryBox` and the mini cart get this from
    their `<ul>`/`<li>` markup alone. An emptied cart page has no target;
    the mini cart returns focus to its trigger itself.
- Keep the e2e ids (`page-objects/{CartPage,ProductPage}.ts`,
  `tests/addToCart.spec.ts`): `header-mini-cart-button`,
  `mini-cart-container`, `mini-cart-close-button`, `checkout-cart-link`,
  `checkout-product-tile-item`, `checkout-product-tile-image`,
  `checkout-product-tile-remove-button`, `cart-product-options`; from
  vue-demo-store `cart-shipping-cost`, `cart-promotion-name`,
  `cart-promotion-price`, `promotion-remove-button`; and the template's
  `cart-promotion-code-input`, `cart-promotion-code-submit`, `cart-tax`,
  `cart-shipping-estimate` (`cart-subtotal` and `cart-total` now also render
  on the cart page).
- There is no injectable cart store context, so component tests replace
  `useCart` with `vi.mock` (`cartView.fixture.tsx`,
  `features/checkout/checkoutTestDoubles.tsx`). `Price`,
  `CheckoutProductTile` and `ShopwareClientProvider` are real in tests: wrap
  a fake invoke client in `ShopwareClientHarness` instead of mocking
  `useShopwareClient`.

## Rules the code does not show

- Markup keeps the `@shopware/design-tokens` class names of the Vue
  templates (`bg-brand-primary`, `text-surface-on-surface`), so it ports
  between them. `site/theme.css`, imported after the package's
  `tailwind.css`, is the brand override point and re-themes the template
  without touching any component file: a later `@theme` value for a
  design-token name (`--color-brand-primary`, the surface containers, the
  outlines, `outline-outline-focus`) replaces the package value, so CMS
  blocks from `@shopware/cms-base-layer-react` follow the template's look
  too (ink buttons, peach secondary actions, warm surfaces), while the Vue
  starter keeps the package's purple. The same file defines the
  template-only `shell-*` colors for the layout chrome (header, meta bar,
  navigation band, footer, account side menu, mini cart and account menu
  panels). When changing a value, recompute every pair it takes part in:
  text 4.5:1, UI components and focus indicators 3:1. On `shell-ink` focus
  uses `outline-shell-accent`; `shell-accent` is never text on white or
  sand (2.99:1).
- The template reads `@shopware/design-tokens` from its build output, and
  `unbuild --stub` does not work in Next.js client bundles. After changing the
  package, rebuild it: `pnpm --filter @shopware/design-tokens build`.
  `@shopware/cms-base-layer-react` ships source, so its edits are live.
- `@shopware/design-tokens` and `@shopware/cms-base-layer-react` are linked
  with `workspace:*` until they are published, which is why the template is
  not scaffoldable yet.

## Checkout

- `/checkout` is `app/[locale]/(checkout)/checkout/page.tsx` in the checkout layout
  (`CheckoutHeader`, the `<main>` landmark, like the Vue
  `layouts/checkout.vue`). It awaits `connection()`, then
  `loadCountryOptions(locale, "Checkout")`
  (`platform/shopware/loadCountryOptions.ts`, shared with the login page's
  registration: the countries in the locale's Shopware language, or a
  logged `countriesUnavailable`) and `loadShopSettings()` in parallel inside
  `<Suspense>` (`CheckoutSkeleton`), and hands the countries and `settings`
  (`toCheckoutSettings(shopSettings, LEGAL_LINKS)`,
  `features/checkout/checkoutSettings.ts`) to
  `features/checkout/components/CheckoutPageContent.tsx`; a failed country
  read shows the country field's error with a retry, as on the login page.
  The success pages sit in the shop layout under
  `app/[locale]/(shop)/checkout/success/[id]/` (the Vue default layout); the static
  `checkout` segment wins over `app/[locale]/(shop)/[...path]`.
- Every checkout call runs in the browser through `useShopwareClient()`.
  The order belongs to the customer's context token, which only the browser
  client holds; doing it on the server would need `cookies()` and a second
  client that misses the tokens the session client adopts. The only server
  reads are the anonymous, cached country list and shop settings.
- `features/checkout/checkoutApi.ts` holds the calls as pure functions over
  `Pick<ApiClient, "invoke">`: `getShippingMethods`
  (`readShippingMethodGet get /shipping-method`, `onlyAvailable` plus
  `_criteria` with `prices`, sorted by `position`) and `getPaymentMethods`
  (`readPaymentMethodGet get /payment-method`, `onlyAvailable`), both with
  the query type widened locally because the GET types lack `onlyAvailable`
  (the backend reads it from the query too); `setShippingMethod`,
  `setPaymentMethod` and `setContextAddress`
  (`updateContext patch /context`); `listCheckoutAddresses`
  (`listAddress post /account/list-address` with `READ_TIMEOUT_MS`, so a
  stalled list ends in the list's error state with its retry); `createOrder`
  (body from `toOrderBody`);
  `updateCustomerDetails`; `readOrder` (`readOrder post /order` with
  `checkPromotion` and `orderAssociations`, the `useDefaultOrderAssociations`
  set plus the address countries and `currency`); `handlePayment`
  (`handlePaymentMethod post /handle-payment`). `updateCustomerDetails` sends
  every field of the existing default billing address with the patch,
  because the upsert route nulls the ones left out, then syncs the default
  shipping address (see Checkout extras), then `changeProfile`.
- `CheckoutPageContent` shows `CheckoutSkeleton` until the session and the
  first cart read settle, then the empty cart state or the three steps. A
  session that could not be read at all (status `"error"`, no `context`) and
  a failed first cart read each show an alert with a "Try again" button
  (`retrySession()`, `cart.refresh()`) instead of the steps, because an
  unknown session would otherwise show the guest form to a logged-in
  customer; an order in flight keeps the steps mounted. The
  selected methods are the session context's `shippingMethod` and
  `paymentMethod`, overridden only while a change is in flight; a change
  patches the context, then calls `refreshSession()` and the function of
  `useCartRefresh()` together (the token stays, so the cart store does not
  re-read on its own), which toasts the read's `newErrors` (see Cart), so a
  newly blocked shipping or payment method shows. The baseline is the cart
  the store held right before that read published, never the cart of the
  render where the click happened, so a state error that a cart mutation
  during the change already reported is not repeated; a failed read toasts
  nothing. An address choice goes through the same
  `refreshAfterContextChange`. After a login the checkout does not call it:
  the cart store already re-reads on the new customer id, and a second read
  would be compared against that read's cart and toast nothing.
  `useCartLoadNotices()` sits next to
  `useCart()`, so opening `/checkout` re-reads a cart the store already holds
  and toasts its errors (see Cart). `SummaryBox` renders `CartTotals` and
  `PromotionCodeForm`. Place order validates the form, when shown, with
  `checkoutSchema.ts` (the `useTemplateCheckout` rules, with the shop's
  `passwordMinLength` for an account) and the terms for every session, and
  focuses the first invalid field. Without a user session it registers
  through `useSessionActions().register` with `guest: !createAccount`; the
  action shows its own errors, so a `{ ok: false }` just stops, and a double
  opt-in shows the sign-up message and stops. A session that registered
  during this checkout updates the customer details on the next attempt
  instead of registering again, then refreshes the session and the cart
  (through `useCartRefresh()`, so a method the new address blocks is
  toasted), so the summary shows the totals of the new address; a customer
  who arrived
  logged in or as a guest skips the form and sees `CheckoutAddresses`. If a
  registration succeeded but the session still has no
  customer, the next attempt calls `retrySession()` instead of registering a
  second time and stops with `messages.error` while the customer is still
  missing. Then it reloads the methods, creates the order, pushes
  `localePath("/checkout/success/{id}")` and refreshes the session and the
  cart. A ref
  ignores a second click, the form is `inert` behind
  an `<output>` labelled `checkout.placingOrder`, and errors are persistent toasts
  (`timeout: 0`). A failed `createOrder` whose outcome is unknown
  (`isAmbiguousOrderFailure` in `checkoutApi.ts`: a timeout, an error
  without an HTTP status, or 502/503/504) shows `errors.order-timeout`,
  since the order may exist; any other API error shows its messages. Every
  failed `createOrder` re-reads the cart, so an order the backend committed
  turns the page into the empty cart state instead of inviting a retry
  against a stale summary. A client that cannot be created fails before
  the request and shows `errors.message-default`.
- `SuccessPageContent` `use()`s the params promise under `<Suspense>`, keyed
  by order id. A ready session that is neither logged in nor a guest is
  replaced to `localePath("/")`. Otherwise it reads the order once (a ref,
  so StrictMode does not start the payment twice), then calls
  `handlePayment` with `{origin}{prefix}/checkout/success/{id}/paid` and
  `/unpaid` as finish and error URLs
  (`paymentReturnUrls(origin, id, localePath)`). Only a `redirectUrl` that
  parses as an http(s) URL shows the payment alert and redirects after `PAYMENT_REDIRECT_DELAY_MS` (5 s, cleared on
  unmount); synchronous payment methods answer `null`. A failed
  `handle-payment` is only logged, and reloading the page runs it again. The
  backend pays only the newest transaction still in the `open` state. An
  order with no open transaction left (paid, failed, cancelled) answers 200
  with `redirectUrl: null`, so the page shows the confirmation with no
  payment alert. An async payment that is still open gets a fresh redirect.
  It errors only when the order has no transaction for this customer at all.
  `paid` and `unpaid` are server pages. The Vue starter calls their keys
  (`checkout.orderPaid`, `checkout.checkStatus`, …) without defining them,
  so `i18n/<locale>/react/checkout.json` adds them with the copy of the
  `vue-demo-store` `checkout.json` in all three locales.
- Checkout extras beyond the Vue starter; the deprecated `vue-demo-store`
  and the Shopware Storefront are the references. Copy lives in
  `i18n/<locale>/react/checkoutExtras.json`.
  - Settings: `CheckoutPageContent` gets `settings` (`CheckoutSettings`):
    `cart.showCustomerComment`, `loginRegistration.requireDataProtectionCheckbox`
    and `passwordMinLength` from `loadShopSettings()`, plus the legal links.
    Tests pass it explicitly (`checkoutSettings()` in `checkout.fixture.ts`).
  - Sign-in: a visitor who is not logged in, including a session that
    arrived as a guest, sees `CheckoutSignInPrompt` (`checkout-sign-in-link`)
    in step 1, except after registering on this page. It opens the global
    login modal through `useRequestLogin()`. After a login the page re-reads
    both method lists (the cart re-reads on its own, the customer id
    changed) and focuses the step-1 heading (`tabIndex={-1}`), because the
    prompt and the guest form unmount. A guest order by a returning customer
    is not blocked (`RegisterRoute` checks the email only for accounts), but
    it is not linked to their account.
  - Guest form: its address is the billing address ("Your address", as on
    the Storefront registration). `checkout-custom-shipping-address-checkbox`
    reveals a second `CustomerAddress` (`shipping-*` ids, `checkout-shipping-*`
    test ids, `checkout-shipping-country-select`, `shipping …` autocomplete)
    with its own names and the same rules (`validateCheckoutAddress`), sent
    as the register `shippingAddress`, which becomes the default shipping
    address. Unticking keeps the typed values but stops sending them. A
    session that registered during this checkout syncs it on the next
    attempt in `updateCustomerDetails`: it patches a separate default
    shipping address, creates one and makes it the default, or points the
    default back at the billing address when the box was unticked. A failed
    save is not followed by a session read, so `CheckoutPageContent` keeps
    the address a save created (`onShippingAddressCreated`, called right
    after the create and keyed by customer id) and passes it back as
    `createdShippingAddress`: a retry patches that address and makes it the
    default, unless the customer already shows it as the default, instead of
    creating a second one, and an unticked retry points the default back at
    the billing address. Server violations stay toasts, as for the billing
    address.
  - Registration settings: while the form is shown and the shop sets
    `requireDataProtectionCheckbox`, the terms box shows a required
    `form.privacyLabel` checkbox (`checkout-t&c-checkbox-data-protection`)
    and `acceptedDataProtection` sends its value; otherwise it sends `false`,
    the registration form's rule. A new account needs `passwordMinLength`
    characters. `createCustomerAccountDefault` is not honoured.
  - Customer or guest session: `CheckoutAddresses`, keyed by customer id,
    shows the context's `activeShippingAddress` and `activeBillingAddress`
    (falling back to the defaults; "Same as the shipping address" when the
    ids match). "Change …" is a disclosure with the customer's addresses as
    radios (`checkout-{shipping|billing}-address-{id}`) in a `<form>`. The
    radios only select, because arrow keys check a radio natively and a
    commit on change would switch the context on every step (WCAG 3.2.2).
    "Use this address" (`checkout-use-{shipping|billing}-address-button`, a
    submit button, so Enter works too) commits; the active address closes
    the list without a request. A successful change closes the list, returns
    focus to the toggle and announces
    `checkout.addresses.{shipping|billing}Changed` with `addressSummary()` in
    an `sr-only` `<output>`; a failed one keeps the list open with the
    selection and focus on the button.
  - `useCheckoutAddresses` reads the list with `listCheckoutAddresses` from
    an effect while a list is open, once per customer for each time the page
    is shown. Next keeps `/checkout` in a hidden `<Activity>` after a soft
    navigation and restores the same instance on the push back from "Add new
    address". The effect cleanup marks the list stale, so a list that is
    open after the reveal, or opens later, reads again. A read that answers
    while the page is hidden still sets the state, the newest request wins,
    and a refetch keeps showing the previous list instead of "Loading…".
  - A choice patches `/context` with `shippingAddressId` or
    `billingAddressId` only, like the Storefront address manager, so the
    defaults stay. Then it refreshes the session and the cart (toasting the
    new cart errors of that read, like a method change), takes the session
    from `retrySession()` (no request when the refresh succeeded, one more
    `/context` read when it failed) and re-reads both method lists, because
    availability and costs depend on the shipping country. The change counts
    only when that session is `"ready"` and its active address of that kind
    is the chosen one. Otherwise the choice fails with the persistent
    `checkout.addresses.changeUnconfirmed` toast. While the session status
    stays `"error"`, the page shows the last good, now stale, address and
    place order stays disabled until a later session read succeeds. Place
    order is disabled and a second choice is ignored while a change is in
    flight; a failed patch is a toast and the list stays open. Customers get
    "Add new address" (`checkout-add-{shipping|billing}-address-link`) to
    `/account/address/new?redirect=<locale-prefixed /checkout>`, which comes
    back after saving (see Account); guests do not, because the account area
    treats them as logged out.
  - Terms: `CheckoutTerms` (`checkout-terms-box`) always requires `tos`
    (`checkout-t&c-checkbox-tos`), and requires `revocation`
    (`checkout-t&c-checkbox-revocation`) when any line item, children
    included, is digital (`payload.productType === "digital"` or the
    `is-download` state, the Storefront's `showRevocation`). An unticked box
    stops place order before any registration. Both are checked only in the
    browser and never sent: `CartOrderRoute` validates no order data; only
    the Storefront's `OrderService` does. Do not gate `tos` on
    `cart.showTosCheckbox` yet. Its admin field is behind the `v6.8.0.0` flag
    and is migrated to `false` (the demo answers `false`), while the 6.7
    Storefront always requires the checkbox. With 6.8, gate on it and show an
    "accepted by placing the order" line otherwise.
  - Terms links: `site/legalLinks.ts` (`LEGAL_LINKS`, both `null`) is the
    override point, next to `site/shopSettings.ts`. The Store API exposes
    neither `core.basicInformation.tosPage` nor `revocationPage`, and both
    are CMS shop pages without a URL. `toLegalLinkHref` keeps a path with a
    single leading `/` (run through the locale prefix) or an http(s) URL and
    drops anything else. Point a link at the category that shows the page,
    ideally its technical path `/navigation/{categoryId}`, which the proxy
    redirects to the SEO URL in each locale's language. Links open in a new
    tab, with `prefetch={false}` for a storefront path and `noreferrer` for
    an external one. Without a link the label is plain text and the
    revocation notice is not shown. `LinkedMessage` puts the link into a
    `{link}` placeholder (`splitLinkedMessage`), because `translate` returns
    strings only. The link's `sr-only` "(opens in a new tab)" hint sits
    inside the `tos` checkbox's `<label>`, so `CheckoutTerms` gives that
    checkbox an `aria-label` with the plain sentence (`linkedMessageText`):
    the visible text stays in the name (2.5.3), the hint does not.
  - Comment: `CustomerComment` shows when `settings.showCustomerComment`
    (`false` in `TEMPLATE_SHOP_SETTINGS`, `true` on the demo). It is sent
    trimmed as `customerComment` only when it is not blank (`toOrderBody`),
    again on a retry, with no length limit: the backend stores LongText and
    strips tags. The success page shows `order.customerComment`
    (`OrderCustomerComment`, `order-customer-comment`).
  - Not ported: adding or editing an address inside the checkout, filtering
    countries by `shippingAvailable`, hiding the shipping address of
    digital-only carts, and logging out from the checkout.
- Keep the e2e ids (`page-objects/CheckoutPage.ts`, `tests/createOrder.spec.ts`):
  `checkout-pi-email-input`, `checkout-pi-password-input`,
  `checkout-create-account-toggle`, `checkout-pi-first-name-input`,
  `checkout-pi-last-name-input`, `checkout-pi-street-address-input`,
  `checkout-pi-zip-code-input`, `checkout-pi-city-input`, `country-select`,
  `checkout-pi-state-input`, `checkout-shipping-method` (one per row, around a
  native `name="shipping-method"` radio), `checkout-place-order-button`,
  `cart-subtotal`, `cart-total`, `checkout-success-page`, `order-subtotal`,
  `order-shipping`, `order-total`, `checkout-sign-in-link`,
  `checkout-terms-box`, `checkout-t&c-checkbox-tos` and
  `checkout-t&c-checkbox-data-protection`. `CheckoutPage.markTerms` waits for
  `checkout-place-order-button` before it looks for the checkboxes, because
  the checkout shows a skeleton until the session and the cart are read, and
  ticks the data-protection box only where one exists.
- For a logged-in customer the success page links to
  `/account/order/details/{id}` (`checkout.success.viewInAccount`), as Vue
  does. Not
  ported yet: the success page's downloads of digital line items (the
  account order page has them, see Account).

## Account

- Routes. `app/[locale]/(shop)/account/(member)/layout.tsx` renders `AccountShell`
  (the Vue `layouts/account.vue`: the "Your account" side menu from `md` up
  and the content column) around every page that needs a customer: `/account`,
  `/account/profile`, `/account/profile/change-email`,
  `/account/profile/change-password`, `/account/address`,
  `/account/address/new`, `/account/address/edit/[id]`, `/account/order` and
  `/account/order/details/[id]`. The `(member)` group adds the layout without
  a URL segment. `/account/login`, the password recovery pages
  `/account/recover` and `/account/recover/password`, and the deep-link order
  page `app/[locale]/(shop)/account/order/[deepCode]/page.tsx` stay outside it
  and public, like the Vue `[deepCode].vue`, which does not use the account
  layout. No URL resolves in both: the static `details` segment wins over
  `[deepCode]`, and `(member)` has no `recover` folder.
- Every page under `(member)` exports `instant = false`. The guard renders its
  skeleton instead of the page until the browser session is known, so the dev
  instant-navigation validator never sees the page segment and reports it as
  dropped. The content is customer-specific and renders after hydration
  anyway; keep the export on new account pages.
- The guard runs in the browser, like the Vue `useAuthGuardRedirection`. The
  session token lives in a JS-readable cookie that only the browser client
  uses, and server rendering never reads `cookies()` (see Session and
  actions), so the server cannot tell who is logged in. Every account page is
  prerendered as a static shell with `AccountGuardSkeleton` (`aria-busy`),
  and personal content renders after hydration. `AccountGuard` (inside the
  shell) waits while the status is `"loading"`. When the status is `"ready"`
  and the visitor is not logged in, it redirects. A guest counts as logged
  out. The redirect shows one `account.messages.loginRequired` info toast and
  calls `router.replace` with `localePath("/account/login")` plus
  `?redirect=<encoded path>`, the prefixed path taken from
  `window.location`, never from `usePathname()`. When the status is
  `"error"` and there is no customer, the guard calls `retrySession()` once
  first, the way `HeaderBar` does.
- A logout from the header `AccountMenu` or the side `AccountMenuList` goes
  through `useAccountLogout`. It sets a module flag (`takeLogoutIntent`), so
  the guard skips its redirect and toast, and the menu's
  `push(localePath("/"))` decides
  where the customer goes. Without the flag, the session update lands before
  the push and sends the customer to the login page with "Login is
  required". The flag is cleared on a failed logout and whenever a guard
  mounts.
- `AccountMenuList` calls `usePathname()` inside its own `<Suspense>`, whose
  fallback is the same list without `aria-current`. With Cache Components
  the hook suspends under an unknown dynamic param (`address/edit/[id]`,
  `order/details/[id]`), and `next build` fails without the boundary.
  `aria-current="page"` marks exact paths only, as Vue's active class does, so
  sub-pages such as `/account/profile/change-email` mark no link.
- The customer. The shell mounts `CustomerProvider`
  (`features/account/customer/`) inside the guard. `useCustomer()` returns
  `{ status, customer, refresh }`.
  - It reads `readCustomer post /account/customer` with `CUSTOMER_CRITERIA`
    (salutation, and both default addresses with country, countryState and
    salutation) and `READ_TIMEOUT_MS`.
  - It reads once per session customer id. A new id resets the state to
    loading, and answers from reads that a newer one overtook are ignored.
  - A failed first read gives `"error"` with no customer. A failed refresh
    keeps the last customer and sets `"error"`.
  - `refresh()` never rejects.
  - Outside the provider (the deep-link page) the hook stays loading and
    `refresh` only warns.
- The refresh rule. The header name and the checkout's default addresses come
  from `/context`, and the account pages come from the customer read. So
  after any mutation that changes the customer (profile, email, an address
  edit or delete, a new default billing or shipping address), call
  `useCustomer().refresh()` and `useSessionActions().refreshSession()`
  together.
- The server side of the area is only the anonymous `'use cache'` reads:
  `readCountries`, `readSalutations` (`platform/shopware/reads/salutations.ts`,
  `readSalutationGet get /salutation`, `cacheLife("reference")`) and
  `readShopSettings` through `loadShopSettings()` (see Store API). The
  `server-only` loaders `features/account/{profile/profileReferences,address/addressReferences,registrationReferences}.ts`
  take the page locale, resolve its language id,
  call them after `connection()` inside `<Suspense>` and turn a failure into
  a `*Unavailable` flag with a retry. Every customer call runs in the browser
  through `useShopwareClient()`, as pure functions over
  `Pick<ApiClient, "invoke">` in `profile/profileApi.ts`,
  `address/addressApi.ts` and `orders/ordersApi.ts`. None of the customer
  endpoints below has a GET variant, except the downloads.
- What each page calls:
  - `/account` (`AccountOverview`): the customer. `NewsletterSection` reads
    `readNewsletterRecipient post /account/newsletter-recipient`, then
    `subscribeToNewsletter post /newsletter/subscribe` (with
    `option: "subscribe"` and `storefrontUrl` from `getStorefrontUrl`) or
    `unsubscribeToNewsletter post /newsletter/unsubscribe`. A failed toggle
    puts the checkbox back.
  - `/account/profile`: salutations on the server, then
    `changeProfile post /account/change-profile`. The body always sends
    `accountType`, because without it the backend keeps a business type.
  - `change-email` and `change-password`:
    `changeEmail post /account/change-email` and
    `changePassword post /account/change-password`, then
    `push(localePath("/account/profile"))`.
  - `/account/address`: `listAddress post /account/list-address`, with the
    defaults taken from `useCustomer()`. Also `deleteCustomerAddress delete`,
    `defaultBillingAddress patch` and `defaultShippingAddress patch`. Delete
    is hidden on a default address, and there is no confirmation step,
    because `Tile.vue` has none.
  - `address/new` and `address/edit/[id]`: countries and salutations on the
    server, then `createCustomerAddress post /account/address` or
    `updateCustomerAddress patch /account/address/{addressId}`. The edit page
    reads its address through `list-address` with an `equals` filter on `id`.
    An update sends every stored field merged with the form values, because
    `UpsertAddressRoute` nulls the fields it does not get.
    After a save, `NewAddressForm` follows a `?redirect=` through
    `resolveRedirectFromSearch` (the login's open-redirect guard), so the
    checkout can link to `/account/address/new?redirect=<prefixed /checkout>`;
    without one, or with an unsafe one, it returns to `/account/address`. The
    form's Cancel link always goes to the list.
  - `/account/order`: `readOrder post /order` with `page`, `limit`
    (15 by default), `orderAssociations` from `checkoutApi`, exact total
    count and `createdAt` DESC. Paging is component state, not the URL.
  - `/account/order/details/[id]`: `readOrder` by id with `checkPromotion` in
    the body and in the query. `OrderRoute` reads it only from the query, and
    without it `paymentChangeable` never comes back. An id that is not 32 hex
    characters is not found without a request, and `FRAMEWORK__INVALID_UUID`
    reads as not found too.
    - Changing the payment method: `getPaymentMethods`,
      `orderSetPayment post /order/payment`, then `handleOrderPayment`
      (`ordersApi.ts`, because `checkoutApi`'s `handlePayment` takes no
      timeout), with the success pages as the return URLs. Both calls give
      up after `ORDER_TIMEOUT_MS`, a timed-out change reloads the order, and a
      `pageshow` from the bfcache closes the busy dialog and reloads it.
    - Downloads: `orderDownloadFile get /order/download/{orderId}/{downloadId}`
      and `downloadGet get /document/download/{documentId}/{deepLinkCode}`.
    - Repeat order: `useCart().addProducts(reorderItems(order))`, one
      `addLineItem` request and one recalculation for the whole order instead
      of one per line item. The result goes through `cartNotifications`: one
      toast per distinct message, typed by the error level, then the success
      toast with the cart link whenever the request succeeded. The cart's
      state-error filter applies, so a state error the cart already had (a
      blocked method, a promotion that is not eligible) is not repeated here.
    - Cancelling: the page reads `cart.enableOrderRefunds` on the server
      (`loadShopSettings()` after `connection()`) and passes it down as
      `orderRefundsEnabled`. `isOrderCancellable` also requires the state
      `open`, like the Shopware storefront and the setting's help text,
      although the state machine also cancels `in_progress`.
      `CancelOrderModal` asks first; `cancelOrder post /order/state/cancel`
      with `{ orderId }` uses `ORDER_TIMEOUT_MS`. A ref and the dialog's busy
      state send one request. Afterwards the order is read again, a success
      toast shows and the focus moves to the status badge (`tabIndex={-1}`),
      because the trigger is gone. 403 `CHECKOUT__ORDER_NOT_CANCELLABLE`
      (the shop switched it off) and 400 `SYSTEM__ILLEGAL_STATE_TRANSITION`
      (the order moved on) read `account.messages.orderNotCancellable`,
      close the dialog, hide the button for this view and reload. A timeout
      reloads, since the order may be cancelled; any other error keeps the
      dialog open. Failures log `apiFailureSummary` only. Cancelling an
      order that is already cancelled answers 200 without a change. There
      is no e2e spec: the demo has refunds off, and a cancellation cannot
      be undone.
    - The customer comment shows under the methods
      (`order-customer-comment`, `whitespace-pre-line`, no `lang`), like the
      Storefront's order detail; a blank comment shows nothing.
  - `/account/order/[deepCode]`: `readOrder` with `login: true` and the
    `deepLinkCode` filter, plus `email` and `zipcode` once the guest has
    entered them. Then `refreshSession()`, because `login: true` swaps the
    context token. The page is `noindex`. It offers the same cancellation;
    `CancelOrderRoute` allows guests.
- Keep the e2e ids (`page-objects/{HomePage,MyAccountPage}.ts`,
  `tests/myAccountTests.spec.ts`):
  - `header-my-account-link`.
  - `account-personal-data-firstname-input`,
    `account-personal-data-lastname-input` and
    `account-personal-data-submit-button` on the profile form.
  - `account-personal-data-email-input` on the new-email field of
    `change-email`.
  - `order-total` (exactly one per page), `order-subtotal` and
    `order-shipping`.
  - From the Vue account sources: `order-item-unitprice`,
    `order-item-totalprice`, `order-repeat-button` and
    `checkout-payment-method-{id}`.
  - There is no `my-account-change-profile-button`, because the Vue profile
    page has none. `MyAccountPage.changePersonalData` falls back to
    `goto("/account/profile")`.
  - `order-cancel-button`, `cancel-order-modal`,
    `cancel-order-confirm-button` and `order-customer-comment`.
  - The registration fields of the shop settings:
    `registration-salutation-select` (the `vue-demo-store` id),
    `registration-title-input`, `registration-birthday-{day,month,year}-select`,
    `registration-email-confirmation-input`,
    `registration-password-confirmation-input`,
    `registration-additional-address-line{1,2}-input`, `registration-phone-input`
    and `registration-data-protection-checkbox`. `RegisterForm` in the e2e
    suite fills each one only when it is present, and the company spec skips
    itself when `registration-account-type-select` is absent.
- Tests. There is no injectable customer store, so component tests replace
  `useCustomer` with `vi.mock` and the one contract-shaped fake in
  `customer/fakeCustomer.fixture.ts` (`fakeCustomer.set({ status, customer })`).
  `AccountOverview.dom.test.tsx` and `AccountShell.dom.test.tsx` mount the
  real `CustomerProvider` instead. `accountCustomer()` lives in
  `customer/customer.fixture.ts`, `customerAddress()` and its default
  addresses in `address/address.fixture.ts`; API tests use `fakeClient` from
  `features/checkout/checkout.fixture.ts`.
- Out of scope, or deliberately not ported:
  - The `LineItem{Product,Promotion,Credit,Custom}.vue` cards and their
    `order-item-{promotion,credit,custom}-*` ids. They belong to Vue's
    `order/Details.vue`, which only the checkout success page renders.
  - The Vue `TransitionGroup` animations of the address tiles.

- Customer-group registration
  (`frontend.account.customer-group-registration.page`). Shopware generates
  its SEO URL from the group's registration title, only for storefront-type
  sales channels; there is no technical path, because `TECHNICAL_ROUTE_MAP`
  has no `/customer-group-registration/`.
  `features/account/customerGroup/CustomerGroupRegistrationPage.tsx` reads
  `readCustomerGroupRegistration` (`getCustomerGroupRegistrationInfo get
/customer-group-registration/config/{customerGroupId}`, anonymous GET,
  `cacheLife("seo")` so a registration switched on or off shows within an
  hour) and the countries. A 404 `CUSTOMER_GROUP_REGISTRATION_NOT_FOUND`
  (inactive, or not assigned to this sales channel) becomes `notFound()`,
  which is why the Vue `registrationActive` branch has no counterpart. The h1
  is the translated `registrationTitle`, else the group `name`; the
  introduction is Administration HTML rendered sanitized through
  `renderRichText`, unlike the raw `v-html` in Vue. `RegistrationForm` gets
  `companyOnly` (a business account, the backend does not enforce it) and
  `requestedGroupId`, which
  `toRegistrationInput(values, { settings, requestedGroupId })` adds to the
  register body; the customer stays in the default group until an admin
  approves. Its metadata (title, SEO description, canonical from the
  resolved SEO path) is built by `buildRouteMetadata` like the other routes.
- Registration settings. `RegistrationForm` follows the `loginRegistration`
  shop settings. Both of its pages load them next to the countries with
  `loadRegistrationReferences(locale)`: the settings slice, the salutations
  when `showSalutation` is on (in the locale's language; a failed read
  disables the select with a retry and never blocks the submit) and
  `birthYearMax`, computed on the server so SSR and hydration agree.
  - Enforced by the Store API as well: `passwordMinLength` (0 means required
    only; `REGISTRATION_MIN_LENGTHS.password` stays the fallback);
    `requireDataProtectionCheckbox`, a required checkbox whose tick is sent
    as `acceptedDataProtection`, and `false` without the checkbox, because
    the backend only validates it (the checkout's registration follows the
    same rule, see Checkout); `showBirthdayField` and
    `birthdayFieldRequired`, three selects, all or none and a real date not
    after today, because the backend drops a partial date and rolls an
    impossible one over; `showAdditionalAddressField1/2` and
    `showPhoneNumberField` with their required flags, on the billing
    address; `showAccountTypeSelection`: without it the select hides and the
    form sends `private`, except on a company-only group page.
  - Display only: `showSalutation` and `showTitleField` (max 100). An empty
    salutation gets the backend's default.
  - Storefront-only checks, done in the client here:
    `requireEmailConfirmation` and `requirePasswordConfirmation`; the
    confirmations are never sent.
  - `registrationSchema.ts` takes the settings as a required option and
    must never import `site/shopSettings.ts` (see Store API).
  - Not honored: `addressInputFieldArrangement`, the country's
    `vatIdRequired`, a link to the privacy page (`/shop-settings` has no page
    ids) and a separate shipping address (the Vue starter has none either;
    the checkout's `DifferentShippingAddress` can be reused for it).
- Password recovery. `/account/recover` (`RecoverPasswordForm`) sends
  `sendRecoveryMail post /account/recovery-password` with `email` and
  `storefrontUrl`. `/account/recover/password?hash=` is the path of the
  Shopware default `core.loginRegistration.pwdRecoverUrl`, so a shop that
  changed that setting needs a matching page. Shopware links to
  `<storefrontUrl>/account/recover/password?hash=…`, and `storefrontUrl` must
  equal a sales channel domain without a trailing slash, so
  `recoveryStorefrontUrl` (`features/account/recovery/`) trims it and prefers
  the domain `<devStorefrontUrl or origin>/<locale prefix>` before
  `getStorefrontUrl`: otherwise a German mail links to the English page. A
  sales channel without domains cannot send recovery mails. Registration and
  the newsletter still use `getStorefrontUrl` alone; moving the prefix
  preference into `features/session/storefrontUrl.ts` would fix all three.
  - The answer is 200 whether or not the address belongs to an active
    customer, and the throttle (3 per 30 s per email and IP, 429
    `FRAMEWORK__RATE_LIMIT_EXCEEDED` with `seconds`) runs before the lookup.
    The confirmation therefore says "If the provided email address is
    registered"; never add a branch or a message that tells the two apart.
    Request failures go through `resolveFormFailure` (see Forms): an `/email`
    violation sits on the field, everything else in one persistent
    `role="alert"` paragraph, never a toast.
  - The reset page reads `hash` from `window.location.search` once, in an
    effect, never from `searchParams`, so its shell (h1 plus
    `ResetPasswordSkeleton`) stays static. A hash that is not 32
    alphanumerics is invalid without a request; otherwise
    `getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired`
    (POST only, `READ_TIMEOUT_MS`) runs once per mount behind a ref, so
    StrictMode and a revealed `<Activity>` send one request. The generated
    type nests `isExpired` under `data[]`; the backend answers `{ isExpired }`
    flat. An expired (2 h), used or unknown link shows its message
    (`account.resetPassword.linkExpired`/`linkInvalid`, not `errors.<code>`:
    `CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH` is also the registration
    confirmation's code) with the request form inline; it takes the focus
    only when a submit caused it. A failed check shows `CustomerUnavailable`
    with a retry.
  - `recoveryPassword post /account/recovery-password-confirm` logs nobody in.
    Writing a password revokes every context token of that customer,
    including this tab's when it was logged in as the same customer, so the
    form toasts `account.changePassword.form.successUpdate`, calls
    `refreshSession()` and replaces to
    `/account/login?redirect=<prefixed /account>`. A link works once: a
    second submit gets 410, which is why the form ignores submits while one
    is in flight and after a success. The reset also confirms a pending
    double opt-in.
  - Never show `detail` or log the error object of the reset or the check:
    the mismatch violation (pointer `/newPassword`, `code` null) echoes the
    confirmation password in `detail`, the `Length` violations carry the
    password in `meta.parameters`, the 404 and 410 carry the hash, and
    `ApiClientError.message` concatenates every `detail`.
    `classifyResetFailure` maps codes and pointers to field errors (the
    minimum from `{{ min }}`, the maximum from `{{ max }}`, a null code on
    `/newPassword` is the mismatch) and everything else to
    `errors.message-default`; `logRecoveryFailure` logs only
    `apiFailureSummary`.
  - The client minimum is `REGISTRATION_MIN_LENGTHS.password` (8); a shop
    with a higher `core.loginRegistration.passwordMinLength` is caught by the
    server's `VIOLATION::TOO_SHORT_ERROR` and shown on the field.
    `ResetPasswordPageContent` takes `minLength` for a page that reads the
    shop settings, which would make the page dynamic.
  - `LoginForm` links to `/account/recover` below the password field, also
    in the login modal, where the route change closes the modal like any
    other and resolves `requestLogin()` to `false`.
  - Test ids (no e2e spec; the suite also runs against the Vue starter, which
    has no recovery pages): `login-forgot-password-link`,
    `account-recover-password-form`, `account-recover-password-email-input`,
    `account-recover-password-submit-button`,
    `account-recover-password-success`,
    `account-recover-password-resend-button`,
    `account-recover-password-back-link`, `account-reset-password-skeleton`,
    `account-reset-password-link-error` (`data-reason` expired|invalid),
    `account-reset-password-form`,
    `account-reset-password-new-password-input`,
    `account-reset-password-confirm-password-input`,
    `account-reset-password-submit-button`.

## Wishlist

- `features/wishlist/wishlistStore.ts` (`createWishlistStore`) holds the
  product ids and the count; `WishlistProvider` (mounted by
  `StorefrontProviders` under `CartProvider`) creates it and `useWishlist()`
  binds it. Every wishlist route needs a logged-in customer (403
  `FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN` otherwise), so the store never
  calls the API for a guest. `wishlistSessionKey` is the customer id; a
  new key bumps a generation, so a read or write that settles after a logout
  or a customer switch is dropped.
- The store reads `readCustomerWishlist` with `limit: 100`,
  `includes: { product: ["id"] }` and `"total-count-mode": "exact"`. The
  count is `products.total`; the ids are only for `isInWishlist`, so a
  wishlist above 100 products counts right but shows the heart empty on the
  rest. Without `"exact"`, `total` is only the page size. There is no
  wishlist count anywhere else: the context and the customer have none.
- Backend answers that are not failures (`wishlistApi.ts`): a read 404
  `CHECKOUT__WISHLIST_NOT_FOUND` is an empty wishlist (a customer has no
  wishlist row until the first add); an add 400
  `CHECKOUT__DUPLICATE_WISHLIST_PRODUCT` and a delete 404
  `CHECKOUT__WISHLIST_PRODUCT_NOT_FOUND` or `CHECKOUT__WISHLIST_NOT_FOUND`
  leave the wishlist as wanted, and the store re-reads the ids to correct the
  count. `core.cart.wishlistEnabled` is off on a fresh install; then every
  route answers 403 `CHECKOUT__WISHLIST_IS_NOT_ACTIVATED` and the card shows
  its "cannot be added" toast with that reason.
- The read response is typed as a `ProductListingResult`, but the backend
  sends a plain entity search result: only `elements`, `total`, `page` and
  `limit` exist. Only `sw-include-search-info` and `sw-language-id` are
  allowed as headers, so the page asks for `associations: { seoUrls: {} }`
  in the body. The read is POST: the backend accepts GET too, but the route
  is personal and not HTTP-cacheable, and the spec documents only POST.
- `toggleWishlist` decides from what the card showed (`!isInWishlist(id)`
  at click time) whether to add or remove, so a click before the ids loaded
  still adds. It first awaits `retrySession()`, because the e2e suite clicks
  the toggle right after a page load and a loading session must not count as
  logged out. A guest gets the login modal (`LoginModal.tsx`,
  `useRequestLogin()`); after a login the port syncs the store with the new
  session and adds the product, so the read of the server ids runs first. A
  closed modal (close button, Escape, the backdrop or any route change)
  resolves `{ ok: false, cancelled: true }`, which the card ignores. The Vue
  starter toggles after the modal login instead, against ids it never read,
  and gets a 400 for a product already on the wishlist.
- `/wishlist` (`WishlistPageContent`) renders in the browser only: a skeleton
  while the session loads, the logged-out links (`/account/login?redirect=`
  with the prefixed `/wishlist`, the same with `#registration`, and `/`)
  for a guest, and otherwise the pages of `readWishlistPage` through
  `usePagedList`. `features/paging/` holds what the order list and the
  wishlist share: `usePagedList`, `Pagination`, `PageSizeSelector`,
  `scrollToList` and the page sizes 1/15/30/45 (page and size are not in the
  URL); the dialog both modals use is `components/Modal.tsx`. Removing a
  tile deletes through the store, announces it in a toast, moves focus to
  the page heading and reads the page again; `wishlist-empty-container`
  shows once `total` is 0. The e2e ids are
  `wishlist-product-box`, `wishlist-product-box-toggle-button`,
  `wishlist-add-to-cart-button` and `wishlist-empty-container`; skeleton
  tiles carry none, because the specs count `wishlist-product-box`.
- `WishlistProducts` is keyed by the customer id and the context currency
  id, so a currency switch reads the page again, from page 1, instead of
  showing the old amounts with the new currency symbol.
- Not ported: the Vue `useLocalWishlist` and the merge on login. The Vue
  starter never fills the local list (its card opens the login modal for
  guests too), so it stays empty and the merge only re-reads.

## Reviews

- The server render stays anonymous: the CMS slot's approved reviews are the
  first render. `getCustomerState()` on the CMS port
  (`features/storefront/cmsCustomerState.ts`, the same mapping as
  `wishlistSessionKey`) is `loading` until the first `/context` read, so the
  form and the login hint render only after hydration.
- A logged-in customer's list is read in the browser, lazily: the first time
  the reviews tab opens, and again after a successful submit
  (`features/reviews/productReviewsApi.ts`, `readProductReviewsGet` with
  `_criteria`, `createdAt DESC`, no `limit`, so `core.listing.reviewsPerPage`
  applies). The route also returns the customer's own pending review
  (`status: false`), which shows "not approved yet". Guests never read.
- The read uses `parentId ?? id`, like the CMS resolver; the review is saved
  under `product.id`, like Vue. The header counts the loaded list.
- `submitProductReview` never toasts and never rejects: the form shows
  `violations` inline. `FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN` opens the
  login modal before the session is refreshed, because a refresh turns the
  form into the login hint and drops the typed review. If the same customer
  logs back in, the form stays and the review is saved once more; another
  customer gets `{ ok: false }` and nothing is saved under their account; a
  cancelled login refreshes the session and returns the violation.
- Known risk: the backend HTTP cache key ignores `sw-context-token`, so under
  `CACHE_REWORK` a logged-in GET can get the anonymous list. The fallback is
  POST for this read only.

## Search

- The header search is `features/search/components/HeaderSearch.tsx`: a
  `<search>` landmark around a `<form method="get">` whose `action` is the
  locale-prefixed `/search`, so Enter works before hydration as a plain GET;
  after it, `onSubmit` pushes `localePath(searchPath(term))` (a soft
  navigation). It is `<search>`, not `<form role="search">`, because oxlint's
  `jsx-a11y/prefer-tag-over-role` rejects the role, and
  `no-noninteractive-element-interactions` rejects key and focus handlers on
  the form. Escape, the arrow keys, `focusout` and the outside `mousedown`
  are therefore native listeners on the `<search>` element and the document,
  attached only while the box is open. happy-dom has no `search` element, so
  React logs "The tag <search> is unrecognized" once per DOM test file that
  mounts the header; that is expected. Keep it a single-field form without a
  submit button: Enter submits implicitly, and a second `aria-label="Search"`
  button would be found before the mobile toggle in `HeaderBar` tests.
- `HeaderBar` owns the text, so the desktop and the mobile field share it like
  the Vue `Header.vue` `searchText`. Until the customer types, the text is the
  `search` parameter of the current URL on `/search` (`useSearchPageTerm`:
  `useSyncExternalStore` over `window.location`, `""` on the server and
  during hydration). Never use `useSearchParams()` here: it would suspend the
  shop layout under `[...path]`. A `useEffect` that sets the text fails
  oxlint's `react/set-state-in-effect`.
- Suggestions run in the browser through `useShopwareClient()`, like the Vue
  `layout/header/Search.vue`. `readSearchSuggest`
  (`features/search/searchSuggestApi.ts`, `searchSuggestGet get
/search-suggest`) sends `search`, `limit=10` and `no-aggregations` as plain
  query parameters, plus `sw-include-seo-urls` (the GET type lacks it,
  Shopware's CORS allows it) and `READ_TIMEOUT_MS`. `search` must stay a
  plain parameter: `ResolvedCriteriaProductSuggestRoute` checks it before the
  listing processor that unpacks `_criteria` runs, so a term only inside
  `_criteria` answers 400. A route handler would put every visitor behind the
  Next server's IP, which the demo backend rate-limits per IP. Known risk:
  under `CACHE_REWORK` the Store API cache key ignores `sw-context-token`, so
  a customer with group prices can see anonymous prices in the suggestions,
  the same risk as Reviews. The fallback is POST for this call only.
- `useSearchSuggest` asks 300 ms after the last input, or at once on focus,
  and only for a normalized term of at least `SEARCH_MIN_LENGTH` (3, the Vue
  and Shopware storefront minimum). Enter below that does nothing, while a
  direct `/search?search=x` URL is not gated. A term that already has an
  answer is not asked again; a failed one is retried on the next input or
  focus. A new term aborts the request in flight and bumps a sequence id, so
  an overtaken answer is dropped; nothing is cancelled in an effect cleanup.
  While the next term loads, the box keeps the last suggestions as an `inert`
  list, so neither ArrowDown nor Tab can focus a link the answer then
  unmounts, which would drop the focus to `<body>`. A failed
  read is logged (`[Search] reading the suggestions failed`) and shows
  `search.suggest.unavailable` in the box, never a toast.
- `SearchSuggestBox` renders only after input, so it may call `usePathname()`
  to close on a route change. It opens as soon as the term is long enough,
  before the answer arrives, because `HomePage.typeSearchPhrase` waits for
  `layout-search-result-box` and then presses Enter. It closes on:
  - Escape: focus goes back to the input and the default is prevented, so
    only a second Escape lets the browser clear the field;
  - an outside `mousedown`;
  - focus moving to a control outside the search (a `null` `relatedTarget`
    does not close it);
  - a followed link, a route change or a submit.
- ArrowDown moves from the input into the suggestion links and ArrowUp from
  the first link back, as in the Shopware storefront. The input stays a
  searchbox: it has `aria-controls` while the box is open and no
  `aria-expanded` (not allowed on a searchbox). A persistent `<output>`
  announces `search.suggest.status` (the pluralized count),
  `search.noResults` or the failure. Suggestion and "see all" links use
  `prefetch={false}`, because each visible link would otherwise run the
  proxy's SEO lookup on every answer. Suggestion prices are in the session
  currency (`Price`), unlike the `/search` grid (see the known divergence
  under Layout).
- Keep the Vue test ids: `header-search-input`, `layout-search-result-box`,
  `layout-search-suggest-link`, `layout-search-suggest-image`,
  `layout-search-suggest-name`, `layout-search-suggest-price`,
  `layout-search-suggest-units`, `layout-search-result-box-more-link`,
  `layout-search-result-box-no-result`, `search-results-container`.
- `/search` is `app/[locale]/(shop)/search/page.tsx`. `search` is in
  `APP_ROUTE_SEGMENTS`, so the proxy skips the SEO lookup. The page awaits
  `searchParams` inside `<Suspense>` (`PageSkeleton`), and `SearchResults`
  reads `readProductSearch(term, query, categoryIds, languageId)`
  (`platform/shopware/reads/productSearch.ts`, `searchPageGet get /search`,
  `cacheLife("listing")`, tag `sw:search`).
  - The listing parameters (`search`, `p`, `limit`, `order`, `manufacturer`,
    `properties`, `min-price`, `max-price`, `rating`, `shipping-free`) are
    plain query parameters, as in `readProductListing`.
  - Only criteria fields go into `_criteria`: `getCategoryFilterAggregations()`
    and, for `categories=`, `getCategoryFilterPostFilter`.
    `buildSearchListingQuery` drops category ids that are not 32 hex
    characters.
  - Never move `limit` into `_criteria`: `ResolvedCriteriaProductSearchRoute`
    resets the criteria limit and `PagingListingProcessor` reads `limit` only
    from the request, so the page size would silently fall back to
    `core.listing.productsPerPage`.
- No fixed defaults: without `order` the backend sorts by
  `core.listing.defaultSearchResultSorting` (`score` on a default install),
  and without `limit` it uses `core.listing.productsPerPage`. The Vue page
  sends `name-asc` and 15.
- `normalizeSearchTerm` (`features/search/searchTerm.ts`) takes the first
  value, trims it, collapses inner whitespace and cuts it to 300 code points,
  the backend's `term_max_length`. It feeds the read, the heading and the
  title, so spellings that search the same share one cache entry. A blank
  term renders `search.emptyTerm` without a request: the backend would list
  every product, or answer 400 for whitespace. A page past the last one is a
  404 `PRODUCT__LISTING_PAGE_OUT_OF_RANGE` and goes through `notFoundOn404`.
- The page composes package parts outside a CMS page:
  - `SwProductListingFilters` and `CmsElementProductListingResults`, both with
    `isProductSearch`, which keeps `search` and `categories` in the URL on
    every filter, sort and page change;
  - `getClientListingFilters` for their filters;
  - `SwProductCard` with a `createStorefrontCmsContext({ isProductSearch: true })`
    context.
- The filter rail comes first, as on category pages, not below the results
  on phones as in Vue. Without a result the page shows only the heading, plus
  the rail while a filter is active (Vue always shows the rail).
- Metadata: the title is `search.metaTitle` with the term, or
  `breadcrumbs.search` without one. Robots are `PRIVATE_PAGE_ROBOTS`
  (`noindex, follow`, like Shopware's `SearchPageLoader`). There is no
  canonical and no JSON-LD trail (`siteUrl={null}`). There is no cache-header
  rule: the page is anonymous and stays `private` like the catalog.
- Tests: the package resolves its own `next` (another pnpm peer variant), so
  `vi.mock("next/navigation")` in a template test does not reach package
  islands that call `useListingNavigation`. `SearchResults.test.tsx`
  therefore stubs `SwProductListingFilters` and
  `CmsElementProductListingResults` through `vi.mock` of the package entries
  with `importOriginal`, and asserts their props.
- e2e:
  - `search.spec.ts` relies on `search-results-container`, which only
    `/search` renders.
  - The limit and pagination test of `checkSearch.spec.ts` counts
    `product-box-img` cards: after the soft navigation from `/`, the home page
    stays hidden in `<Activity>` with its cards, so the page objects count
    visible elements only.
  - The manufacturer, property and sorting tests wait for a browser
    `/store-api/search` response (`listingRequested` in
    `apps/e2e-tests/utils/listing.ts`) that a server-rendered listing never
    sends. This is the same gap as the category listing.
- Not ported: the Shopware storefront's redirect of a single hit whose
  product number, EAN or manufacturer number equals the term.

## Variants

- `findVariant` on the CMS port is `findProductVariant(getClient, input)` in
  `features/variants/variantApi.ts`; the buy box's
  `SwVariantConfiguratorOptions` (`@shopware/cms-base-layer-react`) owns the
  navigation and the messages. It never toasts and never rejects:
  `{ ok: true, variant }` (`productId`, plus `url` when the SEO read gave a
  safe path), `{ ok: false, notFound: true }`, `{ ok: false, cancelled: true }`
  (the island's signal aborted) or `{ ok: false }` (logged as
  `[Variants] finding the variant failed`).
- Two browser GETs through the session client, with `READ_TIMEOUT_MS` and the
  island's abort signal: `searchProductVariantIdsGet get
/product/{productId}/find-variant` under the parent (`parentId ?? productId`)
  with `options[<groupId>]=<optionId>` in configurator group order plus
  `switchedGroup`, then `readSeoUrlGet get /seo-url` with
  `variantSeoUrlCriteria` (`routeName` `frontend.detail.page`, `foreignKey`,
  `limit 1`; the Store API adds the context language and `isCanonical`).
  Shopware falls back by unsetting options whose key is not `switchedGroup`
  (`FindProductVariantRoute`), so the keys must be group ids: the list form,
  the only one the generated GET type knows, drops options in list order,
  sometimes the one just picked. `findVariantQuery` is the one local cast.
  The route also applies the closeout filter of the detail page, which a
  `/product` search (the Vue `useProductConfigurator`) does not.
- The answer is the flat `FoundCombination` (`variantId`, `options`), not
  the `foundCombination` wrapper of the generated type; both are read, and an
  answer with neither is a failure. 404 `CONTENT__PRODUCT_VARIANT_NOT_FOUND`
  is a miss, not a failure. An empty selection never reaches the backend,
  which would answer any variant.
- A failed or empty SEO read still returns the variant without `url` (only
  the failure is logged); the island then opens `/detail/<id>` and the proxy
  answers the 301. A `seoPathInfo` with a backslash or a control character
  (`hasUnsafePathChar`) is never used, because `/\host` resolves off the
  origin.
- The island navigates with `router.replace(…, { scroll: false })`, like the
  Shopware storefront's `location.replace`: Back leaves the product, not
  every variant tried, and the buy box stays in view. Next keeps the
  previous product page mounted in a hidden `<Activity>`, because the
  browser segment key includes the path, so every variant mounts fresh
  islands (quantity, gallery slide, tabs). Up to three pages stay in the
  DOM, which is why e2e page objects scope test ids to visible elements.
- e2e: `checkProductVariants.spec.ts` clicks `product-variant` labels until
  the URL changes, waits for `loading` to disappear and compares the
  `data-product-id` of the visible `add-to-cart-button` with the mini cart's
  `checkout-product-tile-item`. A miss shows up as `store-api-404` in the
  e2e diagnostics and is expected.

## Forms

- The CMS `form` element (contact and newsletter) and the footer
  `NewsletterBox` reach the Store API through `submitContactForm` and
  `subscribeNewsletter` of the CMS actions port. `StorefrontProviders`
  spreads `createFormActions({ getClient, getSession: retrySession, t })`
  (`features/forms/formActions.ts`) into the port. The calls run in the
  browser on the session client, so the mail language follows the session's
  `sw-language-id` and the backend's per-IP form rate limits (contact form
  3 per 30 s) count the shopper, not the Next server.
- Contact: `sendContactMail post /contact-form` (`formsApi.ts`) with the form
  values plus `navigationId` (the page's `foreignKey`), `entityName`
  (`category`, `product` or `landing_page`, from the route name) and `slotId`
  (the element id). Keys the form left out are dropped and `cmsPageType` is
  never sent; the route does not read it. Without `slotId` the backend
  ignores the element's `mailReceiver` and confirmation text and mails
  `core.basicInformation.email`. The backend requires `salutationId`
  (`NotBlank` and `EntityExists`) although the schema marks it optional, so
  the form requires a salutation whenever the slot lists any. The answer is
  `{ individualSuccessMessage }`, typed `never`, which `formsApi.ts` reads
  with a local type; the form shows it, else a non-empty `confirmationText`,
  else `form.messages.contactFormSuccess`. A 200 only means the event fired:
  the mail is sent by the "Contact form sent" flow.
- Newsletter: `subscribeToNewsletter post /newsletter/subscribe` through
  `profileApi.subscribeNewsletter` (shared with the account page) with
  `option: "subscribe"` and the `storefrontUrl` of
  `resolveNewsletterStorefrontUrl` for the context `retrySession()` resolves
  (the backend rejects a URL that is not a sales channel domain unless
  `core.newsletter.doubleOptInDomain` is set). Salutation, first and last
  name are sent only when filled; an empty `salutationId` would hit the
  foreign key. Unsubscribing is `unsubscribeToNewsletter post
/newsletter/unsubscribe`; its 400 `CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND`
  (whose detail echoes the address) counts as success, so the form never
  tells whether an address is on the list.
- The subscribe answer's `status` picks the copy: `notSet` means a double
  opt-in mail went out (the default for guests; for a logged-in customer only
  with `core.newsletter.doubleOptInRegistered` or another address) and shows
  `form.messages.newsletterConfirmationSent` in the CMS form and the footer
  toast; any other status keeps the Vue copy, and an unsubscribe shows
  `form.messages.newsletterUnsubscribed`. A confirmed address answers its
  status again without a mail. The mail links to
  `<storefrontUrl>/newsletter-subscribe` (see Email links).
- The form actions never reject and never toast. A failure resolves
  `{ ok: false, message, violations }` from `resolveFormFailure`
  (`features/forms/formViolations.ts`): each Store API error becomes a
  `CmsFormViolation` whose `field` is the `source.pointer` without its slash
  (a nested pointer gives none). Blank, e-mail format (on `email` only), a
  link in a name and an unknown salutation or option get field-sized
  messages (`validations.*`, `forms.errors.*`); a 429
  `FRAMEWORK__RATE_LIMIT_EXCEEDED` becomes `errors.rateLimitExceeded` with
  its `seconds`; a rejected `storefrontUrl` becomes `errors.message-default`
  (a domain misconfiguration); a 5xx, a non-API error and a client that
  cannot be created give `errors.message-default` without violations, so no
  backend detail reaches the shopper; everything else goes through
  `resolveApiErrorMessages`. `message` is the first violation without a
  field, else the first one. `logFormFailure` logs every failure except a
  400 or a 429, plus a rejected `storefrontUrl`, with `apiFailureSummary`
  only (status and codes, or the error name), never the error: violations
  echo what the shopper typed. The CMS forms show field violations inline and
  the rest in their `cms-form-error` alert; the footer box shows an `email`
  violation under its input and toasts every other message once.
- Focus: a client or server field error focuses the first `aria-invalid`
  control (the footer box: its input). After a success or a failure without
  a field error the submit button gets the focus back only when it was lost,
  because the button is `disabled` while the request runs.
- Test ids (no e2e spec uses them yet): `cms-contact-form`,
  `cms-contact-form-submit`, `cms-newsletter-form`,
  `cms-newsletter-form-submit`, `cms-form-error`, `cms-form-success`,
  `footer-newsletter-form`, `footer-newsletter-email-input`,
  `footer-newsletter-submit-button`. Never point an e2e spec at the shared
  demo for these forms: it creates recipients, sends mails and spends the
  rate limits.

## Email links

- Shopware mails two double opt-in links: `/registration/confirm?em=…&hash=…`
  (`core.loginRegistration.confirmationUrl`, also used for guest orders) and
  `/newsletter-subscribe?em=…&hash=…` (`core.newsletter.subscribeUrl`). The
  host is the `storefrontUrl` the register or subscribe call sent, so it can
  carry `/pl-PL` or `/de-DE`. A resent registration mail (a login attempt
  after `doubleOptInResendInterval` hours) uses
  `core.loginRegistration.doubleOptInDomain` or a sales channel domain
  instead. The merchant must make this storefront's origin, with its locale
  prefixes, a sales channel domain and set `doubleOptInDomain` to it.
- The pages are `app/[locale]/(shop)/registration/confirm` and
  `app/[locale]/(shop)/newsletter-subscribe`: fully static pages whose client
  islands live in `features/emailLinks/`. They are `noindex, nofollow`
  (`EMAIL_LINK_ROBOTS`) and in `PERSONAL_AREAS`.
- The islands read `em` and `hash` from `window.location.search` once, in
  the mount effect, never with `useSearchParams()` or the page's
  `searchParams`: nothing suspends, so no `<Suspense>` is needed and the
  island and its live region stay in the static shell. The link is kept in a
  ref, so a hidden page whose URL `router.replace` changed does not turn into
  "invalid link". `redirectTo`, `redirectParameters` and `forwardTo` are
  ignored.
- Each link is confirmed once per document. A second call fails (412
  `CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED`, or the newsletter's 400 `/status`
  violation), so `useEmailLinkConfirmation` runs the call through
  `confirmOnce` (`registrationConfirmations`, `newsletterConfirmations`,
  keyed by hash). It shares one promise with StrictMode's second effect,
  replays a final result to a remount, and forgets `failed` so "Try again"
  sends a new request. A ref marks the settled attempt, so revealing a hidden
  `<Activity>` sends no call. No answer is dropped in an effect cleanup.
- Registration: `useSessionActions().confirmRegistration({ em, hash })` posts
  `registerConfirm post /account/register-confirm`. On success Shopware
  replaces the context token, logs the customer in (as a guest for a guest
  order) and moves the old token's cart to the new one. The action re-reads
  `/context` like `login`, and the cart and the wishlist follow from their
  session keys. The island waits until `useCart().status` is no longer
  `"loading"`: a GET sent with the old token that answers after the confirm
  echoes that token, the api-client re-adopts it and the customer is logged
  out (the currency read can still overlap; the fix belongs in
  `@shopware/api-client`). A customer then goes to `/` with
  `account.messages.loggedInSuccess`, a guest to `/checkout` with
  `account.registrationConfirm.guestConfirmed`, both with `router.replace`
  and once per mount.
- Newsletter: `confirmNewsletter(getClient, link)` posts
  `confirmNewsletter post /newsletter/confirm` through `useShopwareClient()`
  and does not touch the session. A 400 `/status` violation whose value is
  `optIn` or `direct` means the link was already used (`alreadyConfirmed`,
  info tone); any other value (`optOut`, `undefined`) is an invalid link.
- Outcomes: `confirmed`, `alreadyConfirmed`, `invalidLink` (no params,
  `CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND`, an `/em` violation, any other
  400 or 404) and `failed` (no response, timeout, 5xx, no client; with "Try
  again"). Never show the backend `detail` and never log the error object:
  `CHECKOUT__CUSTOMER_NOT_FOUND_BY_HASH` and
  `CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND` carry the hash in `detail`. Only
  `failed` is logged, as `apiFailureSummary` (status and codes).
- A11y: the `<h1>` (`tabIndex={-1}`) and the `<output aria-live="polite">`
  are in the server HTML, and only the region's content changes. Actions sit
  outside the region. The first result never moves the focus. When a retry
  ends without the Retry button and the focus fell to `<body>`, the `<h1>`
  takes it. A running retry is `aria-busy`/`aria-disabled`, ignores clicks
  and puts the pending message back in the region, so a retry that fails
  again still changes the announced text.
- Test ids: `registration-confirm-page`, `newsletter-confirm-page`,
  `email-link-status` (`data-state` pending|success|info|error),
  `email-link-retry-button`, `email-link-login-link`, `email-link-home-link`.
  There is no e2e spec: the suite also runs against the Vue starter, whose
  pages toast and redirect instead. The DOM tests render the island inside
  React's `<Activity mode>` to prove that hiding and revealing repeats
  neither the call nor the toast.
