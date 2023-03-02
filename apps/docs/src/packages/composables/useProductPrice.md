---
category: CMS
---

# useProductPrice

The purpose of the `useProductPrice` function is to abstract the logic to expose most useful helpers for price displaying.

## Usage

```ts
const {
  price,
  unitPrice,
  displayFromVariants,
  displayFrom,
  tierPrices,
  isListPrice,
} = useProductPrice(product);
```
