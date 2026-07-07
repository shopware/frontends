---
"@shopware/api-client": patch
---

Split the `createAPIClient` tests so Node and browser behavior are each tested in the right environment:

- Node (`createApiClient.test.ts`): keeps the multipart `Content-Type`, aborts with `This operation was aborted`.
- Browser (`createApiClient.browser.test.ts`, runs in `happy-dom`): drops the multipart `Content-Type`, aborts with `signal is aborted without reason`.

Previously a stray `@vitest-environment` comment ran the whole suite in browser mode, so the Node paths were never actually checked.
