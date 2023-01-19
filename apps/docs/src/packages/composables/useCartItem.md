---
category: CMS
---

# useCartItem

Composable for cart item management.

## Usage

Display and manage single cart item in your cart.

```ts
const { cartItem } = toRefs(props);

const {
  itemOptions,
  removeItem,
  itemRegularPrice,
  itemQuantity,
  isPromotion,
  itemStock,
  changeItemQuantity,
} = useCartItem(cartItem);
```
