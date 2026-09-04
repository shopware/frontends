---
"@shopware/nuxt-module": minor
---

`apiClientConfig.timeout` now works. Set it in milliseconds under `runtimeConfig.apiClientConfig` or `runtimeConfig.public.apiClientConfig`, next to `headers`, and the plugin forwards it to the API client. Unset by default, and only a positive number arms it. It guards against requests that hang, not connection failures.

`apiClientConfig` is removed from the `shopware` module options, where it never did anything. Move it to `runtimeConfig.apiClientConfig`.
