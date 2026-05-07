---
"@shopware/composables": patch
---

Update `useNewsletter` so `newsletterStatus` is set from the subscribe API response, keeping `isNewsletterSubscriber` in sync without an extra status request.
