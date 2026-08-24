---
"@shopware/composables": minor
"@shopware/cms-base-layer": patch
---

CMS image elements now honour the `ariaLabel` and `isDecorative` fields, which were ignored before. `useCmsElementImage` returns both.

A linked image always has an accessible name now. It uses `ariaLabel`, then a generic fallback translatable through `cms.image.linkWithoutLabel`.
