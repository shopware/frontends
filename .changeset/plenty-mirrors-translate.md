---
"@shopware/cms-base-layer": patch
---

Read translatable entity fields through their `translated` object instead of the untranslated entity root, so they follow the language of the current request instead of rendering the system language. Affected components: `SwContactForm` and `SwNewsletterForm` (salutation `displayName`), `SwStockInfo` (delivery time `name`), `SwVariantConfigurator` (property group `name` — the option values below it already used `translated`), `CmsElementBuyBox` (unit `name`), `CmsElementCrossSelling` (cross selling `name`), `CmsElementProductDescriptionReviews` (category `name`), `SwProductCardImage` and `CmsElementImageGallery` (media `alt`).

All of them now go through `getTranslatedProperty()` from `@shopware/helpers`, which falls back to the root property when `translated` is missing — so the rendered value only ever changes on storefronts whose language differs from the system language.
