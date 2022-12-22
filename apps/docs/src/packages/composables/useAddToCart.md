---
category: CMS
---

<script setup>
import StackBlitzLiveExample from '../../components/StackBlitzLiveExample.vue'
</script>

# useAddToCart

Add product to cart.

[[toc]]

## Usage

Provided `product` object in the argument should be in a `Ref<Product>` type.

```vue
<script setup lang="ts">
const { isInCart, quantity, addToCart, getStock } = useAddToCart({ product });
</script>
```

## Live example

<StackBlitzLiveExample projectId="mkucmus/frontends-examples" example="UseAddToCart" />
