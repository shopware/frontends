---
"@shopware/nuxt-module": patch
---

The cart state is now app-wide. The plugin sets `ssrWithoutUserContext` for server renders without a visitor session.
