# react-starter-template

Next.js App Router storefront template for Shopware 6, the React counterpart of
`vue-starter-template`. `supportLevel` in `templates/manifest.json` is
authoritative for its state.

## Next.js docs

Next.js ships docs that match the installed version in
`node_modules/next/dist/docs/`. Read the relevant guide there before writing
Next.js code: 16.4 differs from most training data (Cache Components,
`proxy.ts` instead of `middleware.ts`, async request APIs).

## Code layout

- `platform/shopware/` is the data-access layer on the server: the API client
  and the reads. Nothing outside it creates a server client.
- `features/<area>/components/` holds the UI of one area. A component imports a
  read from `platform/shopware/reads/` and never calls the Store API itself;
  the browser session in `features/session/` is the one exception.
- `cms/` renders Shopping Experiences pages, the port of `cms-base-layer`.
  `cms/AGENTS.md` holds its rules.

## Rules the code does not show

- Cache Components are on. A catalog route must never read `cookies()` or
  `headers()`: that silently makes the route dynamic, and its HTML stops being
  cacheable. Personalised HTML must never be cached and shared, so everything
  personal is read in the browser after hydration.
- Reading `searchParams` or calling `connection()` makes a subtree dynamic, so
  it always happens inside a `<Suspense>`.
- `usePathname()` and `useSearchParams()` suspend under an unknown dynamic
  param (`[...path]`, `[id]`). Called during render outside their own
  `<Suspense>` (the header, the shop layout), they fail `next build`. Read
  `window.location` in an event handler or effect instead. A component that
  renders only after a click (`AccountMenu`, `MiniCart`, the suggestion box)
  may call `usePathname()`.
- Next keeps soft-navigated pages mounted in a hidden `<Activity>`. State and
  refs survive, effect cleanups run on hide and effects run again on reveal.
  So a form keeps its values after a soft navigation, a logout included,
  unless it resets them, and up to three pages stay in the DOM, which is why
  e2e page objects count visible elements only.
- `agentRules: false` in `next.config.ts` stops `next dev` from generating its
  own agent rules into this file or a `CLAUDE.md` pointer. The repository keeps
  `AGENTS.md` files only.
- Markup keeps the `@shopware/design-tokens` class names of the Vue templates,
  so it ports between them. `site/theme.css` (after the package's
  `tailwind.css`) re-themes by overriding design-token names, so `cms/` blocks
  follow too, and defines the template-only `shell-*` chrome colors. When
  changing a value, recompute every pair it takes part in: text 4.5:1, UI
  components and focus indicators 3:1. On `shell-ink` focus uses
  `outline-shell-accent`; `shell-accent` is never text on white or sand
  (2.99:1).
- The template reads `@shopware/design-tokens` from its build output, and
  `unbuild --stub` does not work in Next.js client bundles. After changing the
  package, run `pnpm --filter @shopware/design-tokens build`. It is linked with
  `workspace:*` until published, which is why the template is not scaffoldable
  yet.
- Keep the `data-testid`s and roles that `apps/e2e-tests/page-objects/` uses;
  grep there before renaming one. The specs also run against the Vue starter,
  so the ids come from the Vue sources.
- Tests: `*.test.{ts,tsx}` run in node (SSR markup), `*.dom.test.tsx` in
  happy-dom. A test that imports a `server-only` module, directly or through
  `i18n/server.ts`, mocks it with `vi.mock("server-only", () => ({}))`.
  Components that call `connection()` are not rendered in tests.

## Store API

- Server clients come only from `platform/shopware/client.ts`; the one browser
  client is `features/session/browserClient.ts`. A module in
  `platform/shopware/` without a `server-only` import is browser-safe on
  purpose (client islands and tests import it); keep it free of server code.
- Create one server client per request, never at module scope. An instance
  adopts the `sw-context-token` of every response, so a shared one leaks
  sessions between users.
- `.env.template` leaves `SHOPWARE_PUBLIC_ENDPOINT` and
  `SHOPWARE_DEV_STOREFRONT_URL` empty on purpose: a demo value left there
  after `SHOPWARE_ENDPOINT` is re-pointed sends the shop's logins and
  registrations to the demo host.
- `SHOPWARE_API_TIMEOUT` defaults to 10000 ms (`0` turns it off; a per-call
  `fetchOptions.timeout` wins). The default exists because `next start` has no
  fill timeout for `'use cache'` at request time and concurrent requests share
  one fill per key: one hung read would hold every request for that key until
  undici gives up (300 s, then ofetch retries the GET). It covers the wait for
  response headers only; `readCountries` can take up to ten timeouts.
