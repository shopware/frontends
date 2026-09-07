---
"@shopware/nuxt-module": minor
---

`apiClientConfig.timeout` now works. Set it in milliseconds under `runtimeConfig.apiClientConfig` or `runtimeConfig.public.apiClientConfig`, next to `headers`, and the plugin forwards it to the API client. Unset by default, and only a positive number arms it. It aborts a request whose response headers do not arrive in time. It does not cover connection failures or a response that stalls after its headers arrived.

`apiClientConfig` under the `shopware` module options is deprecated, and now works as a fallback. It had never been read before, so a value set there in the past becomes active with this release. It is read last, only when neither `runtimeConfig` path is set, and Nuxt warns at build time when it is set. Move to `runtimeConfig.apiClientConfig`; the fallback goes away in the next major.
