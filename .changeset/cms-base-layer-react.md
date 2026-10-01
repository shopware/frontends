---
"@shopware/cms-base-layer-react": minor
---

Added `@shopware/cms-base-layer-react`, the React Server Components port of `@shopware/cms-base-layer`. It renders Shopware Shopping Experiences pages in Next.js: `CmsPage` with the default and sidebar sections, every block and element of the Vue layer, a registry (`defaultCmsRegistry`, `mergeCmsRegistries`) in place of Vue's global component resolution, a `CmsContext` in place of `provide`/`inject`, an actions port (`CmsActionsProvider`) for cart, wishlist, variant and form interactions, and URL-based listing state (`useListingNavigation`).
