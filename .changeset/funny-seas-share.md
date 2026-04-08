---
"@shopware/nuxt-module": patch
---

Fix SSR and CSR Shopware endpoint handling in the Nuxt module.

The module now persists the resolved SSR endpoint into private runtime config,
avoids reading private runtime config on the client, and correctly honors both
`endpoint` and deprecated `shopwareEndpoint` values during server rendering.
