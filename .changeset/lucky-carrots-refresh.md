---
"@shopware/composables": patch
---

Refresh the cart after `register()`

`useUser().register()` changed the session context without refreshing the cart, while `login()` and `logout()` both did. Registration is the first point at which the backend learns the customer's billing country, which drives tax rates, shipping surcharges and customer-group prices, so the cart totals held in `useCart()` could stay at their pre-registration values while the order was placed at the recalculated ones. `register()` now calls `refreshCart()` after `refreshSessionContext()`, matching `login()` and `logout()`.
