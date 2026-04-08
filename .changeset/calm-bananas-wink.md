---
"@shopware/helpers": patch
"@shopware/composables": patch
---

Improve technical URL resolution for SSR and CSR page rendering.

This adds helpers to detect and normalize technical Shopware paths and updates
`useNavigationSearch` to resolve `/navigation/*`, `/detail/*`, and
`/landingPage/*` routes more reliably, including fallback behavior when no SEO
mapping row is returned.
