---
"@shopware/cms-base-layer": patch
---

Typography for CMS-authored HTML is now scoped to a `cms-element-text` class and ships from the layer as `app/assets/css/rich-text.css`, with overflow guards for long strings, media, `pre` and tables. Headings and lists in your own markup that had no explicit size or `list-*` class were relying on the removed global rules and will change.
