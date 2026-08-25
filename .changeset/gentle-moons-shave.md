---
"@shopware/composables": minor
---

`useCmsElementImage` now honours the `ariaLabel` and `isDecorative` fields of a CMS image element, which were ignored before, and returns both. `imageAttrs.alt` falls back to `ariaLabel` and is empty for a decorative image.
