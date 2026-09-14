---
"@shopware/nuxt-module": patch
---

The cart state is now provided app-wide, and the plugin tells `createShopwareContext` when the server render runs without the visitor's session (`guestServerRender`). Cacheable reads use both to decide between GET and POST.
