# react-starter-template

Next.js App Router storefront template for Shopware 6, the React counterpart of
`vue-starter-template`. State: anonymous Store API reads, SEO URL routing, CMS
rendering, the header/footer layout, a browser session with login,
registration and logout, the cart, the checkout with the order confirmation,
the customer account area (`/account/**`), the wishlist and the three UI
locales of the Vue starter (`en-GB`, `/pl-PL/…`, `/de-DE/…`) work; search, variant switching, the contact form and the
newsletter are stubs; product reviews are wired (see Reviews).
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
  there imports `server-only` except `publicConfig.ts`,
  `reads/countryOptions.ts`, `reads/languageOptions.ts` and
  `reads/cacheTags.ts`. The one browser
  client is `features/session/browserClient.ts` (see Session and actions).
  The config is read on the server at request time (`getShopwareConfig`:
  `SHOPWARE_ENDPOINT`, `SHOPWARE_ACCESS_TOKEN`, `SHOPWARE_PUBLIC_ENDPOINT`,
  `SHOPWARE_DEV_STOREFRONT_URL`) and falls back to the public demo backend,
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
  request for that key until undici gives up. It covers the wait for
  response headers only, and `readCountries` can take up to ten timeouts.
- The server sends `{ ...public, ...private }` headers (`SHOPWARE_API_HEADERS`
  wins per name) under its own `sw-language-id`. Names are trimmed and
  lowercased, because `createHeaders` and `defu` are case-sensitive and would
  send both spellings. Dropped with a warning: every `sw-*` name (it would
  replace the access key or the context token, or change a `'use cache'`
  response outside its key), `accept`, `content-type`, the transport headers
  undici consumes or throws on, invalid names and values, and, in the public
  variable only, browser-forbidden names (`isBrowserForbiddenHeader`). Bad
  input never throws, because a throw in the proxy or a read fails every
  request. Warnings go out once per message and never print a value.
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
  `app/api/**`, `app/globals.css` and `app/favicon.ico` stay outside. The
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
- `/`, `/account/**`, `/checkout/**` and `/wishlist` (`APP_ROUTE_SEGMENTS` in
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
  `category-navigation` slot (`hasCmsElement` in `platform/cms/cmsElements.ts`),
  otherwise it gives `undefined` without a request. Category pages read the
  current category's children (a leaf category shows no sidebar, like Vue).
  The home, landing and product pages read
  `readNavigation("main-navigation", 2, languageId)`, the Header's cache entry
  and tags, so they add no Store API call; keep the alias and the depth in
  step with the Header. A failed read logs and renders the page without the
  sidebar, while `readNavigation` itself still throws, so the failure is not
  cached. Landing and product pages get no active path.
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
- `PERSONAL_AREAS` (`account`, `checkout`, `wishlist`, unprefixed and under
  `/pl-PL` and `/de-DE`) get `Surrogate-Control: no-store` and
  `Cache-Control` set to `PERSONAL_CACHE_CONTROL`
  (`private, no-cache, no-store, max-age=0, must-revalidate`).
  `/<area>/:path*` also matches the bare path and a trailing slash, not
  `/accountancy`. Without them `next start` sends `s-maxage=31536000` for the
  fully static `/checkout/cart`. `/en-GB/*` is left out because the proxy
  308-redirects it.
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
  is a `LocaleLink` to `/wishlist` (see Wishlist). The search input only
  calls `notify()` with the message keys in
  `features/storefront/notWired.ts` (`layout.notWired.*`); the newsletter form
  goes through `subscribeNewsletter` of the actions port, so wiring it later
  needs no form change.
- UI copy comes from the messages (see Internationalization). Layout,
  navigation, search and form-control keys the Vue files lack live in
  `i18n/<locale>/react/layout.json`; `layout.logo` is the brand name and
  stays the same in every locale. Active-link
  checks compare paths without the locale prefix (`pagePath` in
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
  the 404 page. It skips `/api`, `/_next`
  and static files, a closed list of asset extensions (`STATIC_FILE`, kept
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
  `i18n/<locale>/react/{core,layout,account,checkout}.json` deep-merged
  over them for keys only this template has, then everything over `en-GB`
  so a missing key falls back (`i18n/messages.ts`). Edit the Vue files only
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
  as in the Vue layer, and stays English.
- Adding a key: reuse a Vue key when one fits (`grep` `i18n/en-GB/*.json`).
  Otherwise add it, in the same nested style, to the `react` file of its
  area in all three locales with real English, Polish and German text:
  `core` (CMS, metadata, shared API errors), `layout` (header, footer,
  navigation, search, form controls), `account`, `checkout` (cart and
  checkout). Reference it with a literal key. `i18n/keys.test.ts` parses
  every non-test source file and fails for a literal key without an `en-GB`
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
  `website` because Next has no `product` type). Absolute URLs need
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
- Account, checkout, cart, wishlist, login and the order success pages are
  `noindex, follow` (`PRIVATE_PAGE_ROBOTS`), like the Shopware storefront.
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
  browser-forbidden filter, and `createBrowserClient` passes `config.headers`
  as `defaultHeaders`. Shopware's CORS preflight allows only `Content-Type`,
  `Authorization` and the core `sw-*` headers, so a custom header there
  blocks every browser call until a `CorsHeaderProviderInterface` service or
  an edge allows it. There is no browser timeout variable on purpose: a
  client-wide default would put a timeout on the login, register and cart
  mutations.
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
- Login, registration and logout go through the session actions port
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
  resolves to `errors.message-default`.
- `StorefrontProviders` is also the app side of the CMS actions port
  (`CmsActionsProvider`). `addToCart` goes to the cart (see Cart),
  `toggleWishlist` and `isInWishlist` to the wishlist (see Wishlist),
  `getCustomerState`, `loadProductReviews` and `submitProductReview` to the
  reviews (see Reviews); variant lookup, the contact form and the newsletter
  are still stubs there that show a "not connected" notification
  (`features/storefront/notWired.ts`) and return `{ ok: false }`. Wire them
  there, not in the CMS components.
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
  `price.positionPrice`, `totalPrice` is `price.totalPrice` and
  `shippingCosts` is `deliveries`. Its action functions keep their identity
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
  own: call `refresh()` after it, as the checkout does. Between a currency
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
- All cart operations run one after another in request order. A request
  counter like the session store's is not enough here: two cart writes on one
  context token in flight at once can lose an update in Shopware, and a read
  started by a session change would win over an add-to-cart answer that
  arrived first. A `refresh()` still queued behind the same operation is
  joined instead of sent twice. Cart mutations have no timeout (only
  `createOrder` has one, see Checkout), so a hung one holds the queue until
  the browser gives up.
- The actions never reject and never notify. Success resolves
  `{ ok: true, errors }`, where `errors` are the cart errors as
  `CmsActionError`s (`cartErrors.ts`: `getErrorsCodes` of
  `useCartNotification`, keyed map only and without
  `promotion-discount-added`, then `resolveCartError` of
  `useCartErrorParamsResolver`: `product-stock-reached` gets `name` and
  `quantity` from the line item's label and `maxPurchase`, or becomes
  `product-stock-reached-empty` without them; `shipping-method-blocked` gets
  `name`; anything else carries all its fields as params). A failure
  resolves `{ ok: false, message }` with the first `resolveApiErrorMessages`
  message, resolved with the translator `CartProvider` hands the store
  (`setTranslate` keeps it current). The caller decides what to show; the
  `messageKey`s are the `errors.<key>` messages.
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
  (`app/[locale]/(checkout)/checkout/cart/page.tsx`). Nothing re-reads the cart on
  that page on its own, so a failed first read shows the error with a
  "Try again" button that calls `refresh()`; the store keeps status
  `"error"` during that re-read, so the button holds its own pending state
  (`disabled`, `aria-busy`). Both and the checkout
  `SummaryBox` go through `useLineItemActions`, which notifies every cart
  error (`errors.<messageKey>`, else `params.message`) and the failure
  message only when there are no cart errors, the order
  `SwProductAddToCartForm` uses.
- Keep the e2e ids (`page-objects/{CartPage,ProductPage}.ts`,
  `tests/addToCart.spec.ts`): `header-mini-cart-button`,
  `mini-cart-container`, `mini-cart-close-button`, `checkout-cart-link`,
  `checkout-product-tile-item`, `checkout-product-tile-image`,
  `checkout-product-tile-remove-button`, `cart-product-options`.
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
  `layouts/checkout.vue`). It awaits `connection()` and
  `loadCountryOptions(locale, "Checkout")`
  (`platform/shopware/loadCountryOptions.ts`, shared with the login page's
  registration: the countries in the locale's Shopware language, or a
  logged `countriesUnavailable`) inside `<Suspense>` (`CheckoutSkeleton`)
  and hands the countries to
  `features/checkout/components/CheckoutPageContent.tsx`; a failed country
  read shows the country field's error with a retry, as on the login page.
  The success pages sit in the shop layout under
  `app/[locale]/(shop)/checkout/success/[id]/` (the Vue default layout); the static
  `checkout` segment wins over `app/[locale]/(shop)/[...path]`.
- Every checkout call runs in the browser through `useShopwareClient()`.
  The order belongs to the customer's context token, which only the browser
  client holds; doing it on the server would need `cookies()` and a second
  client that misses the tokens the session client adopts. The only server
  read is the anonymous, cached country list.
- `features/checkout/checkoutApi.ts` holds the calls as pure functions over
  `Pick<ApiClient, "invoke">`: `getShippingMethods`
  (`readShippingMethodGet get /shipping-method`, `onlyAvailable` plus
  `_criteria` with `prices`, sorted by `position`) and `getPaymentMethods`
  (`readPaymentMethodGet get /payment-method`, `onlyAvailable`), both with
  the query type widened locally because the GET types lack `onlyAvailable`
  (the backend reads it from the query too); `setShippingMethod` and
  `setPaymentMethod` (`updateContext patch /context`); `createOrder`;
  `updateCustomerDetails`; `readOrder` (`readOrder post /order` with
  `checkPromotion` and `orderAssociations`, the `useDefaultOrderAssociations`
  set plus the address countries and `currency`); `handlePayment`
  (`handlePaymentMethod post /handle-payment`). `updateCustomerDetails` sends
  every field of the existing default billing address with the patch,
  because the upsert route nulls the ones left out, then `changeProfile`.
- `CheckoutPageContent` shows `CheckoutSkeleton` until the session and the
  first cart read settle, then the empty cart state or the three steps. A
  session that could not be read at all (status `"error"`, no `context`) and
  a failed first cart read each show an alert with a "Try again" button
  (`retrySession()`, `cart.refresh()`) instead of the steps, because an
  unknown session would otherwise show the guest form to a logged-in
  customer; an order in flight keeps the steps mounted. The
  selected methods are the session context's `shippingMethod` and
  `paymentMethod`, overridden only while a change is in flight; a change
  patches the context, then calls `refreshSession()` and `cart.refresh()`
  (the token stays, so the cart store does not re-read on its own). Place
  order validates with `checkoutSchema.ts` (the `useTemplateCheckout` rules)
  and focuses the first invalid field. Without a user session it registers
  through `useSessionActions().register` with `guest: !createAccount`; the
  action shows its own errors, so a `{ ok: false }` just stops, and a double
  opt-in shows the sign-up message and stops. A session that registered
  during this checkout updates the customer details on the next attempt
  instead of registering again, then refreshes the session and the cart, so
  the summary shows the totals of the new address; a customer who arrived
  logged in or as a guest skips the form and sees the default billing
  address. If a registration succeeded but the session still has no
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
- Keep the e2e ids (`page-objects/CheckoutPage.ts`, `tests/createOrder.spec.ts`):
  `checkout-pi-email-input`, `checkout-pi-password-input`,
  `checkout-create-account-toggle`, `checkout-pi-first-name-input`,
  `checkout-pi-last-name-input`, `checkout-pi-street-address-input`,
  `checkout-pi-zip-code-input`, `checkout-pi-city-input`, `country-select`,
  `checkout-pi-state-input`, `checkout-shipping-method` (one per row, around a
  native `name="shipping-method"` radio), `checkout-place-order-button`,
  `cart-subtotal`, `cart-total`, `checkout-success-page`, `order-subtotal`,
  `order-shipping`, `order-total`.
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
  a URL segment. `/account/login` and the deep-link order page
  `app/[locale]/(shop)/account/order/[deepCode]/page.tsx` stay outside it and public,
  like the Vue `[deepCode].vue`, which does not use the account layout. No URL
  resolves in both: the static `details` segment wins over `[deepCode]`.
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
  `readCountries` and `readSalutations` (`platform/shopware/reads/salutations.ts`,
  `readSalutationGet get /salutation`, `cacheLife("reference")`). The
  `server-only` loaders `features/account/{profile/profileReferences,address/addressReferences}.ts`
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
    - Repeat order: `useCart().addProduct`.
  - `/account/order/[deepCode]`: `readOrder` with `login: true` and the
    `deepLinkCode` filter, plus `email` and `zipcode` once the guest has
    entered them. Then `refreshSession()`, because `login: true` swaps the
    context token. The page is `noindex`.
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
- Tests. There is no injectable customer store, so component tests replace
  `useCustomer` with `vi.mock` and the one contract-shaped fake in
  `customer/fakeCustomer.fixture.ts` (`fakeCustomer.set({ status, customer })`).
  `AccountOverview.dom.test.tsx` and `AccountShell.dom.test.tsx` mount the
  real `CustomerProvider` instead. `accountCustomer()` lives in
  `customer/customer.fixture.ts`, `customerAddress()` and its default
  addresses in `address/address.fixture.ts`; API tests use `fakeClient` from
  `features/checkout/checkout.fixture.ts`.
- Out of scope, or deliberately not ported:
  - Cancelling an order, because no Vue component offers it.
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
  `requestedGroupId`, which `toRegistrationInput(values, { requestedGroupId })`
  adds to the register body; the customer stays in the default group until
  an admin approves. Its metadata (title, SEO description, canonical from the
  resolved SEO path) is built by `buildRouteMetadata` like the other routes.

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
  `violations` inline. `FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN` refreshes
  the session, which turns the form into the login hint.
- Known risk: the backend HTTP cache key ignores `sw-context-token`, so under
  `CACHE_REWORK` a logged-in GET can get the anonymous list. The fallback is
  POST for this read only.
