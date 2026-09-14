---
head:
  - - meta
    - name: og:title
      content: "Best practices: Caching"
  - - meta
    - name: og:description
      content: "An overview of the caching strategies available in Shopware Frontends and when to use each."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**Caching**.png?fontSize=110px"
nav:
  position: 25
---

# Caching

Shopware Frontends templates cache at several independent layers. Each one solves a different problem, and they compose: a request can be served from the browser cache, a CDN, an ISR-rendered HTML page, the Shopware backend HTTP cache, or fall through to a fresh Store API call. This page describes the strategies available in a Shopware Frontends project (Nuxt 4 / Vue 3, built on packages such as `@shopware/nuxt-module`, `@shopware/composables`, and `@shopware/api-client`), when to reach for each, and how to configure them.

## Caching at a glance

| Layer                            | What it caches                                                 | Where it runs                      | How you configure it                     |
| -------------------------------- | -------------------------------------------------------------- | ---------------------------------- | ---------------------------------------- |
| Request layer (`cacheableReads`) | Anonymous Store API reads, routed through cacheable GET routes | Composables -> HTTP infrastructure | `shopware: { cacheableReads: true }`     |
| Render layer (`routeRules`)      | Rendered HTML pages (ISR / SWR), per-route headers             | Nuxt / Nitro server                | `routeRules` in `nuxt.config.ts`         |
| Edge / CDN layer                 | GET responses and HTML with cacheable `Cache-Control`          | CDN / reverse proxy                | `Cache-Control` headers + your CDN       |
| Backend HTTP cache               | Store API GET responses (Varnish / Fastly)                     | Shopware backend                   | Shopware reverse-proxy config (platform) |
| Client state                     | Session, cart, user, listings, navigation                      | Browser memory (per session)       | Shared composables, `provide`/`inject`   |
| Assets / images                  | Optimized images, SVGs, static files                           | CDN / browser                      | `@nuxt/image` presets, route headers     |