- `requestOptions.ts` parses the env values on every call; only the warnings
  are deduped. Bad input never throws, because a throw in the proxy or a read
  fails every request. Warnings never print a header value or an invalid name:
  values may be secrets.
- Header names are lowercased, because `createHeaders` and `defu` are
  case-sensitive and would send both spellings. Every `sw-*` name is dropped,
  with `_` read as `-` because PHP behind FastCGI maps both to one server
  variable: it would replace the access key or the context token, or change a
  `'use cache'` response outside its key.
- The browser gets only `SHOPWARE_PUBLIC_API_HEADERS`, filtered once by the
  config route (`publicHeaderPolicy` also drops browser-forbidden names); the
  browser does not filter again. Shopware's CORS preflight allows only
  `Content-Type`, `Authorization` and the core `sw-*` headers, so a custom
  public header blocks every browser call until a
  `CorsHeaderProviderInterface` service or an edge allows it. There is no
  browser timeout variable on purpose: it would put a timeout on the login,
  register and cart mutations.
- Reads are `'use cache'` functions with a `cacheLife` profile from
  `next.config.ts` and an `sw:` tag. No code calls `revalidateTag`, so the tags
  are unused and freshness comes from `cacheLife` alone (`catalog` revalidates
  after 900 s, `reference` after a week).
- A `'use cache'` read is keyed on its arguments only. Everything that changes
  the response (language, currency, sales channel, a context token) must be an
  argument, or the cache serves one visitor's response to another.
- When an endpoint has a GET variant, the read uses it with
  `_criteria: encodeForQuery(criteria)`; there is no `cacheableReads` switch
  and no POST fallback. Where the generated GET type lacks `_criteria`, widen
  the query type locally.
- Let a failed read throw so the failure is not cached. An error leaving a
  `'use cache'` function reaches the caller as a plain `Error` with only a
  `digest`, so the read itself turns a 404 into `notFound()`
  (`.catch(notFoundOn404)`); a caller's `catch` cannot tell a 404 from a 500.
- The demo backend has only English (US): every locale reads English there and
  only the UI labels change.
- Shop settings (Shopware 6.7.14+) take no `languageId`: system config is per
  sales channel and never translated. A 404 means an older backend and is
  cached as `null`. Pages read them only through `loadShopSettings()` after
  `connection()`, never from the root layout. Each field falls back alone to
  `site/shopSettings.ts`, the override point for an older backend. Pass a
  client component only the slice it uses; a new field needs a fallback value
  that keeps today's behaviour.
- `site/shopSettings.ts` reads `REGISTRATION_MIN_LENGTHS` when it loads, so
  `features/account/registrationSchema.ts` must never import it, even
  indirectly: the cycle leaves the constant uninitialized.
- `readCountries` pages (the Store API caps `limit` at 100, the demo has 250
  countries) with a sort that ends in `id`: paging on a non-unique sort
  returns the same country on several pages.

## Routing and CMS

- `(shop)` and `(checkout)` carry the two Vue layouts. Both have a `checkout`
  folder; that is fine as long as no URL resolves in both. A static segment
  wins over the catch-all, so a new page goes into the group whose layout it
  needs.
- Status codes come from `proxy.ts`, not from the page: a `notFound()` inside
  the page's `<Suspense>` can only stream a 200 with `noindex`. The proxy asks
  `seoResolver` (an in-memory LRU per instance) before a catalog path renders:
  - another spelling, a superseded URL (`isCanonical` is `NULL`, not `false`,
    on old rows) and a technical path with an SEO URL get a 301, trailing
    slash kept (Vue drops it and then misses its own lookup). A 301 that
    leaves the origin, or to a stored path with a backslash or control
    character, is never sent;
  - a miss is rewritten to `(shop)/sw/not-found`, which only calls
    `notFound()`, for a real 404;
  - maintenance answers a 503. The Store API checks the IP allowlist against
    the Next server's IP, not the visitor's;
  - a timeout, 429 or 5xx with nothing cached lets the request render instead
    of a 503: every visible `<Link>` prefetch runs the proxy, and the demo's
    per-IP limit would turn prefetches into errors. The same holds while
    `GET /language` was never read, because a lookup without
    `sw-language-id` would 404 or redirect translated paths;
  - only live lookups report to `maintenanceMonitor`, so cached answers cannot
    keep clearing it.
- The proxy and the page map `store-api.*` route names (headless sales
  channels) with `getFrontendRouteName`; `readCanonicalSeoPath` (canonical,
  hreflang) still filters on the frontend name only.
- Known limit: Next's catch-all params drop a trailing slash. The page lookup
  asks for two rows and prefers the exact spelling, but when both `Sale` and
  `Sale/` exist, `/Sale/` resolves to the category in the proxy and to the
  `Sale` row on the page.
