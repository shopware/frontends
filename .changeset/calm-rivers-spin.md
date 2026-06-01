---
"@shopware/composables": patch
---

`useProductAssociations`: add optional `includeSeoUrls` option. When `true`, the cross-selling request sends `sw-include-seo-urls: true` so returned products include the `seoUrls` association. Defaults to `false` to avoid extra backend overhead.
