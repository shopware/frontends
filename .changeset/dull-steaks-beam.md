---
"@shopware-pwa/nuxt3-module": minor
---

Added new config `useUserContextInSSR` - set to true if you want for the server to use session from cookie and prepare view with it. Use carefully with edge caching to avoid sharing user data with edge cache. Default is false, so server will always use new context to prepare rendered view.
