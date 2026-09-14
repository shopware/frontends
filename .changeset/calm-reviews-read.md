---
"@shopware/cms-base-layer": patch
---

`CmsElementProductDescriptionReviews` loads reviews through `useCacheableRead().invokeRead`, so they use the cacheable GET route only when the loaded session looks like a fresh default guest.
