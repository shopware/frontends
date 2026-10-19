---
"@shopware/composables": patch
---

Send `checkPromotion` as a query parameter when loading order details, so Shopware 6.7.7+ calculates `paymentChangeable`. When the order has no `paymentChangeable` entry, retry once with the flag in the request body, so Shopware 6.6 and 6.7.0-6.7.6 keep working.