- `skipTrailingSlashRedirect` is on because Shopware category paths end with
  `/`. Real statuses only show on `next start`; `next dev` and unit tests
  cannot prove the 404 of the rewritten page.
- Listing `limit` is capped at 100, because the Store API answers 400 above
  its `max_limit`. A param the URL leaves out (a page change sends only `p`) is
  filled from the listing embedded in the CMS data. Never default to fixed
  values: a fixed `limit: 15` re-paged a 24-per-page listing, repeating and
  skipping products.
- `app/globals.css` must import `cms/assets/styles.css`: it carries the
  `@source inline` safelist for the visibility classes built from CMS data.
- Home, landing and product pages read
  `readNavigation("main-navigation", 2, languageId)` for the
  `category-navigation` element, the Header's cache entry; keep the alias and
  the depth in step with the Header or they stop sharing it.
- The home page calls `connection()` before its reads so `next build` does not
  need the Store API.

## HTTP cache headers

- `platform/routing/cacheHeaders.ts` has no `server-only` and only relative
  imports, because `next.config.ts` loads it.
- `PERSONAL_AREAS` get `no-store`; without it `next start` sends
  `s-maxage=31536000` for the static `/checkout/cart`. The entry is
  `registration/confirm`, not `registration`, so a customer-group page at
  `/registration` keeps the Next headers.
- `PUBLIC_ASSETS` get one week, not `immutable`, so a brand swap does not stay
  stuck in browsers for a year.
- Never add a rule that matches every path, `/_next/**`, `/api/**` or catalog
  paths: a config header replaces the `immutable` on `/_next/static`, a route
  handler's own `Cache-Control` and the `private` Next sends for PPR pages.
- Catalog HTML stays `private` while Header and Footer call `connection()`.
- Rules match the incoming path before the proxy rewrite. `next dev` always
  sends `no-store`, so check with `next build`, `next start` and curl.

## Crawling, sitemap and resource hints

- robots.txt and the sitemap routes await `connection()` before reading
  `STOREFRONT_URL`: a metadata route that only reads `process.env` is
  prerendered with the build's environment.
- robots.txt does not disallow the private pages on purpose: they are
  `noindex`, and a crawler kept out never sees that. A bare
  `Disallow: /search` would also block `/search-engines/`. The Store API
  exposes neither `robotsRules` nor `core.staging`, so there is no staging
  switch.
- Shopware generates the sitemaps; the storefront only serves them. The body
  is the gzip file itself (`Content-Type: application/gzip`, no
  `Content-Encoding`). The `<loc>`s are built from the domain URL, so the
  storefront origin and its `/<locale>` paths must be sales channel domains
  with matching languages. On the demo none match, so `/sitemap.xml` is a 404.
  File names without a domain id (before 6.6.7) are skipped; headless sales
  channels get files only from 6.7.15.
- The sitemap list is cached because `GET /sitemap` generates the files
  synchronously under the live refresh strategy. File bodies are not cached
  (binary, up to 49 999 URLs).
- hreflang needs `STOREFRONT_URL` and two locales with a Shopware language of
  their own: a locale on the default language is no translation. One
  `readCanonicalSeoPath` per locale, because the Store API filters `/seo-url`
  to the request's language. Use the rendered product's id, not the requested
  one. `buildLanguageAlternates` never throws, so the canonical is never lost.
- `ResourceHints` sits in the shop layout after `connection()`. Never move it
  into the root layout: a request-time read there makes every static page
  partially dynamic, and a build-time value ignores the runtime environment.
  Keep `lcpImagePreload` off: the package preloads `media.url` with `format`
  and `quality` while `CmsMedia` renders a `srcset`, so the preload fetches a
  file the page never uses.
- Check on `next start`, not in unit tests: `/sitemap.xml` must stay a plain
  route handler with its own headers, and `curl -s / | grep preconnect` must
  show both hints.

## Header and footer

- The Store API parts of Header and Footer await `connection()` inside their
  own `<Suspense>`, so the hermetic build works.
- Categories cross into client islands only as `NavigationNode` trees. Never
  pass `Schemas["Category"]` to a client component.
- The header is sticky from `lg` only, because below that it would cover half
  of a phone or 400%-zoom viewport. Everything that must clear it reads
  `--sticky-header-height`; never hardcode the header height.
- The language and currency switchers are disclosures with lists, not the Vue
  `<select>`: a select that navigates on change breaks WCAG 3.2.2.
- The language switcher looks up the SEO URL in the other locale's language,
  because Shopware stores SEO URLs per language, and skips a `seoPathInfo`
  rejected by `hasUnsafePathChar`. A failed language read sends the locale to
  its home page instead of a prefix swap that may not resolve.
