---
"@shopware/composables": patch
---

`useUrlResolver().resolveUrl` now only rewrites CMS links of the exact form `<segment>/navigation/<id>` (optionally followed by `#`, `?query` or a fragment), where `<segment>` is the Shopware SEO placeholder or a language code such as `en-GB`. That segment is dropped and the `urlPrefix` applied, as before.

Previously the pattern was unanchored, so any URL containing `x/navigation/y` lost its first `/`-separated segment. External links such as `https://example.com/foo/navigation/abc` became broken relative paths, relative paths such as `a/b/navigation/abc` lost `a`, and a crafted relative href like `x/javascript://…/navigation/b` could come out as a `javascript:` URL after passing the CMS sanitizer. Those URLs are now returned unchanged. Paths starting with `/` (e.g. `/en/navigation/123`) are also returned unchanged instead of being prefixed.
