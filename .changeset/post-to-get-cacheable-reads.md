---
"@shopware/composables": minor
"@shopware/nuxt-module": minor
---

Add an opt-in `cacheableReads` flag that routes anonymous Store API reads through their cacheable GET variants instead of POST. Criteria is compressed into the `_criteria` query param via `encodeForQuery` from `@shopware/api-client/helpers`, which lets CDNs / reverse proxies / the browser cache the responses.

Disabled by default — fully backwards compatible. Enable it in `nuxt.config` (`shopware: { cacheableReads: true }`) or via `createShopwareContext(app, { cacheableReads: true })` for non-Nuxt setups. It is surfaced on the Shopware context and read by the affected composables; public composable signatures are unchanged.

Affected composables: `useNavigation`, `useNavigationSearch`, `useCountries`, `useUser` (country + salutation lookups), `useSalutations`, `useInternationalization`, `useProductConfigurator`, `useProductSearch`, and `useCategorySearch.advancedSearch`.

`useListing` (product-listing), single-category `useCategorySearch.search`, and `useLandingSearch` remain POST for now: the generated Store API schema does not type `_criteria` on those GET routes (a Shopware OpenAPI gap). The backend does honor `_criteria` on product-listing GET at runtime, so that one can be migrated later once the types are augmented.
