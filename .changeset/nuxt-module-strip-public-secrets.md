---
"@shopware/nuxt-module": minor
---

Security hardening: secret-like keys are no longer exposed in `runtimeConfig.public.shopware`. The module used to copy every `shopware` module option into public runtime config, which is serialized into the page payload, so Admin API credentials placed next to `endpoint` and `accessToken` reached every visitor.

Secret-like keys are now removed from public config at any depth, case-insensitively, whether they come from the module options or from `runtimeConfig.public.shopware`. They include keys containing `clientId`, `secret`, `password`, `privateKey`, `apiKey`, `accessKeyId` or `authorization`, keys starting with `adminApi`, `*Token` keys other than `accessToken` and `shopwareAccessToken`, and `username` under a credentials-like parent. Removed keys are moved to private `runtimeConfig.shopware`, without overriding values already set there. Secret-like keys inside array entries are removed from public config but not moved. The module logs a warning with the path of each one. `accessToken`, `endpoint`, `devStorefrontUrl` and the other options the module reads on the client stay public.

The check runs at build time only. `NUXT_PUBLIC_SHOPWARE*` environment variables applied at runtime and modules that write to `public.shopware` later are not filtered. Keep secrets in private `runtimeConfig`, set them with `NUXT_*` (never `NUXT_PUBLIC_*`) environment variables, and read them only in `server/` routes.
