---
"@shopware/nuxt-module": minor
---

`apiClientConfig.timeout` now works. Set it in milliseconds under `runtimeConfig.apiClientConfig` or `runtimeConfig.public.apiClientConfig`, next to `headers`, and the plugin forwards it to the API client. Unset by default. Only a positive number arms it, and a numeric string is coerced. Any other value is ignored and logged once as a warning naming the config path the value came from, instead of being dropped silently. It aborts a request whose response headers do not arrive in time, including one still opening its connection. It does not abort a response that stalls after its headers arrived.

`apiClientConfig` under the `shopware` module options is deprecated, and now works as a fallback. It had never been read before, so a value set there in the past becomes active with this release. It is read last, only when neither `runtimeConfig` path holds a valid value, and Nuxt warns at build time when a timeout is set there. Move to `runtimeConfig.apiClientConfig`; the fallback goes away in the next major.
