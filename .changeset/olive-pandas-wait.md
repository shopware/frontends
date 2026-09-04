---
"@shopware/nuxt-module": minor
---

`apiClientConfig.timeout` now works. Set it in milliseconds under `runtimeConfig.apiClientConfig` or `runtimeConfig.public.apiClientConfig`, next to `headers`, and the plugin forwards it to the API client. Unset by default, and only a positive number arms it. It guards against requests that hang, not connection failures.

`apiClientConfig` under the `shopware` module options is deprecated, and now works as a fallback. It had never been read before, so setting it there did nothing. It is read last, only when neither `runtimeConfig` path is set. Move to `runtimeConfig.apiClientConfig`; the fallback goes away in the next major.
