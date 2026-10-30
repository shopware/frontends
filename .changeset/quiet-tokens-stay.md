---
"@shopware/api-client": minor
---

Header names now merge case-insensitively. A header set to `""` is removed from the request. A response to a request with an empty `sw-context-token` never changes the client's token. The Store API `invoke` types `sw-context-token` as a header of every operation. Added `mergeRequestHeaders` and its `RequestHeaders` type to `@shopware/api-client/helpers`. It takes boolean header values and returns strings. Exported the `ClientHeaders` and `ClientHeadersProxy` types. Dropped the `defu` dependency.
