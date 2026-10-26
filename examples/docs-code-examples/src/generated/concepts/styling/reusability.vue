<!-- ImageCircle.vue -->
<script setup>
import { h } from "#imports";
defineProps(["imageSrc"]);
</script>

<template>
  <img
    class="object-cover w-12 h-12 rounded-full border-3 border-white mr--6"
    :src="imageSrc"
  />
</template>
