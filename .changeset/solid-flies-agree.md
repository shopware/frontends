---
"@shopware/api-client": patch
---

Fix file uploads and other binary requests. The client no longer forces the default `Content-Type: application/json` onto `FormData`, `Blob`/`File`, `URLSearchParams`, or binary/stream bodies, so the runtime can set the right content type itself (e.g. `multipart/form-data` with a boundary). Just pass the body and leave `Content-Type` alone.