The first three layers are about HTTP responses; the last two are about avoiding work the storefront already did. Most of them are not specific to Shopware Frontends: the render layer (`routeRules`, ISR / SWR / prerender), Nitro cache storage, asset caching, and client-side shared state are standard [Nuxt](https://nuxt.com) / Nitro / Vue capabilities that a Shopware Frontends project configures like any other Nuxt app - we are one use case of what the framework already provides. Only the request layer (`cacheableReads`) and the Shopware backend HTTP cache it unlocks are Shopware-specific. This page focuses on how a storefront wires these pieces together and links out to the Nuxt and Nitro docs for the underlying features.

::: info
ISR and route-rule caching are honored only by deployment targets that support them (a Node server, Vercel, Netlify, or another Nitro-compatible host) and only in a production build. They have no effect under `nuxt dev`. See [Deployment](./deployment) for hosting models.
:::

## Request layer: `cacheableReads`

`cacheableReads` is the headline new capability. It is an opt-in boolean flag (default `false`) that lets a defined set of read composables use the cacheable GET variants of the Store API instead of POST. POST responses are not cached by CDNs, reverse proxies, or browsers in practice (HTTP allows it only when explicitly marked, which shared caches generally ignore), whereas GET responses are cacheable by default. Enabling the flag is what makes that possible from the frontend side.

When enabled, and only for a session that equals a fresh default guest, these composables encode the Shopware Criteria object into a `_criteria` query parameter (gzip + base64url, via `encodeForQuery` from `@shopware/api-client/helpers`) and call the GET route instead of sending a POST body. All other sessions keep using POST, see [Which sessions use GET](#which-sessions-use-get).

### Why GET over POST (the architectural decision)

Routing reads through GET is a deliberate Shopware platform decision, not just a frontend trick. The Store API [cache strategy](https://developer.shopware.com/docs/resources/references/adr/2025-09-15-store-api-cache-strategy.html) is to "prefer GET for non-mutating endpoints returning non-sensitive data", because GET responses are cacheable by default under HTTP semantics while POST responses are not. Several read routes historically defaulted to POST only so a large Criteria object could travel in the request body - and that body is exactly what makes them uncacheable.

The `_criteria` query parameter exists to remove that constraint. Its encoding - JSON -> gzip -> base64url - is defined by the platform, and `encodeForQuery` in `@shopware/api-client/helpers` implements precisely that format, keeping the Criteria small enough to travel in the URL for typical reads (very large criteria can still exceed environment URL-length limits). On the backend, `RequestCriteriaBuilder` decodes `_criteria` and rebuilds the same Criteria it would have parsed from a POST body, so the GET and POST variants return identical data. This is a transitional design: the interim approach until the HTTP `QUERY` method (a cacheable method that carries a body) is standardized.

The generated types do not declare `_criteria` on every GET route yet. That does not block a route: `useCacheableRead` builds the GET call itself. The reads listed further down stay on POST because they are not migrated yet, or on purpose.

### Enabling it

For a Nuxt app, set it as a module option in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  shopware: {
    cacheableReads: true, // route anonymous Store API reads through cacheable GET routes
  },
});
```

The flag is read from the public runtime config, so it is available on both server and client. For a non-Nuxt setup, pass it directly to `createShopwareContext`:

```ts
import { createShopwareContext } from "@shopware/composables";

const shopware = createShopwareContext(app, {
  cacheableReads: true,
});
app.use(shopware);
```

Inside a composable, do not read the flag. Call `useCacheableRead()` at setup and pass the POST operation and its params to `invokeRead`. It picks GET or POST on each request and returns the same type as `apiClient.invoke` for that operation:

```ts
const { invokeRead } = useCacheableRead();

async function fetchCountries() {
  const result = await invokeRead("readCountry post /country", {
    body: criteria,
  });
  return result.data;
}
```

A read can use GET only when its route is in the registry in `useCacheableRead`. A coverage test next to it fails when a read with a GET twin is in neither the registry nor its POST-only list, or when code calls a registered route without `invokeRead`.

### Which reads switch to GET

Exactly these composables read through `invokeRead`:

- `useNavigation`
- `useNavigationSearch` (`resolvePath`)
- `useCountries`
- `useUser` (`loadCountry` + `loadSalutation`)
- `useSalutations`
- `useInternationalization` (`getAvailableLanguages`)
- `useProductConfigurator`
- `useProductSearch` (single product detail)
- `useProductReviews`
- `useCategorySearch` (`search` for a single category, `advancedSearch` for the category list)

### Which sessions use GET

`invokeRead` checks the session on every request. It sends GET only when the session equals a fresh default guest: no customer (a guest account counts as one), an empty cart, and the sales channel's default language, currency, country, payment method and shipping method. When it cannot tell, it sends POST.

The GET is sent without `sw-context-token`, so the backend answers as it would for a fresh guest. The cached entry can never hold another visitor's data or token. Every other session sends the same POST as with the flag off.

The check needs the cart. With `useUserContextInSSR: true` the server render does not load it, so server-side reads stay POST. Outside Nuxt, provide `swSessionContext` and `swCart` refs on the app yourself, or reads stay POST once a context token exists.

The check only sees what the frontend has loaded. It cannot see:

- plugins that extend the cache hash, or cookies added to `shopware.http_cache.cookies`
- changes made in another tab with the same token
- state that changed but is not refreshed in the frontend yet

In those cases one session can get default guest data. Other visitors are never affected.

### Which reads stay on POST, and why

These reads have a GET twin but are not migrated yet:

- `useListing` (product listing and search) - always `readProductListing post /product-listing/{categoryId}` or `searchPage post /search`, tracked in [#2691](https://github.com/shopware/frontends/issues/2691). Shopware core [PR #17204](https://github.com/shopware/shopware/pull/17204) declared `_criteria` on `GET /store-api/product-listing` (released in 6.7.12.0).
- `useLandingSearch` - always `readLandingPage post /landing-page/{landingPageId}`

Reads that depend on the session, such as payment and shipping methods, stay on POST on purpose. The coverage test holds the full POST-only list, with a reason for each route.

Write and auth/context mutations (login, register, logout, `readCustomer`, `updateContext`, checkout) also stay on POST/PATCH regardless of the flag, because they are mutations and are not cacheable by design.

### How the criteria is encoded

`encodeForQuery` is a deterministic, pure function: it serializes the object with `JSON.stringify`, gzips it (via `fflate`), then base64url-encodes the result (no `+`, `/`, or `=`), producing a URL-safe value.

```ts
import { encodeForQuery } from "@shopware/api-client/helpers";

const criteria = { associations: { states: {} } };
const encoded = encodeForQuery(criteria); // gzip + base64url string, safe in a URL / cache key
```

Because it is deterministic, identical criteria produce an identical `_criteria` value and therefore an identical URL. That stable URL is what lets a CDN or browser register a cache hit. Object key order matters: "identical criteria" means an identical serialization, not merely a semantically equal object.

## Render layer: route rules (ISR, SWR, headers)

Shopware Frontends configures page-level HTTP caching declaratively through Nuxt's [`routeRules`](https://nuxt.com/docs/api/nuxt-config#routerules), not through Nitro's handler-level cache APIs (`defineCachedEventHandler` / `cachedFunction` are not used in the templates). The keys are glob patterns: exact paths (`/`), prefix wildcards (`/account/**`), and extension globs (`/**/*.svg`). Nuxt merges all matching rules, with more specific patterns taking precedence.

### `isr` - Incremental Static Regeneration

`isr: <seconds>` serves a cached static HTML response and revalidates it after the given window with stale-while-revalidate semantics. This is the primary strategy for storefront and catalog pages, which change infrequently relative to how often they are requested.

The `vue-demo-store` template uses a 24-hour window on the homepage and the catch-all:

```ts
routeRules: {
  "/": {
    isr: 60 * 60 * 24, // 86400s = 24h
  },
  "/checkout": {
    ssr: false,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  },
  "/checkout/**": { ssr: false },
  "/login": { ssr: false },
  "/register": { ssr: false },
  "/reset-password": { ssr: false },
  "/wishlist": { ssr: false },
  "/account": { ssr: false },
  "/account/**": { ssr: false },
  "/search": { ssr: false },
  "/search/**": { ssr: false },
  "/**": {
    isr: 60 * 60 * 24, // catch-all 24h ISR
  },
}
```

The `vue-starter-template` uses a shorter 60-minute window. The source comment captures the trade-off: increase it for mostly-static storefronts, decrease it for frequently updated content.

```ts
routeRules: {
  "/**": {
    // 60-minute ISR - increase for mostly-static storefronts, decrease for frequently updated content
    isr: 60 * 60, // 3600s
  },
  "/**/*.svg": {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable", // 1 year
    },
  },
  "/checkout": {
    ssr: false,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  },
  "/checkout/**": { ssr: false },
  "/account": { ssr: false },
  "/account/**": { ssr: false },
  "/wishlist": { ssr: false },
}
```

`vue-starter-template-extended` extends `../vue-starter-template` and defines no `routeRules` of its own, so it inherits the parent's caching. Nuxt layer extends merges parent route rules, so changes in the parent propagate to the child. `vue-blank` defines no `routeRules`, so default Nitro behavior (full SSR, no ISR) applies.

::: warning
ISR is only active in production builds and requires a runtime that can store and regenerate the cache (a Node server, Vercel, Netlify, or another Nitro-compatible host). Routes with `ssr: false` are client-rendered per request and are not ISR-cached. Exact stale-while-revalidate timing depends on the deployment target.
:::

### `swr` and `prerender`

`swr` (stale-while-revalidate without the static-build step) and `prerender` (generate the page at build time) are standard Nuxt route-rule modes documented under [Hybrid Rendering](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering). The Shopware Frontends templates do not ship a `prerender` or `swr` configuration - they default to ISR for cacheable routes - but both are available if your content profile suits them. To enable prerendering, add a `nitro.prerender` block or a `routeRules` entry with `prerender: true`.

### `headers` - per-route `Cache-Control`

Route rules can set HTTP `Cache-Control` directly. The templates use it two ways:

```ts
// Prevent any caching on sensitive routes
"/checkout": {
  ssr: false,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
  },
},
// Long-lived, immutable caching for static SVG assets
"/**/*.svg": {
  headers: {
    "Cache-Control": "public, max-age=31536000, immutable",
  },
},
```

`max-age=31536000` is one year; `immutable` tells clients never to revalidate, which is safe only for versioned/hashed or otherwise stable assets. Note the SVG rule exists in `vue-starter-template` (and its extended child) but not in `vue-demo-store`.

### Nitro cache storage

The templates do not customize Nitro's cache storage. `vue-demo-store`'s only `nitro` option is `compressPublicAssets: true`; `vue-starter-template` has no `nitro` block at all. The default Nitro cache driver is used (in-memory in dev, host-dependent in production). For multi-instance deployments, configuring a centralized store (Redis, etc.) via `nitro.storage` is recommended platform guidance.

## Rendering modes and the CSR fallback

The render layer pairs ISR (cacheable, server-rendered pages) with `ssr: false` (client-side rendering) for user-dynamic routes. Setting `ssr: false` disables server rendering for a route and ships an HTML shell that hydrates on the client - used in the templates for `/checkout`, `/account`, `/login`, `/register`, `/wishlist`, and `/search`, so personalized data is never baked into cacheable HTML.

These rendering modes (universal SSR, client-side, ISR, and the static/SPA options) are covered in depth in [Deployment](/best-practices/deployment.html); refer to that page for the full hosting and rendering-strategy discussion rather than re-deriving it here.

::: info
`experimental.payloadExtraction` is explicitly set to `false` in all three templates, keeping data serialization under explicit control via `useAsyncData` rather than relying on extracted payload files.
:::

## Backend HTTP cache and reverse proxy

The frontend layers stop at producing cacheable requests. Whether a GET response is actually stored, for how long, and with what cache key is decided by the Shopware backend HTTP cache and your reverse proxy (Varnish self-hosted, or Fastly on Shopware Cloud).

This is where `cacheableReads` pays off. By switching reads to GET with a deterministic `_criteria` URL, the request layer produces cacheable requests; the backend reverse proxy then applies `Cache-Control`, cache tags, `sw-cache-hash`, and invalidation. None of that is handled by the frontend `@shopware/api-client` - it only forwards Shopware Store API headers (`sw-access-key`, `sw-context-token`, `sw-language-id`, and so on) and refreshes the context token from non-public response headers. It reads `Cache-Control` only to ignore `sw-context-token` on publicly cacheable responses; it does not set `Cache-Control` or handle cache tags or `sw-cache-hash`.

When a route is cacheable, Shopware marks it with the `_httpCache` route attribute and the `CacheResponseSubscriber` emits a public `Cache-Control` header (the documented default for cacheable Store API routes is `public, max-age=0, s-maxage=1800, stale-while-revalidate=86400, stale-if-error=7200`; non-cacheable routes get `no-cache, private`). The backend sets `sw-language-id`, `sw-currency-id`, and `sw-cache-hash` response headers and adds them to `Vary`. Invalidation reuses Shopware's existing cache tags. See the [HTTP cache concept](https://developer.shopware.com/docs/concepts/framework/http_cache.html) and the [Store API cache strategy](https://developer.shopware.com/docs/resources/references/adr/2025-09-15-store-api-cache-strategy.html) for the full model.

A few consequences follow from how the backend cache works:

- A `sw-context-token` does not keep a GET response out of a shared cache. The cache looks up entries by URL and `Vary` headers, and the token is not one of them. This is why `invokeRead` sends GET only for fresh default guests.
- If the backend responds with `no-store`/`no-cache`, nothing is cached regardless of using GET.
- `cacheableReads` needs Shopware 6.7.6 or newer. Before that, the GET routes return `405` or ignore `_criteria`, so keep the flag off on older backends.

To configure the backend cache, follow the [Shopware reverse HTTP cache guide](https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html). The `_criteria` GET support is tracked in [Shopware issue #12388](https://github.com/shopware/shopware/issues/12388), referenced directly in the `encodeForQuery` source.

## Client state caching

Beyond HTTP, the storefront avoids redundant work by sharing in-memory state across the component tree. This is not a response cache keyed by request; it is shared reactive state that survives navigation but resets on a full page reload.

- **Shared composables.** `useCart`, `usePrice`, and `useProductSearchListing` are wrapped with VueUse's `createSharedComposable()`, so a single instance is reused across the app on the client. During SSR it automatically falls back to per-request (non-shared) mode to avoid cross-request state pollution.
- **Session, cart, user, listings.** State is held in shared refs under named injection keys (`swSessionContext`, `swCart`, `customer`, `swNavigation-${type}`, listing keys) via a `useContext` helper built on VueUse's `provideLocal`/`injectLocal`. Mutations reassign the shared ref so every consumer sees consistent state without refetching.
- **Single API client.** One Store API client is created per app and provided via `provide`/`inject`, so all composables share its `defaultHeaders` - including the `sw-context-token` it captures from non-public (private or uncached) response headers and reuses on subsequent requests. Tokens on `Cache-Control: public` responses are ignored, so a CDN hit cannot overwrite a logged-in session with a stale guest token.
- **Navigation reuse.** Navigation results are fetched once with `useAsyncData` (with stable keys for deduplication and hydration-payload serialization) and shared down the tree with `provide`/`inject` rather than refetched after hydration.

A couple of pieces of client state are also persisted durably outside memory: the `sw-context-token` is written to a cookie by the Nuxt plugin (so the session survives reloads and SSR), and `useLocalWishlist` persists wishlist ids to `localStorage`.

## Asset and image caching

Static assets and images get their own caching treatment.

- **SVGs and static assets** are served with the long-lived immutable `Cache-Control` header shown above (route rule `/**/*.svg`), so clients never revalidate them.
- **Images** are optimized through a custom Shopware `@nuxt/image` provider that maps `width`/`height`/`quality`/`format`/`fit` modifiers to CDN query parameters, plus named presets (`productCard`, `productDetail`, `hero`, `thumbnail`). When pre-generated Shopware thumbnails are available, helpers such as `getSrcSetForMedia` build a responsive `srcset` from them.

Image transforms only take effect when the backend supports remote/on-the-fly thumbnail generation (Fastly on Shopware Cloud, or self-hosted middleware such as Thumbor or imgproxy); otherwise the query parameters are ignored and the original image is served. For the full image workflow - providers, presets, thumbnails, srcset, and responsive sizing - see [Images](/best-practices/images.html).

## External resources

- [Nuxt: Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt: Hybrid Rendering / Route Rules](https://nuxt.com/docs/guide/concepts/rendering#hybrid-rendering)
- [Nuxt: `routeRules` config reference](https://nuxt.com/docs/api/nuxt-config#routerules)
- [Nuxt: `useAsyncData`](https://nuxt.com/docs/api/composables/use-async-data)
- [Nuxt: `useState`](https://nuxt.com/docs/api/composables/use-state)
- [Nitro: Cache guide](https://nitro.build/guide/cache)
- [Nitro: Deployment Presets](https://nitro.build/deploy)
- [MDN: `Cache-Control` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
- [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Shopware ADR: Store API caching strategy (GET over POST, `_criteria`)](https://developer.shopware.com/docs/resources/references/adr/2025-09-15-store-api-cache-strategy.html)
- [Shopware ADR: Improved HTTP cache layer](https://developer.shopware.com/docs/resources/references/adr/2025-11-03-improved-http-cache-layer.html)
- [Shopware: HTTP cache concept](https://developer.shopware.com/docs/concepts/framework/http_cache.html)
- [Shopware: Reverse HTTP cache (Varnish / reverse proxy)](https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html)
- [Shopware: Caches (hosting / performance)](https://developer.shopware.com/docs/guides/hosting/performance/caches.html)
- [Shopware: Store API concepts](https://developer.shopware.com/docs/concepts/api/store-api.html)
- [Shopware: Remote thumbnail generation](https://developer.shopware.com/docs/guides/plugins/plugins/content/media/remote-thumbnail-generation.html)
- [Shopware issue #12388: `_criteria` GET query parameter](https://github.com/shopware/shopware/issues/12388)
- [Shopware PR #17204: declare `_criteria` on `GET /store-api/product-listing`](https://github.com/shopware/shopware/pull/17204)
- [VueUse: `createSharedComposable`](https://vueuse.org/shared/createSharedComposable/)
- [VueUse: `createInjectionState`](https://vueuse.org/shared/createInjectionState/)
- [Vue 3: Provide / Inject](https://vuejs.org/guide/components/provide-inject.html)
- [fflate (gzip used by `encodeForQuery`)](https://github.com/101arrowz/fflate)
