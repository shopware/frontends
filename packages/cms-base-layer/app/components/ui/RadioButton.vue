<script setup lang="ts">
const modelValue = defineModel<string | null>();

const { selected } = defineProps<{
  selected: boolean;
}>();
</script>
<template>
  <input
    type="radio"
    class="sr-only"
    v-bind="$attrs"
    v-model="modelValue"
    name="shipping-method"
  />
  <div
    class="w-4 h-4 rounded-full border border-outline-outline border-spacing-1 flex items-center justify-center"
  >
    <div
      :class="{
        'bg-brand-primary': selected,
      }"
      class="w-2.5 h-2.5 rounded-full"
    ></div>
  </div>
</template>
