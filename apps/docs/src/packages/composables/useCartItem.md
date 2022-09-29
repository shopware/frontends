---
category: CMS
---

# useCartItem

Composable for cart item management.

## Usage

Display and manage single cart item in your cart.

```ts
const {
  itemOptions,
  removeItem,
  itemRegularPrice,
  itemQuantity,
  isPromotion,
  itemStock,
  changeItemQuantity,
} = useCartItem(props.cartItem);
```
