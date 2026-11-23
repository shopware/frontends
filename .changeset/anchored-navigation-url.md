---
"react-starter-template": patch
---

Only rewrite CMS rich-text links of the form `<segment>/navigation/<id>` in `resolveCmsUrl`. The pattern is now anchored, so absolute, protocol-relative, `mailto:`/`tel:` and deeper relative URLs that merely contain `/navigation/` are left untouched instead of losing their first segment.
