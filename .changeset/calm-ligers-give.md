---
"@shopware-pwa/composables-next": patch
---

Added `shippingCosts` property in `useCart` composable that returns shipping costs of the cart, with the shipping discounts.
`shippingTotal` function is now deprecated as it only returns the first value from the array. The backend is returning a collection.
