<script setup lang="ts">
const slots = useSlots();
</script>

<template>
  <div class="flex flex-col justify-between mt-4 px-4 py-6 border broder-gray-300 shadow-sm">
    <div class="flex-1 text-sm font-normal">
      <slot name="content"></slot>
    </div>
    <div v-if="slots.actions" class="mt-4">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
