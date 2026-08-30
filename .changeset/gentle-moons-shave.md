---
"@shopware/composables": minor
---

`useCmsElementImage` now honours the `ariaLabel` and `isDecorative` fields of a CMS image element, which were ignored before, and returns both. `imageAttrs.alt` is empty for a decorative image. `ariaLabel` names the link the image sits in, as it does in the Storefront, so it is not copied into `alt`.

Both fields are optional on the image element config, because a Shopware instance that has never had them set does not return them. `useCmsElementConfig` accepts optional config members now, so `getConfigValue` keeps the declared value type for them instead of widening to `{}`.

`SliderElementConfig` gained the `"none"` value for `navigationDots` and `navigationArrows`. The Administration offers it, the type did not list it.
