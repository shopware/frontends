# react-starter-template

Next.js App Router storefront template for Shopware 6, the React counterpart of
`vue-starter-template`. State: anonymous Store API reads, SEO URL routing, CMS
rendering, the header/footer layout, a browser session with login,
registration and logout, the cart and the checkout with the order
confirmation work; wishlist, search, variant switching and forms are stubs.
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

- Server clients come only from `platform/shopware/client.ts`
  (`createShopwareClient`), and every module there imports `server-only`
  except `publicConfig.ts` and `reads/countryOptions.ts`. The one browser
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

- `app/layout.tsx` holds only `<html>`, `<body>` and `StorefrontProviders`.
  Two route groups carry the two Vue layouts. `app/(shop)/layout.tsx`
  (`Header`, `<main aria-label="Main content">`, `Footer`; the Vue default
  layout) holds `/` (`app/(shop)/page.tsx`), the catch-all
  `app/(shop)/[...path]/page.tsx`, `/account/login` and the order pages under
  `app/(shop)/checkout/success/[id]/`. `app/(checkout)/layout.tsx`
  (`CheckoutHeader`, `<main aria-label="Checkout">`; the Vue
  `layouts/checkout.vue`) holds `/checkout` and `/checkout/cart`. Both groups
  have a `checkout` folder; that is fine as long as no URL resolves in both.
  A static segment wins over the catch-all, so a new page goes into the group
  whose layout it needs.
- `app/(shop)/page.tsx` renders the sales channel's navigation category for
  `/`. `app/(shop)/[...path]/page.tsx` resolves every other storefront URL in
  a server component: technical paths (`/navigation/{id}`, `/detail/{id}`,
  `/landingPage/{id}`) are parsed with `getRouteFromPathInfo`, everything
  else is looked up in `/seo-url` with both the plain path and the path with
  a trailing slash. The result is dispatched to
  `features/cms/components/{NavigationPage,DetailPage,LandingPage}`.
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
- The home page (`app/(shop)/page.tsx`) calls `connection()` before its
  reads so `next build` does not need the Store API. Prerendering at build
  time is a later decision.

## Layout

- `app/(shop)/layout.tsx` renders `features/layout/components/Header` and
  `Footer` around `<main aria-label="Main content">`. Both are server
  components. The parts that read the Store API
  (`readNavigation("main-navigation", 2)` for the header,
  `"footer-navigation"` with depth 1 for the footer) await
  `connection()` inside their own `<Suspense>`, so the hermetic build works
  and the header bar renders before the navigation streams in. The two header
  readers share one `cache()`d loader.
- Categories cross into client islands only as `NavigationNode` trees
  (`features/navigation/navigationTree.ts`: id, name, href from
  `getCategoryUrl`, `external` for `externalLink`/`linkNewTab`, children).
  `NavigationLink` turns `external` into `target="_blank" rel="noopener"`.
  Never pass `Schemas["Category"]` to a client component.
- Client islands: `TopNavigation` (desktop menubar with the flyout, hidden
  below `lg`), `MobileMenu` (burger plus a `<dialog>` drawer with
  `data-testid="sidebar-left"`, focus trap and body scroll lock), `HeaderBar`
  (logo, search, account/wishlist/cart buttons, mobile search toggle),
  `HeaderSearch` and `NewsletterBox`.
- Session data comes from `useSession()` in `features/session`, filled in the
  browser by `ShopwareSessionProvider` (see Session and actions). The account
  button sends a guest to `/account/login?redirect=<encoded path>` like the
  Vue header's `route.fullPath`, and `LoginForm` and `RegistrationForm`
  follow that `redirect` after a login or a registration.
  They read `window.location` in the event handler, never `usePathname()` or
  `useSearchParams()` during render: with Cache Components those hooks
  suspend the shop layout under `app/(shop)/[...path]` (an unknown catch-all
  param), which fails `next build`, and would drop the login form out of the
  static shell. `AccountMenu` and `MiniCart` may call `usePathname()` only
  because they render after a click, never on the server.
