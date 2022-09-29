---
category: CMS
---

# useProductAssociations

Description

## Usage

```ts
const { loadAssociations, productAssociations } = useProductAssociations(
  product,
  { associationContext: "cross-selling" }
);
if (!productAssociations.value) {
  await loadAssociations();
}
```
