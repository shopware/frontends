---
"@shopware/api-client": minor
---

Added `isTimeoutError()` to tell a request that ran into `fetchOptions.timeout` apart from other errors. Such a request rejects without an HTTP status, so `instanceof ApiClientError` does not match it. The request may already have reached the API and been processed, so the server-side outcome is unknown, and a mutation must not be retried without checking.

A per-request `signal` no longer switches off `timeout`. Both are combined, so whichever fires first aborts the request. Before, ofetch ignored `timeout` as soon as a `signal` was set. Combining needs `AbortSignal.any`; browsers without it keep the old behaviour. The admin client forwards the signal and timeout to its token refresh as well.
