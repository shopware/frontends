---
"@shopware/cms-base-layer": patch
---

Disable automatic CMS LCP image preload by default.

The preload helper now only injects image preload tags when
`appConfig.lcpImagePreload` is explicitly enabled, which avoids noisy preload
warnings on storefront pages that do not immediately use the detected image.