- Every locale switch is a full page load (`window.location.assign`), never
  `router.push` or `next/link`: Next keeps the previous locale's tree in a
  hidden `<Activity>` with its own session store, cart store and API client,
  which a switch back would revive with a stale token and cart.
- A currency switch calls `router.refresh()` (Vue reloads). When the PATCH
  succeeded but the session still holds the old currency, the page reloads,
  otherwise the cart keeps the old currency while the backend places the
  order in the new one.
- Known divergence: the catalog keeps the default currency, because CMS pages
  render anonymously and are cached for every visitor. Converting needs the
  price-bearing reads to send `sw-currency-id` and key on it.
- `resolveRedirectFromSearch` is the open-redirect guard (it refuses a
  normalized pathname starting with `//`, such as `/.//evil.example`); use it
  for every `redirect` param.

## Internationalization

- No i18n library: `i18n/translate.ts` implements the part of vue-i18n the Vue
  messages use. `en-GB` has no URL prefix; `proxy.ts` 308-redirects `/en-GB/…`
  and treats any other unknown first segment as a page path.
- `STATIC_FILE` and `SITEMAP_FILE` are copied literally into
  `config.matcher`, because Next reads `config` statically. Product SEO URLs
  end in the product number and landing-page URLs are free text
  (`/Shirt/TS-100.XL`, `/summer-sale.html`), so never add `html` or a generic
  extension pattern to the static list.
- A page whose params hold an unknown dynamic segment gets a params promise
  that never resolves while prerendering, so its body awaits params only
  inside its `<Suspense>`; `generateMetadata` may await them.
- The Vue starter's JSON files are copied unchanged; edit them only together
  with the Vue starter. Keys only this template has go into
  `i18n/<locale>/react/<area>.json`, listed in `REACT_AREAS` of
  `i18n/keys.test.ts` and `i18n/messages.test.ts`.
- `react/core.json` carries the English defaults `cms/` components keep in
  `translationDefaults`, translated. When a package component gains a default,
  add its key in all three locales with the English value equal to the
  package default (e2e asserts `has been added to cart.`).
- Adding a key: reuse a Vue key when one fits. Otherwise add it to its area's
  `react` file in all three locales with real text, and reference it with a
  literal key. A key built at runtime (`errors.${code}`) is not checked by
  `keys.test.ts`, so guard it with `hasTranslation`.
- Plurals deliberately differ from vue-i18n: `a | b | c` is picked with
  `Intl.PluralRules` (one/few/other), not vue-i18n's index rule, which turns
  Polish `search.result` into "1 wyniki".
- A server `generateMetadata` cannot call a function exported from a
  `"use client"` module, so shared copy helpers live in plain modules.
- `LocaleLink`, `useLocalePath()` and `withLocale` leave external URLs and
  already-prefixed paths alone, so a prefixed href can pass through again.
  Payment return URLs and the login `redirect` carry the prefix.
- Pages export `generateMetadata`, never a static `metadata` title.
- Catalog metadata follows the Shopware storefront, not Vue. The canonical is
  the entity's canonical SEO URL (technical path as fallback) with only
  `?p=N`. For a variant with a `canonicalProductId` it is the canonical
  product's SEO URL (technical path as fallback), while the hreflang
  alternates still point at the variant. Absolute URLs need `STOREFRONT_URL`;
  the request host is never used, because the catalog does not read
  `headers()`. `homeMetaTitle` is not exposed by the Store API.
- Breadcrumbs read `GET /breadcrumb/{id}` with an explicit `type` (the default
  tries the product first); 204 means no main category.
- Pages whose URL carries a secret (deep-link order, password reset, double
  opt-in) are `noindex, nofollow`; the reset page also sets
  `referrer: "no-referrer"`.
- `<html lang>` is the URL locale, so Shopware text in another language
  declares its own (WCAG 3.1.2). Put `lang={contentLang}` only on the element
  that holds Shopware data, never on a wrapper that also renders `t(...)`.
  The root layout never reads Shopware: a rejected `'use cache'` read during
  prerendering fails the build even when caught. `cms/` elements get no
  `lang`; wrapping `<CmsPage>` is wrong, it also renders `ctx.translations`.
- The 404 renders `<h1>404</h1><h2>{message}</h2>`, the shape
  `apps/e2e-tests/fixtures.ts` parses. A streamed 404 keeps the metadata
  `<title>` first, so the catch-all's `generateMetadata` titles an unresolved
  path itself.

## Session and actions

- The session lives in the browser, like `packages/nuxt-module/plugin.ts`.
  The cookie is `secure` when the page is served over `https:` (Nuxt keys it
  on the endpoint protocol, but the cookie belongs to the page) and never
  `httpOnly`, because the browser client reads it.
