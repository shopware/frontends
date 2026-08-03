---
"@shopware/api-client": patch
---

Fix file uploads and other binary requests. The client no longer forces the default `Content-Type: application/json` onto `FormData`, `Blob`/`File`, `URLSearchParams`, or binary/stream bodies, so the runtime can set the right content type itself (e.g. `multipart/form-data` with a boundary). Just pass the body and leave `Content-Type` alone.

On a `FormData` body the client now also drops a `Content-Type` you set yourself when it carries no `boundary`. Only the runtime knows the boundary, and it reaches the server through that header, so keeping the header made the upload arrive as unparseable bytes with no error.
