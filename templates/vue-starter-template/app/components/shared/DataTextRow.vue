<script setup lang="ts">
defineSlots<{
  default(): unknown;
}>();
</script>
<template>
  <div
    class="self-stretch justify-start text-surface-on-surface text-base font-normal leading-normal"
  >
    <slot />
  </div>
</template>