- The browser gets its config from `app/api/shopware/config/route.ts`, never
  from `NEXT_PUBLIC_*`: those are inlined at build time, so one build could
  not be re-pointed.
- The config fetch and the `/context` read give up after `READ_TIMEOUT_MS`,
  because every action waits for them. `createOrder` gives up after
  `ORDER_TIMEOUT_MS`, and ofetch never retries a POST, so the timeout cannot
  place a second order. Other mutations have no timeout.
- A failed first `/context` read, and a failed re-read inside `login`,
  `register` or `logout` (the identity changed), give a logged-out session. A
  failed `refreshSession()` or `retrySession()` keeps the last good session
  with status `"error"`, so a flaky network does not log the customer out or
  change the cart's session key.
- The store always sets `sw-language-id` for the locale's language, so a
  language changed by another tab on the same token, or restored at login,
  does not take over this tab. A locale without a matching language switches
  the context to the default language: the URL alone decides.
- Never create a second browser client: it would not see the tokens the
  session client adopts. `getClient()` resolves only after the first
  `/context` read, so no request goes out before the cookie token is adopted.
- After a mutation that changes what `/context` returns, call
  `refreshSession()`.
- A retry waits for any running action, so a late guest token cannot
  overwrite the login token. A logout rejected with 403
  `FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN` means the session already ended
  and counts as success.
- Logout ends with a full reload (`window.location.assign`), and forms clear
  their values after a success, because of `<Activity>`.
- The actions never reject. `login` and `register` do not toast: their forms
  show the messages in one `role="alert"` block, and a toast as well would be
  read twice. `hasApiErrorCode`, `resolveApiErrorMessages` and
  `apiFailureSummary` live in `features/session/apiErrors.ts`.
- A toast's `action` link renders after the
  `data-testid="notification-element-message"` element, never inside it: e2e
  asserts that the message ends with "has been added to cart.".
- `StorefrontProviders` is the app side of the CMS actions port. Wire a new
  member there, not in the CMS components.
- `browserClient.ts` re-exports `CONTEXT_TOKEN_COOKIE` because several tests
  mock that module.
- The server writes the session cookie in one place only, the
  Administration's "Login as customer"
  (`app/[locale]/(shop)/account/login/imitate-customer/route.ts`). It is a
  route handler, not a Server Action, because the Administration posts a
  cross-origin form and Server Actions abort when Origin ≠ Host; it exports
  only `POST`, so the token never appears in a URL. It uses a fresh client, so
  a guest cart is not merged. Never log the error object: the 400
  `CHECKOUT__IMITATE_CUSTOMER_INVALID_TOKEN` carries the token in `detail`
  and `meta.parameters`. It needs a storefront-type sales channel whose
  domains use exactly `/pl-PL` and `/de-DE`. An open tab keeps the old token
  and writes it back on its next context change.

## Cart

- The cart store re-reads when `cartSessionKey` changes (customer, guest flag,
  token, language, currency). An order keeps the token, and so does any other
  context switch (method, country), so neither re-reads on its own: call
  `refresh()` or `useCartRefresh()` after it.
- Promotions: `promotion-discount-added` is no proof a code applied, because
  automatic promotions raise it too. One code can create several line items,
  and removing one drops the rest. A valid but not eligible code stays in the
  cart without a line item; with two such codes the entry raised last
  replaces the other.
- All cart operations run one after another. Two writes on one token in
  flight can lose an update in Shopware, and a read started by a session
  change would win over an earlier add-to-cart answer. Mutations have no
  timeout, so a hung one holds the queue.
- The actions never reject and never notify. A mutation leaves out a state
  error (`CART_STATE_ERRORS`) the cart already had: Shopware raises them on
  every calculation, and without the filter every add-to-cart repeats them
  and the CMS islands skip their success toast. The filter key includes
  `messageKey` and `message`, because every `promotion-not-eligible*` shares
  one key. The Store API exposes no `isPersistent` flag.
- The CMS islands notify add-to-cart results themselves, so the provider must
  not.
- Order views pass the order's own currency to `Price`, because an order keeps
  the currency it was placed in.
- `useCartLoadNotices()` re-reads a held cart on mount and on each reveal from
  `<Activity>` and toasts its errors; a run counter lets only the latest run
  toast. On `/checkout` that is three requests against the demo's per-IP
  limit. Load toasts never use `timeout: 0`: toasts survive client navigation
  and would stack.
- The cart page has no country or method selector: a server country list would
  make the static `/checkout/cart` dynamic.
- `PromotionCodeForm` is also in the checkout summary, because the mini cart's
  "Proceed to checkout" skips the cart page. Its submit never uses
  `BaseButton loading`, which disables the button and drops focus.
