---
category: CMS
---

# useProductAssociations

<!-- PLACEHOLDER_DESCRIPTION -->

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