- Logged in, the account button is a disclosure (`aria-expanded`,
  `aria-controls`) for `AccountMenu`: the "Signed in as" line and Logout. It
  closes on Escape, an outside `mousedown`, a route change and a logout.
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
  which can trigger both, still lands on one URL.
- The cart button reads `useCart().count` and is a disclosure for `MiniCart`
  (see Cart) that opens only while the count is above 0. The wishlist button
  and the search input only call `notify()` with the messages in
  `features/storefront/notWired.ts`; the newsletter form
  goes through `subscribeNewsletter` of the actions port, so wiring it later
  needs no form change.
- UI copy sits in a `t` const at the top of each component, keyed by the Vue
  i18n keys (`templates/vue-starter-template/i18n/en-GB/*.json`), ready for a
  next-intl swap. Keep the Vue `data-testid`s and roles
  (`header-account-button[data-logged-in]`, `header-wishlist-button`,
  `header-mini-cart-button`, `header-search-input`,
  `[role="menubar"] [role="menuitem"]` for top-level entries only); the e2e
  suite asserts them.
- Icons are hand-ported meteor SVGs in `components/icons/index.tsx` (fill
  `currentColor`, `aria-hidden`). Shared class lists live in
  `components/input.ts` and `features/layout/headerAction.ts`.
- `pnpm --filter react-starter-template test` runs two Vitest projects:
  `*.test.{ts,tsx}` in node (SSR markup through `test/render.tsx`) and
  `*.dom.test.tsx` in happy-dom for the interactive contract (drawer,
  flyout). Components that import `server-only` or call `connection()` are
  not rendered in tests.

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
  instance. The static `api` segment wins over `app/(shop)/[...path]`.
  `loadPublicConfig` fetches it once per page load and forgets a failure, so
  the next caller retries; `parsePublicShopwareConfig` in
  `platform/shopware/publicConfig.ts` validates the payload. That fetch and
  the `/context` read give up after `READ_TIMEOUT_MS`
  (`features/session/readTimeout.ts`; ofetch retries the read once), because
  every action waits for them. Mutations other than `createOrder` have no
  timeout; `createOrder` gives up after `ORDER_TIMEOUT_MS` (60 s, same file),
  and ofetch never retries a POST, so the timeout cannot place a second
  order.
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
  The wishlist count stays 0; the cart has its own store (see Cart).
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
  `resolveApiErrorMessages` (`apiErrors.ts`, a port of the Vue
  `useApiErrorsResolver` with the copy of `errors.json` in
  `errorMessages.ts`), show one error toast per message themselves and
  resolve `{ ok: false, message }` with the first one, so the forms must not
  notify `{ ok: false }` again. Anything that is not an `ApiClientError`
  resolves to `errors.message-default`.
- `StorefrontProviders` is also the app side of the CMS actions port
  (`CmsActionsProvider`). `addToCart` goes to the cart (see Cart); wishlist,
  variant lookup and forms are still stubs there that show a "not connected"
  notification (`features/storefront/notWired.ts`) and return `{ ok: false }`.
  Wire them there, not in the CMS components.
