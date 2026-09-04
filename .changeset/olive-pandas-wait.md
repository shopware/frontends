---
"@shopware/nuxt-module": minor
---

`apiClientConfig.timeout` now works. Set it in milliseconds under `runtimeConfig.apiClientConfig` or `runtimeConfig.public.apiClientConfig`, next to `headers`, and the plugin forwards it to the API client. Unset by default, and only a positive number arms it. It guards against requests that hang, not connection failures.

`apiClientConfig` under the `shopware` module options is deprecated. It has never been read, so setting it there does nothing. Use `runtimeConfig.apiClientConfig` instead. The deprecated option goes away in the next major.
