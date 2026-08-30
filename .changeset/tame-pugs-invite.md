---
"@shopware/cms-base-layer": patch
---

A linked CMS image always has an accessible name now. `CmsElementImage` names the link with the element's `ariaLabel`, then the media title, then a generic fallback translatable through `cms.image.linkWithoutLabel`. A decorative image skips the media title.
