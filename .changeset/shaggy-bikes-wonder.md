---
"@shopware-pwa/nuxt3-module": patch
---

Improvements within a nuxt module and the plugin:

- properly loading a `sw-context-token` cookie in SSR
- exposing an [API client](https://www.npmjs.com/package/@shopware/api-client) instance provided in a nuxt plugin
- adds corresponding types

```ts
// works also in a route middleware
const { $shopwareApiClient } = useNuxtApp();

await $shopwareApiClient.invoke("readContext get /context");
```
