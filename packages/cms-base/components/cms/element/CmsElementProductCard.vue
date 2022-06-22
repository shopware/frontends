<script setup lang="ts">
const $props = defineProps(["content"])
const product = computed(
  () => $props.content.data?.product || {}
)
</script>
<template>
  <SwProductCard :product="product"/>
</template>