- `TagIcon` lives in `components/icons/` to avoid a `features/cart` →
  `features/checkout` import cycle.
- Removing a line item moves focus to a neighbour's `data-line-item-remove`
  button, found through the `<ul>`/`<li>` markup; keep that markup.
- Tests: there is no injectable cart store, so component tests replace
  `useCart` with `vi.mock`. Wrap a fake invoke client in
  `ShopwareClientHarness` instead of mocking `useShopwareClient`.

## Checkout

- Every checkout call runs in the browser: the order belongs to the customer's
  context token, which only the browser client holds.
- The method reads widen the GET query type, because the GET types lack
  `onlyAvailable` (the backend reads it from the query).
- `updateCustomerDetails` patches the default billing address with
  `updatedAddressBody` (`features/account/address/addressApi.ts`): every
  stored field is sent, because the upsert route nulls the ones left out, and
  `countryStateId` is omitted when the new address has none.
- A session that could not be read at all shows an alert with "Try again"
  instead of the steps: an unknown session would show the guest form to a
  logged-in customer.
- A method change patches the context, then calls `refreshSession()` and
  `useCartRefresh()` together (the token stays, so the cart does not re-read
  on its own), then re-reads both method lists; the newest read wins. Place
  order is disabled while a shipping or payment change is pending. After a
  login the checkout skips this: the cart already re-reads on the new
  customer id, and a second read would toast nothing.
- After registering during checkout, email, password and the account toggle
  become read-only/disabled, and the next attempt updates the customer
  details instead of registering again. If the registration succeeded but the
  session has no customer, the next attempt calls `retrySession()` instead of
  registering twice.
- The `placingOrder` ref covers only the request in flight. The overlay, the
  comment and the terms reset in a `useLayoutEffect` cleanup when Next hides
  the page.
- A `createOrder` failure whose outcome is unknown (`isAmbiguousOrderFailure`)
  shows `errors.order-timeout`, since the order may exist. Every failed
  `createOrder` re-reads the cart, so a committed order shows the empty cart.
- The success page reads the order once behind a ref, so StrictMode does not
  start the payment twice. Only an http(s) `redirectUrl` redirects. The
  backend pays only the newest open transaction and answers
  `redirectUrl: null` when none is left.
- A guest order by a returning customer is not blocked (`RegisterRoute`
  checks the email only for accounts) and is not linked to their account.
- A failed save of a separate shipping address is not followed by a session
  read, so the page keeps the address the save created and a retry patches it
  instead of creating a second one.
- Without the data-protection checkbox `acceptedDataProtection` is sent as
  `false`: the backend only validates it.
- Address choice: the radios only select, because arrow keys check a radio and
  a commit on change would switch the context on every step (WCAG 3.2.2). A
  choice patches only `shippingAddressId` or `billingAddressId`, so the
  defaults stay, and re-reads both method lists, because availability and
  costs depend on the shipping country. Guests get no "Add new address": the
  account area treats them as logged out.
- Terms are checked only in the browser and never sent: `CartOrderRoute`
  validates no order data. Do not gate `tos` on `cart.showTosCheckbox` yet:
  its admin field is behind the `v6.8.0.0` flag and migrated to `false`, while
  the 6.7 Storefront always requires the checkbox.
- Terms links: `site/legalLinks.ts` is the override point, because the Store
  API exposes neither `tosPage` nor `revocationPage`. Point a link at
  `/navigation/{categoryId}`, which the proxy redirects per locale. The `tos`
  checkbox gets an `aria-label` with the plain sentence, so the link's "opens
  in a new tab" hint stays out of its name (2.5.3).
- Not ported: adding or editing an address inside the checkout, filtering
  countries by `shippingAvailable`, hiding the shipping address of
  digital-only carts, logging out from the checkout, and the success page's
  downloads.

## Account

- No URL resolves in both the `(member)` group and outside it: the static
  `details` segment wins over `[deepCode]`, and `(member)` has no `recover`
  folder.
- Every page under `(member)` exports `instant = false`. The guard renders its
  skeleton until the browser session is known, so the dev instant-navigation
  validator never sees the page segment and reports it as dropped. Keep the
  export on new account pages.
- The guard runs in the browser, because the server cannot tell who is logged
  in. A guest counts as logged out.
- `useAccountLogout` sets a module flag (`takeLogoutIntent`) so the guard
  skips its redirect and toast, then ends with
  `window.location.assign(localePath("/"))`. Without the flag the session
  update lands first and sends the customer to the login page with "Login is
  required".
- `AccountMenuList` calls `usePathname()` inside its own `<Suspense>`, because
  the hook suspends under `address/edit/[id]` and `order/details/[id]`.
