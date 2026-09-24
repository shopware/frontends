<template>
  <div v-if="hasListPrice" class="old-price line-through">
    {{ price?.listPrice?.price }} $
    <!-- old price before discount -->
  </div>
  <div v-if="totalPrice">
    {{ totalPrice }} $
    <!-- actual price after discount -->
  </div>
</template>
