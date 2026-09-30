---
"@shopware/composables": patch
---

`useCategorySearch().search()` with `withCmsAssociations: true` now requests the CMS associations. Before, it nested them one level too deep, so the backend ignored them.
