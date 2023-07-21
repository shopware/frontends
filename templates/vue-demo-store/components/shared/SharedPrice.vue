<script setup lang="ts">
const { getFormattedPrice } = usePrice();
const props = defineProps<{
  value: number | undefined;
}>();

const getPrice = computed<string>(() => getFormattedPrice(props.value || 0));
</script>

<template>
  <p class="flex gap-2">
    <slot name="beforePrice" />
    <span>{{ getPrice }}</span>
    <slot name="afterPrice" />
  </p>
</template>
