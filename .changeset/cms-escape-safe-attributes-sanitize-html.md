---
"@shopware/cms-base-layer": patch
---

Escape attribute values in CMS text exactly once, and sanitize the HTML element and the customer group registration introduction.

- `CmsElementText`: attribute values are now entity-decoded before rendering, so Vue escapes them once. `href="/x?a=1&amp;b=2"` no longer renders as `&amp;amp;`. After decoding, URL attributes (`href`, `src`, `action`, `formaction`, `poster`, `cite`, `background`, `xlink:href`) with a `javascript:`, `vbscript:` or `data:` scheme are dropped. This also catches schemes hidden behind entities or tab and newline characters (`javascript&colon;`, `java&Tab;script:`). The one exception is a raster `data:image/…` in `src`.
- **`CmsElementHtml` and the registration introduction on `FrontendAccountCustomerGroupRegistrationPage` are now sanitized** with the default `xss` whitelist on both SSR and the client. `CmsElementProductDescriptionReviews` already used the same whitelist. Merchant HTML in the HTML element changes in these ways:
  - Tags outside the whitelist are escaped and appear as visible text instead of rendering. This affects `iframe` (video and map embeds), `script`, `style`, `link`, `form`, `input`, `button`, `select`, `option`, `textarea`, `label`, `svg`, `object`, `embed` and `source`.
  - Attributes outside each tag's whitelist are removed. This includes `class`, `id`, `style`, `role`, every `data-*` and `aria-*` attribute and every `on*` event handler. On links only `href`, `title` and `target` remain, so `rel` is removed too. On images only `src`, `alt`, `title`, `width`, `height` and `loading` remain.
  - `javascript:` and similar URLs are removed from `href` and `src`.

  If you need embeds or custom markup in the HTML element, override `CmsElementHtml` in your project.
