<script setup lang="ts">
const { getFormattedPrice } = usePrice();
const props = defineProps<{
  value: number | undefined;
}>();

const getPrice = computed<string>(() => getFormattedPrice(props.value));
</script>

<template>
  <p class="flex gap-1">
    <slot name="beforePrice" />
    <span>{{ getPrice }}</span>
    <slot name="afterPrice" />
  </p>
</template>
