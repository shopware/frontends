### TO DO
- [ ] Add a description of the layer
- [ ] Add a list of the packages in the layer
- [ ] Add a list of the dependencies of the layer

```
shared/            ← logic, types, utils, APIs (used by all)
├─ composables/
├─ types/
├─ utils/

cart-logic/        ← state management & actions for cart
├─ composables/useCart.ts

cart-components/   ← UI only: CartPanel.vue, CartIcon.vue
├─ components/

product-card/      ← displays product card, uses useCart (no UI dependency on cart)
├─ components/ProductCard.vue

templates/new-one  ← glue layer, imports everything
```

## Dependency direction

```
shared / core
  ↑
cart-logic     → can use shared / core
  ↑
cart-components → can use cart-logic + shared
product-card-components   → can use cart-logic + shared
```


## Hidden or Implicit Dependencies
Problem: Layer A uses logic from Layer B without explicitly depending on it.

Example: product-card calls useCart() which actually lives in cart, but it’s not clear from the dependency graph.

🔥 Leads to breakage if cart is disabled.

👉 Solution: Move shared logic to a dedicated shared or cart-logic layer that others can depend on.

## Cyclic Dependencies
Problem: Two layers depend on each other.

Example: cart uses a component from product-card, and product-card uses useCart from cart.

👉 Solution: Use a unidirectional dependency flow and extract shared logic/UI into a separate core or shared layer.

## Over-fragmentation
Problem: Too many small layers lead to complexity and mental overload.

Example: cart-logic, cart-ui, cart-api, cart-icons, etc.

👉 Solution: Group logically-related files together until you really need to split.

## Hard to Test in Isolation
Problem: Layer X might fail to load properly if it implicitly depends on Layer Y.

Example: Testing product-card in Storybook fails without cart.

👉 Solution: Provide mocks or fallback logic in shared composables.

## Nuxt Limitations
No native tooling to visualize dependency graphs or conflicts.

Aliases and layer order can sometimes clash.

Layer override mechanism can be brittle if file structures are inconsistent.