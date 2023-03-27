---
"@shopware-pwa/nuxt3-module": minor
---

**BREAKING**: Remove default config and use Nuxt runtime config

change your `nuxt.config.js` from:

```ts
export default defineNuxtConfig({
  ///...
  shopware: {
    shopwareEndpoint: "http://localhost:8000",
    shopwareAccessToken: "your-access-token",
  },
  ///...
});
```

to

```ts
export default defineNuxtConfig({
  ///...
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "http://localhost:8000",
        shopwareAccessToken: "your-access-token",
      },
    },
  },
  ///...
});
```
