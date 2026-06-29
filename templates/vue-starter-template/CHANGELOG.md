# vue-starter-template

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
