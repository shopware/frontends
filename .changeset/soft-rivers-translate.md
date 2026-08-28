---
"@shopware/composables": patch
---

`useCmsElementImage` now returns the translated media `alt` in `imageAttrs`. It read `element.data.media.alt` from the entity root, which the Store API fills with the system language value, so the `alt` attribute ignored the language of the current request. The value is now resolved with `getTranslatedProperty()` and falls back to the root property when `translated` is missing.
