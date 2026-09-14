---
"@shopware/api-client": patch
---

A request header set to an empty string is no longer sent, so one call can drop a default header such as `sw-context-token`. A response to a request that leaves out the client's `sw-context-token` no longer replaces it.
