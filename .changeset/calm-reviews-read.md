---
"@shopware/cms-base-layer": patch
---

`CmsElementProductDescriptionReviews` loads reviews through `useCacheableRead().invokeRead`, so only a fresh default guest reads them from the cacheable GET route.
