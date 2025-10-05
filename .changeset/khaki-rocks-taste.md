---
"@shopware/composables": minor
---

Use proper associations format within `useDefaultOrderAssociations` (no redundant nesting).

Returned value is in type of `Schemas["Criteria"]['associations']` now:

```ts
const { loadOrders } = useCustomerOrders();

loadOrders({
    // ... other parameters
    associations: useDefaultOrderAssociations(),
});
```
