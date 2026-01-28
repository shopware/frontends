---
"@shopware/composables": patch
---

Fixed `getDocumentFile` return type in `useOrderDetails` to correctly return `Blob | string` instead of `Document` schema.