- The header and the checkout read `/context`, the account pages read the
  customer. After a mutation that changes the customer, call
  `useCustomer().refresh()` and `refreshSession()` together.
- The address pages load shop settings and countries (`loadCountryOptions`) on
  the server; the address form renders the phone and the additional address
  lines per the `core.loginRegistration` settings.
- The profile body always sends `accountType`, because without it the backend
  keeps a business type. Extra VAT IDs after the first are kept.
- An address update sends every stored field merged with the form values
  (`updatedAddressBody`), because `UpsertAddressRoute` nulls the fields it
  does not get.
- `<Activity>` resets: the new and edit address forms reset their saved state
  in a `useLayoutEffect` cleanup; the email and password change forms clear
  after a success.
- Order details send `checkPromotion` in the body and the query: `OrderRoute`
  reads it only from the query, and without it `paymentChangeable` never comes
  back. `handleOrderPayment` lives in `ordersApi.ts` because `checkoutApi`'s
  `handlePayment` takes no timeout.
- Cancelling requires the state `open`, like the Storefront, although the
  state machine also cancels `in_progress`. There is no e2e spec: the demo has
  refunds off, and a cancellation cannot be undone.
- `/account/order/[deepCode]`: `login: true` swaps the context token, so the
  page calls `refreshSession()`. A `CHECKOUT__CUSTOMER_NOT_LOGGED_IN` or
  `FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN` answer redirects to the login
  page with `?redirect=`.
- Tests replace `useCustomer` with `vi.mock` and
  `customer/fakeCustomer.fixture.ts`.
- Customer-group registration has no technical path, and Shopware generates
  its SEO URL only for storefront-type sales channels. The introduction is
  rendered sanitized through `renderRichText`, unlike Vue's raw `v-html`.
  `companyOnly` is not enforced by the backend.
- Registration settings: `birthYearMax` is computed on the server so SSR and
  hydration agree. The birthday is all or none and a real date, because the
  backend drops a partial date and rolls an impossible one over. Email and
  password confirmations are client-only and never sent.
- Password recovery:
  - `/account/recover/password` is the path of the default
    `pwdRecoverUrl`; a shop that changed it needs a matching page.
    `storefrontUrl` must equal a sales channel domain without a trailing
    slash, and `recoveryStorefrontUrl` prefers the locale-prefixed domain,
    otherwise a German mail links to the English page.
  - The answer is 200 whether or not the address belongs to a customer. Never
    add a branch or a message that tells the two apart.
  - The reset page reads `hash` from `window.location` once, so its shell
    stays static. The generated type nests `isExpired` under `data[]`; the
    backend answers it flat.
  - The reset revokes every context token of that customer, this tab's
    included, so the form refreshes the session and goes to the login page. A
    link works once (410), so the form ignores further submits.
  - Never show `detail` or log the error object: violations echo the password
    in `detail` and `meta.parameters`, and the 404 and 410 carry the hash.
  - The client minimum is 8: reading the shop's minimum would make the page
    dynamic, so a higher one comes back as a server violation.

## Wishlist

- Every wishlist route needs a logged-in customer, so the store never calls
  the API for a guest. A new customer id drops answers still in flight.
- The count is `products.total` with `"total-count-mode": "exact"` (without
  it `total` is only the page size). Only 100 ids are read, so above that the
  heart shows empty on the rest.
- Not failures: a read 404 `CHECKOUT__WISHLIST_NOT_FOUND` is an empty wishlist
  (no row until the first add); a duplicate add and a delete of a missing
  product leave it as wanted. `core.cart.wishlistEnabled` is off on a fresh
  install, and every route then answers 403.
- The read is typed `ProductListingResult` but is a plain entity search
  result. Only `sw-include-search-info` and `sw-language-id` are allowed as
  headers, so SEO URLs come through `associations` in the body. It stays POST:
  personal and not HTTP-cacheable.
- `toggleWishlist` awaits `retrySession()` first, because the e2e suite clicks
  right after a page load. After a modal login the store reads the ids before
  it adds; the Vue starter gets a 400 for a product already on the list.
- Skeleton tiles carry no test id, because the specs count
  `wishlist-product-box`.

## Reviews

- A logged-in customer's list is read in the browser, because the route also
  returns the customer's own pending review. The read uses `parentId ?? id`;
  the review is saved under `product.id`, like Vue.
- `FRAMEWORK__ROUTING_CUSTOMER_NOT_LOGGED_IN` on submit opens the login modal
  before the session is refreshed, because a refresh turns the form into the
  login hint and drops the typed review.
- Known risk: the backend HTTP cache key ignores `sw-context-token`, so under
  `CACHE_REWORK` a logged-in GET can get the anonymous list. The fallback is
  POST for this read only.

