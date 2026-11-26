---
"react-starter-template": patch
---

Only rewrite CMS rich-text links of the form `<segment>/navigation/<id>` in `resolveCmsUrl`. The pattern is now anchored, so absolute, protocol-relative, `mailto:`/`tel:` and deeper relative URLs that merely contain `/navigation/` are left untouched instead of losing their first segment.

An overlong URL (over 2083 characters) is now returned unchanged instead of throwing, so a single such CMS link no longer sends the whole page to the error boundary.
