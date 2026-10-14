---
"@shopware/composables": patch
---

Retry loading order details with `checkPromotion` as a query parameter when `paymentChangeable` is missing, so Shopware 6.7.7+ calculates it correctly while Shopware 6.6 and 6.7.0-6.7.6 keep working.
