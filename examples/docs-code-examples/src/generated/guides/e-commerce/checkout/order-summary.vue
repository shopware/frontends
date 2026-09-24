<script setup lang="ts">
import { useCart, usePrice } from "#imports";
const { refreshCart, cartItems, subtotal, totalPrice, shippingTotal } =
  useCart();
const { getFormattedPrice } = usePrice();
await refreshCart();
</script>
<template>
  <div>
    <div>
      <p>Subtotal</p>
      <p>{{ getFormattedPrice(subtotal) }}</p>
    </div>
    <div>
      <p>Shipping estimate</p>
      <p>{{ getFormattedPrice(shippingTotal) }}</p>
    </div>
    <div>
      <p>Order total</p>
      <p>{{ getFormattedPrice(totalPrice) }}</p>
    </div>
  </div>
</template>
