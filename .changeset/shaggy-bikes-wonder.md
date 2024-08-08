---
"@shopware-pwa/nuxt3-module": patch
---

Improvements within a nuxt module and the plugin:

- properly loading a `sw-context-token` cookie in SSR
- registering an API client instance provided as a Nuxt plugin
- adds corresponding types

```ts
const { $shopwareApiInstance } = useNuxtApp();

await $shopwareApiInstance.invoke("readContext get /context");
```
