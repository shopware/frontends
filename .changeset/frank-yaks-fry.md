---
"@shopware/cms-base-layer": patch
---

Fix product card and CMS image sizing to prevent duplicate/oversized image requests. Move fixed dimensions and `densities="1x"` into the `productCard` preset, and use `useElementSize`-based `width`/`height` props for `CmsElementImage`.
