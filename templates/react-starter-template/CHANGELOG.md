# react-starter-template

## 0.0.3

### Patch Changes

- [#2908](https://github.com/shopware/frontends/pull/2908) [`fb818d1`](https://github.com/shopware/frontends/commit/fb818d1b86ae8a1fa7499071afbe7e56ed6345e5) Thanks [@patzick](https://github.com/patzick)! - Security hardening: the rich-text sanitizer now decodes `href` and `src` values with the `entities` package before its URL safety check. xss's `friendlyAttrValue` left named entities such as `&Tab;`, `&NewLine;` and `&colon;` undecoded, so `java&Tab;script:alert(1)` passed the check and the browser turned it back into a working `javascript:` link.

  Behaviour changes:

  - `src` values go through the same check and allow only relative paths, `http(s):` and raster `data:image/(png|gif|jpeg|webp|avif)` URLs. Relative image paths are now kept; `data:image/svg+xml` and `ftp:` sources are dropped.
  - `href` and `src` are removed from tags whose whitelist does not allow them (before, `<div href="…">` kept its `href`).
  - `href`, `src` and `data-*` values are written with `<` and `>` escaped, so a value holding `</iframe>` can no longer close an allowed iframe early.
  - `sms:` links are kept and render as a plain `<a>`, not `next/link`.

## 0.0.2

### Patch Changes

- Updated dependencies [[`9ec153c`](https://github.com/shopware/frontends/commit/9ec153cc96ef6a0ede1780da378fbb6309d5e1a1)]:
  - @shopware/design-tokens@0.1.0
