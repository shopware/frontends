---
'@shopware/nuxt-module': minor
---

Add retry configuration for API client to handle transient backend failures. New options: retry (number of retries), retryDelay (milliseconds between retries), and retryStatusCodes (HTTP status codes to retry on). Configure these in runtimeConfig.apiClientConfig or runtimeConfig.public.apiClientConfig.
