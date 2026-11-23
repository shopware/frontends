---
"react-starter-template": patch
---

Security hardening: the rich-text sanitizer now decodes `href` and `src` values with the `entities` package before its URL safety check. xss's `friendlyAttrValue` left named entities such as `&Tab;`, `&NewLine;` and `&colon;` undecoded, so `java&Tab;script:alert(1)` passed the check and the browser turned it back into a working `javascript:` link.

Behaviour changes:

- `src` values go through the same check and allow only relative paths, `http(s):` and raster `data:image/(png|gif|jpeg|webp|avif)` URLs. Relative image paths are now kept; `data:image/svg+xml` and `ftp:` sources are dropped.
- `href` and `src` are removed from tags whose whitelist does not allow them (before, `<div href="…">` kept its `href`).
- `sms:` links are kept and render as a plain `<a>`, not `next/link`.