## Search

- The header search is a `<search>` element, not `<form role="search">`:
  oxlint rejects the role and handlers on the form, so its key and focus
  listeners are native. happy-dom has no `search` element, so the
  "unrecognized tag" log in DOM tests is expected. Keep it a single-field form
  without a submit button: a second `aria-label="Search"` button would be found
  before the mobile toggle in `HeaderBar` tests.
- `useSearchPageTerm` is `useSyncExternalStore` over `window.location`,
  subscribed to `popstate` and the Navigation API's `currententrychange`.
  `useSearchParams()` or `usePathname()` there would suspend outside a
  `<Suspense>` and break `next build`. A `useEffect` that sets the text fails
  oxlint's `react/set-state-in-effect`.
- Suggestions run in the browser, not through a route handler, which would put
  every visitor behind the Next server's IP and the per-IP rate limit.
  `search` must stay a plain query parameter: the route checks it before
  `_criteria` is unpacked and answers 400 otherwise. Same `CACHE_REWORK` risk
  as Reviews: group prices can show as anonymous ones.
- While the next term loads, the old suggestions stay as an `inert` list, so
  no key can focus a link the answer then unmounts. The box opens before the
  answer arrives, because `HomePage.typeSearchPhrase` waits for it.
  Suggestion links use `prefetch={false}`, because each visible link would run
  the proxy's SEO lookup.
- `/search`: never move `limit` into `_criteria`; the route resets the
  criteria limit and reads `limit` only from the request. Send no fixed
  `order` or `limit`, so the shop's defaults apply.
- `normalizeSearchTerm` cuts to 300 code points (the backend's
  `term_max_length`), so spellings that search the same share one cache entry.
  A blank term sends no request: the backend would list every product.
- Tests: the package resolves its own `next`, so `vi.mock("next/navigation")`
  does not reach package islands; stub them through `vi.mock` of the package
  entries instead.
- e2e: the listing tests wait for a browser `/store-api/search` response that a
  server-rendered listing never sends, the same gap as category listings.

## Variants

- `find-variant` options must be keyed by group id: Shopware falls back by
  unsetting options whose key is not `switchedGroup`, and the list form (the
  only one the generated GET type knows) drops options in list order,
  sometimes the one just picked. The route also applies the detail page's
  closeout filter, which a `/product` search does not.
- The answer is the flat `FoundCombination`, not the wrapper of the generated
  type. An empty selection never reaches the backend, which would answer any
  variant.
- A `seoPathInfo` rejected by `hasUnsafePathChar` is never used, because
  `/\host` resolves off the origin.
- The island navigates with `router.replace(…, { scroll: false })`, so Back
  leaves the product, not every variant tried. A `store-api-404` in the e2e
  diagnostics is an expected miss.

## Forms

- The contact and newsletter forms run in the browser on the session client,
  so the mail language follows the session and the per-IP rate limits count
  the shopper, not the Next server.
- Contact: without `slotId` the backend ignores the element's `mailReceiver`
  and confirmation text. The backend requires `salutationId` although the
  schema marks it optional. A 200 only means the event fired.
- Newsletter: the backend rejects a `storefrontUrl` that is not a sales channel
  domain unless `doubleOptInDomain` is set. An empty `salutationId` would hit
  the foreign key. An unsubscribe 400 `CONTENT__NEWSLETTER_RECIPIENT_NOT_FOUND`
  counts as success, so the form never tells whether an address is on the
  list.
- A 5xx or a non-API error gives `errors.message-default` without violations,
  so no backend detail reaches the shopper. Never log the error object:
  violations echo what the shopper typed.
- Never point an e2e spec at the shared demo for these forms: it creates
  recipients, sends mails and spends the rate limits.

## Email links

- A resent registration mail uses `doubleOptInDomain` or a sales channel
  domain, not the `storefrontUrl` of the register call. The merchant must make
  this storefront's origin, with its locale prefixes, a sales channel domain
  and set `doubleOptInDomain` to it.
- The islands read `em` and `hash` from `window.location` once, in the mount
  effect, so the page stays fully static. The link is kept in a ref, so a
  hidden page whose URL changed does not turn into "invalid link".
- A link can be confirmed only once, so `confirmOnce` shares one promise per
  hash across StrictMode and remounts and forgets only `failed`.
- Registration: the island waits until the cart status is no longer
  `"loading"`. A GET sent with the old token that answers after the confirm
  echoes that token, the api-client re-adopts it and the customer is logged
  out (the fix belongs in `@shopware/api-client`).
- Never show the backend `detail` and never log the error object: the
  not-found codes carry the hash in `detail`.
