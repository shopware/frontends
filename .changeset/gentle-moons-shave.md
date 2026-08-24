---
"@shopware/composables": minor
"@shopware/cms-base-layer": patch
---

`useCmsElementImage` now reads the `ariaLabel` and `isDecorative` fields that Shopware already ships on the CMS image element and were previously ignored.

`imageAttrs.alt` falls back to `ariaLabel` when the media has no alt text, and is forced to an empty string when the element is marked decorative. The composable also returns `ariaLabel` and `isDecorative`.

`CmsElementImage` renders images that link somewhere as an `<a>`. When the image had no alt text the link had no accessible name at all, which axe reports as a serious `link-name` violation. The link now falls back to a generic `aria-label`, translatable through `cms.image.linkWithoutLabel`. Set alt text or the aria label in the Administration to get a better name than the fallback.
