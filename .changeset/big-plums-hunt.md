---
"@shopware-pwa/composables-next": minor
---

Few changes in composables API to access data returned from the backend:

- `useAddress` - `loadCustomerAddresses` returns addresses now
- `useCart` - `removeItem` returns updated cart
- `useCartItem` - `removeItem` returns updated cart, similar to `useCart`
- `fetchCountries` - returns countries with the response
- `useNewsletter` - `getNewsletterStatus` returns full response from the API
- `useOrderDetails` - `loadOrderDetails` returns order details now, `cancel` returns order state, `changePaymentMethod` returns success response info
- `changePaymentMethod` - `changePaymentMethod` returns success response info now
- `useProductReviews` - `loadProductReviews` returns reviews response now
- `useSalutations` - `fetchSalutations` returns salutations response now
- `useUser` - `refreshUser` returns customer data. `logout`, `loadCountry` and `loadSalutation` returns data from the API
