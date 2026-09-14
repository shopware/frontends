---
"@shopware/api-client": minor
---

Header names now merge case-insensitively. A header set to `""` is removed from the request. A response to a request with an empty `sw-context-token` never changes the client's token. Added `mergeRequestHeaders` to `@shopware/api-client/helpers`. Dropped the `defu` dependency.
