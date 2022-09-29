---
category: CMS
---

# useAddToCart

Add product to cart.

## Usage

```ts
const { isInCart, quantity, addToCart } = useAddToCart({ product });
if (!isInCart.value) {
  quantity.value = 5;
  await addToCart();
}
```
