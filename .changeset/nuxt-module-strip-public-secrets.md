---
"@shopware/nuxt-module": minor
---

Security hardening: secret-like keys are no longer exposed in `runtimeConfig.public.shopware`. The module used to copy every `shopware` module option into public runtime config, which is serialized into the page payload, so Admin API credentials placed next to `endpoint` and `accessToken` reached every visitor.

Keys such as `client_id`, `clientSecret`, `password`, `privateKey`, `adminApi*` and anything containing `secret` are now removed from public config at any depth, case-insensitively, whether they come from the module options or from `runtimeConfig.public.shopware`. They stay in private `runtimeConfig.shopware`, and the module logs a warning with the path of each removed key. `accessToken`, `endpoint` and `devStorefrontUrl` stay public.

Keep secrets in private `runtimeConfig`, set them with `NUXT_*` environment variables, and read them only in `server/` routes.