- `StorefrontProviders` renders the toasts of `notify()`. A toast's
  `action` is a `next/link` rendered after the
  `data-testid="notification-element-message"` element, never inside it:
  `ProductPage.addToCart` in the e2e suite asserts that the last message's
  text ends with "has been added to cart.". Following the link or the close
  button dismisses the toast. A toast without `timeout` stays 5 seconds, a
  positive finite `timeout` is respected, and `0`, a negative or an infinite
  one keeps it until it is closed (the checkout's persistent errors).

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
  again whenever `cartSessionKey` changes: the customer id, the guest flag
  or the context token, so after a login, a registration (guest or not) and
  a logout. An order keeps the token (`CartOrderRoute` only deletes the
  cart), and so does a context switch (shipping or payment method, currency,
  country), so neither re-reads on its own: call `refresh()` after it, as the
  checkout does. A failed read is logged, sets status `"error"` and keeps
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
  message. The caller decides what to show; the `messageKey`s are the
  `errors.json` keys in `errorMessages.errors`.
- CMS add-to-cart: `StorefrontProviders` maps the port's
  `addToCart({ productId, quantity })` to `addProduct` and returns its result
  unchanged. The islands (`SwProductAddToCartForm`,
  `SwProductCardAddToCartButton`) notify the success with the "View cart"
  action and the cart errors themselves, so the provider must not notify.
- `components/Price.tsx` formats with `formatPrice` from the CMS package,
  locale `en-GB`, in the session context's currency (`EUR` until it is read),
  and renders nothing for `null` or `undefined`.
- The cart UI sits in `features/cart/components/`. `CheckoutProductTile` ports
  the Vue `checkout/ProductTile.vue`: `data-product-id` is the line item's
  `referencedId`, the quantity select shows only for stackable products
  (clamped to `quantityInformation`, snapped to `purchaseSteps`), Remove only
  for removable ones, and the payload options render as "Group: Option"
  under `cart-product-options`. `MiniCart` is the header panel (closes on
  Escape, an outside `mousedown`, a route change and once the cart is
  empty); `CartPageContent` is `/checkout/cart`
  (`app/(checkout)/checkout/cart/page.tsx`). Nothing re-reads the cart on
  that page on its own, so a failed first read shows the error with a
  "Try again" button that calls `refresh()`; the store keeps status
  `"error"` during that re-read, so the button holds its own pending state
  (`disabled`, `aria-busy`). Both and the checkout
  `SummaryBox` go through `useLineItemActions`, which notifies every cart
  error (`errorMessages.errors`, else `params.message`) and the failure
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

## Checkout

- `/checkout` is `app/(checkout)/checkout/page.tsx` in the checkout layout
  (`CheckoutHeader`, `<main aria-label="Checkout">`, like the Vue
  `layouts/checkout.vue`). It awaits `connection()` and `readCountries()`
  inside `<Suspense>` (`CheckoutSkeleton`) and hands the countries to
  `features/checkout/components/CheckoutPageContent.tsx`; a failed country
  read shows the country field's error with a retry, as on the login page.
  The success pages sit in the shop layout under
  `app/(shop)/checkout/success/[id]/` (the Vue default layout); the static
  `checkout` segment wins over `app/(shop)/[...path]`.
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
  set plus the address countries); `handlePayment`
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
  `/checkout/success/{id}` and refreshes the session and the cart. A ref
  ignores a second click, the form is `inert` behind
  `<output aria-label="Placing order…">`, and errors are persistent toasts
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
  replaced to `/`. Otherwise it reads the order once (a ref, so StrictMode
  does not start the payment twice), then calls `handlePayment` with
  `{origin}/checkout/success/{id}/paid` and `/unpaid` as finish and error
  URLs. Only a `redirectUrl` that parses as an http(s) URL shows the payment
  alert and redirects after `PAYMENT_REDIRECT_DELAY_MS` (5 s, cleared on
  unmount); synchronous payment methods answer `null`. A failed
  `handle-payment` is only logged, and reloading the page runs it again. The
  backend pays only the newest transaction still in the `open` state. An
  order with no open transaction left (paid, failed, cancelled) answers 200
  with `redirectUrl: null`, so the page shows the confirmation with no
  payment alert. An async payment that is still open gets a fresh redirect.
  It errors only when the order has no transaction for this customer at all.
  `paid` and `unpaid` are server pages; the
  Vue starter's i18n lacks their keys, so the copy comes from the
  `vue-demo-store` `checkout.json`.
- Keep the e2e ids (`page-objects/CheckoutPage.ts`, `tests/createOrder.spec.ts`):
  `checkout-pi-email-input`, `checkout-pi-password-input`,
  `checkout-create-account-toggle`, `checkout-pi-first-name-input`,
  `checkout-pi-last-name-input`, `checkout-pi-street-address-input`,
  `checkout-pi-zip-code-input`, `checkout-pi-city-input`, `country-select`,
  `checkout-pi-state-input`, `checkout-shipping-method` (one per row, around a
  native `name="shipping-method"` radio), `checkout-place-order-button`,
  `cart-subtotal`, `cart-total`, `checkout-success-page`, `order-subtotal`,
  `order-shipping`, `order-total`.
- Not ported yet: the "View in my account" link (no account order page),
  downloads of digital line items and changing the payment method of an
  order.
