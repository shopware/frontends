---
category: CMS
---

<script setup>
import StackBlitzLiveExample from '../../components/StackBlitzLiveExample.vue'
</script>

# useAddToCart

## Usage

Provided `product` object in the argument should be in a `Ref<Product>` type.

```vue
<script setup lang="ts">
const { isInCart, quantity, addToCart, getStock } = useAddToCart({ product });
</script>
```

<!-- PLACEHOLDER_DESCRIPTION -->

## Live example

<StackBlitzLiveExample projectPath="shopware/frontends/tree/main/examples/use-add-to-cart" openPath="/" />
