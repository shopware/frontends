---
"@shopware/composables": patch
---

Fall back `getStorefrontUrl()` to a sales channel domain

`useUser().register()` injects `storefrontUrl` from `getStorefrontUrl()`. Shopware rejects that value unless it matches a **Sales Channel → Domains** entry, so guest checkout against the public demo (`devStorefrontUrl` pointing at the starter Vercel host) never reached `POST /checkout/order`.

`getStorefrontUrl()` now uses the preferred URL when it is one of the current sales channel domains, and otherwise the domain for the active language (or the first configured domain).
