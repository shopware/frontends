---
"@shopware/api-client": patch
---

Added `onRequest` hook to the API client that is triggered before each request is made. This hook provides access to the request context, allowing for request inspection and modification before it's sent.
