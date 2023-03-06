---
category: CMS
---

# useCartItem

<!-- PLACEHOLDER_DESCRIPTION -->

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
