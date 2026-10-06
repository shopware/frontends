---
"@shopware/cms-base-layer": patch
---

Fix a 500 on every page with a listing filter (`Cannot read properties of undefined (reading 'query')`) in projects that install the layer outside this monorepo. `useSelectedListingFilters` imported `useRoute` straight from `vue-router`, which the layer does not depend on, so it could resolve to a different `vue-router` copy than the one Nuxt's router uses and get no route back. It now uses Nuxt's `useRoute`, and `SwCategoryNavigationLink` renders `NuxtLink` instead of importing `RouterLink` from `vue-router` for the same reason. The pure filter-state helpers moved from `app/utils/useSelectedListingFilters.ts` to `app/utils/listingFilterState.ts`; their auto-imported names are unchanged.
