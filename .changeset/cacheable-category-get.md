---
"@shopware/composables": patch
"@shopware/cms-base-layer": patch
---

Add cacheable GET support for category details and product reviews while preserving the existing POST behavior when `cacheableReads` is disabled.

- `useCategorySearch.search` now calls `GET /category/{navigationId}` and sends the complete encoded Criteria in the `_criteria` query parameter when cacheable reads are enabled.
- `useProductReviews.loadProductReviews` now calls `GET /product/{productId}/reviews` and sends its encoded Criteria in `_criteria` when cacheable reads are enabled.
- The CMS product description reviews element follows the same flag and endpoint behavior when it needs to fetch reviews directly.
