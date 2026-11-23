---
"react-starter-template": patch
---

Security hardening: the rich-text sanitizer now decodes `href` and `src` values with the `entities` package before its URL safety check. xss's `friendlyAttrValue` left named entities such as `&Tab;`, `&NewLine;` and `&colon;` undecoded, so `java&Tab;script:alert(1)` passed the check and the browser turned it back into a working `javascript:` link. `src` values now go through the same check, which also keeps relative image paths, and `sms:` links are kept.
