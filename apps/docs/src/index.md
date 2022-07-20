---
---

# Shopware Frontends

Shopware Frontends is a framework for building custom, cloud-native Shopware Storefronts.

<img src=".assets/shopware-frontends-logo.png">

## How does it work?

Shopware Frontends assumes that you are building a fully custom Storefront for a Shopware Store. Depending on your needs, you can start with different levels of "completeness" of the storefront.

### Templates

Apps are assembled applications that you can start with - Shopware Frontends comes with a default store template.

- [Demo Store Template](https://gitlab.shopware.com/product/engineering/platform-group/pwa/frontends/-/tree/main/apps/nuxt3-app)

<div class="shadow-lg rounded-lg overflow-hidden">
  <img src=".assets/demo-store.png" alt="Demo Store Template" />
</div>

### Composables

Composables are collections of functions and state that you can use within any Vue.js application:

```vue
<script setup>
const { cartItems, totalPrice } = useCart();
</script>
<template>
  <div>
    <p>Cart Items: ${cartItems.length}</p>
    <p>Total Price: ${totalPrice}</p>
  </div>
</template
```
