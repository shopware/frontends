# Cart

::: tip 🙋‍♀️ How to use these example?
Just copy the code snippet and paste it into your project. Sometimes it's useful to create a new component and use it in a higher level component like a page or a layout.
:::

## Simple cart

This cart is position in a sticky position on the right side of your screen and contains a basic overview of all products, including their price, quantities and the total price.

<div class="flex flex-col items-center">

<img src="./simple-cart-md.png" alt="Preview for medium screen size" class="p-3 border-1 border-gray-200 rounded-md shadow-md hover:shadow-xl hover:scale-105 transform duration-300" />

</div>

<div>

```vue
<script setup lang="ts">
const { count, refreshCart, cartItems, removeItem, totalPrice } = useCart();

onMounted(() => {
  refreshCart();
});
</script>
<template>
  <div
    class="fixed right-0 bg-white top-0 w-96 h-screen bg-blue p-6 shadow-lg z-10"
  >
    <h2 class="text-xl">Your Basket</h2>
    <span class="text-sm">{{ count }} items</span>
    <div v-for="item in cartItems" :key="item.id" class="flex gap-3 my-5">
      <div
        class="mr-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
      >
        <img
          v-if="item.type == 'product'"
          :src="item.cover?.url"
          class="h-full w-full object-cover object-center"
        />
      </div>
      <div class="flex justify-between grow">
        <div>
          <p class="font-medium mb-3">{{ item.label }}</p>
          <p class="text-gray-600 text-xs">{{ item.quantity }}</p>
        </div>
        <div class="text-right flex flex-col justify-between">
          <p>$ {{ item.price.totalPrice }}</p>
          <p
            class="text-blue-600 cursor-pointer hover:underline"
            @click="removeItem({ id: item.id })"
          >
            Remove
          </p>
        </div>
      </div>
    </div>
    <div
      class="mt-10 py-10 border-t border-gray-200 text-lg flex justify-between"
    >
      <span>Total</span><span>$ {{ totalPrice }}</span>
    </div>
  </div>
</template>
```

</div>
