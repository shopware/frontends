---
"@shopware/api-client": patch
---

Stop adopting `sw-context-token` from publicly cacheable Store API responses. CDN hits for `cacheableReads` GETs can replay a guest token from when the entry was stored, which overwrote the logged-in session and logged users out when navigating to account pages (e.g. before `account/newsletter-recipient`).
