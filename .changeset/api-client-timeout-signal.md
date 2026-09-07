---
"@shopware/api-client": minor
---

Added `isTimeoutError()` to tell a request that ran into `fetchOptions.timeout` apart from other errors. Such a request never reaches the API, so it rejects with a plain `FetchError` without an HTTP status, and `instanceof ApiClientError` does not match it.

A per-request `signal` no longer switches off `timeout`. Both are combined, so whichever fires first aborts the request. Before, ofetch ignored `timeout` as soon as a `signal` was set. Combining needs `AbortSignal.any`; browsers without it keep the old behaviour.
