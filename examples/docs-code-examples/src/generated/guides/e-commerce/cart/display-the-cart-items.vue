<script setup lang="ts">
import { useCart } from "#imports";
const { cartItems, totalPrice, count } = useCart();
</script>
<template>
  Items in the cart: {{ count }}<br />
  Total price: {{ totalPrice }}<br />

  <ul>
    <li v-for="cartItem in cartItems" :id="cartItem.id">
      {{ cartItem.label }} - {{ cartItem.price.totalPrice }}
    </li>
  </ul>
</template>
