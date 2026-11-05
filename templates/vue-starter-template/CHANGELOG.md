# vue-starter-template

## 0.1.5

### Patch Changes

- [#2825](https://github.com/shopware/frontends/pull/2825) [`0b5de57`](https://github.com/shopware/frontends/commit/0b5de57fe1149212fd7274b6f530495a245742b5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `data-testid` and `data-*` state attributes to the wishlist toggle, variant options, sort dropdown, pagination and top navigation, so e2e tests no longer depend on translated text or CSS classes. Sort options are now `menuitemradio` items with `aria-checked`, so screen readers announce the active sort.

- [#2835](https://github.com/shopware/frontends/pull/2835) [`22c1b4f`](https://github.com/shopware/frontends/commit/22c1b4fb2a34e351ff4e84e7f198cfc306f9fb5f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Support Nuxt 4.6. `@shopware/nuxt-module` and `@shopware/cms-base-layer` now depend on `@nuxt/kit` 4.6.1, and the Nuxt plugin types `ssrContext.event` from `NuxtSSRContext`, so it type-checks on both Nuxt 4.5 and 4.6. The Nuxt templates require Node `^22.22.3 || ^24.15.0 || >=26.0.0`, the range Nuxt 4.6 supports. `@shopware/unocss-design-tokens-layer` no longer re-exports its generated `.nuxt/imports` from `index.d.ts`, which pulled server routes into the shared type context of apps extending the layer.

- [#2834](https://github.com/shopware/frontends/pull/2834) [`2d3987c`](https://github.com/shopware/frontends/commit/2d3987c201db2f437af2785eed7948e958399cda) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Give the Guided setup banner `<aside>` an accessible name and translate the CMS sidebar label, using the new `layout.ariaLabels.guidedSetup` and `layout.ariaLabels.contentSidebar` keys in en-GB, de-DE and pl-PL, so the category page passes the axe `landmark-unique` rule.

## 0.1.4

### Patch Changes

- [#2724](https://github.com/shopware/frontends/pull/2724) [`c78188a`](https://github.com/shopware/frontends/commit/c78188ac6c95ae19b070f5ea3361a60f21dff281) Thanks [@patzick](https://github.com/patzick)! - Fix starter checkout guest orders and client-side validation

  Checkout now validates email and address on submit even when the fields were never focused, so an empty form no longer hits the Store API. Guest checkout is the default again, with a "Continue as guest" control after "Create customer account", zip/state rules, and a single "Confirm and place order" action that creates the guest session then the order.

  Point `devStorefrontUrl` at `https://demo-frontends.shopware.store/figma`, the only domain listed for the demo sales channel. Guest register still needs a URL that exists under **Sales Channel → Domains**; `getStorefrontUrl()` now falls back to a domain from the session context when the preferred URL is not listed, so checkout can reach `POST /checkout/order`.

## 0.1.3

### Patch Changes

- [#2571](https://github.com/shopware/frontends/pull/2571) [`c64ae1c`](https://github.com/shopware/frontends/commit/c64ae1c6e2d11e33bd52df4b55177cc26b646433) Thanks [@patzick](https://github.com/patzick)! - Show the category a shopper came from in product breadcrumbs, while direct product links continue to use the default category.

- [#2538](https://github.com/shopware/frontends/pull/2538) [`b4c409c`](https://github.com/shopware/frontends/commit/b4c409c35f103656f1972d67133380ef04f92f1d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `FormCountrySearchSelect`, a searchable country picker with flag icons, paginated Store API loading, keyboard navigation, and single-country mode. Use it in registration, account address, checkout, and `CountryStateInput`, and require the state field only when the selected country has states.

- [#2568](https://github.com/shopware/frontends/pull/2568) [`6315350`](https://github.com/shopware/frontends/commit/6315350add0464abef153343897d42f5808f2003) Thanks [@patzick](https://github.com/patzick)! - Load category and product breadcrumbs after hydration so they no longer block the primary SSR response. Abort stale breadcrumb requests during navigation and animate the complete breadcrumb trail as a single transition while reserving its row height to avoid layout shifts.

## 0.1.2

### Patch Changes

- [#2470](https://github.com/shopware/frontends/pull/2470) [`bc8a57a`](https://github.com/shopware/frontends/commit/bc8a57ac7cada68234267e9b17e00b71569a0cb2) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add a currency switcher to the starter template meta navigation. The switcher loads available Store API currencies, updates the Shopware session context, refreshes the cart, and reloads the storefront data so prices use the selected currency.

- [#2510](https://github.com/shopware/frontends/pull/2510) [`6f063bc`](https://github.com/shopware/frontends/commit/6f063bcf3dac1e9582a952b86eb588735f80d1e0) Thanks [@patzick](https://github.com/patzick)! - Migrate template linting and formatting from Biome to Oxlint and Oxfmt.

## 0.1.1

### Patch Changes

- [#2371](https://github.com/shopware/frontends/pull/2371) [`33e0c69`](https://github.com/shopware/frontends/commit/33e0c69afc3de854733ab61f866ba65cce1489f6) Thanks [@patzick](https://github.com/patzick)! - Fix catch-all page resolution for technical Shopware routes and serve Nuxt dev's
  `/dev-sw.js` request as a static asset in the Nuxt templates.

- [#2435](https://github.com/shopware/frontends/pull/2435) [`b8c0091`](https://github.com/shopware/frontends/commit/b8c00913c3afb5e1e63de9565105f8f8e3bf299f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove the extra newsletter status call after subscribing on the account overview now that `useNewsletter` syncs from the API response.

- [#2406](https://github.com/shopware/frontends/pull/2406) [`df93461`](https://github.com/shopware/frontends/commit/df93461434cb79ec9d722cdbd42a37a9af07fb03) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Extend `@shopware/unocss-design-tokens-layer` in `nuxt.config.ts`, add the workspace dependency, simplify `uno.config.ts` to build on the shared token layer, and document the layered UnoCSS setup in the README.

- [#2447](https://github.com/shopware/frontends/pull/2447) [`8fb3fb0`](https://github.com/shopware/frontends/commit/8fb3fb05d925408be825f209f871026636b95d50) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Use product Open Graph SEO fields for detail pages, including `ogTitle`, `ogDescription`, and `openGraphMedia`.

## 0.1.0

### Minor Changes

- [#1959](https://github.com/shopware/frontends/pull/1959) [`c77daa6`](https://github.com/shopware/frontends/commit/c77daa6a11e96c7f3688b16f7da010b54c7f5e8b) Thanks [@patzick](https://github.com/patzick)! - Updated default types to Shopware 6.7
