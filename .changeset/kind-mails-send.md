---
"@shopware/composables": patch
---

Correct `useNewsletter` `subscribeToNewsletter` return type: it now resolves to the Store API response type for `POST /newsletter/subscribe` instead of `void`.
