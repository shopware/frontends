---
"@shopware/api-client": minor
---

Request headers now merge with the default headers case-insensitively, so a request header wins over a default in any casing. A header set to an empty string is not sent, in any casing, so one call can drop a default header such as `sw-context-token`. The response to a request with an empty `sw-context-token` never sets or replaces the client's token. Added `mergeRequestHeaders` to `@shopware/api-client/helpers`.
