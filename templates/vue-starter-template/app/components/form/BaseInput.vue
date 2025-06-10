<script lang="ts" setup>
defineProps<{
  placeholder?: string;
}>();

const model = defineModel<string>({
  required: true,
});

const props = defineSlots<{
  leftIcon(): unknown;
  rightIcon(): unknown;
}>();
</script>
<template>
  <div
    class="flex items-center rounded-lg px-4 py-2 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant text-surface-on-surface-variant"
  >
    <slot name="leftIcon" />
    <input
      v-model="model"
      class="text-sm"
      type="text"
      :placeholder="placeholder"
    />
    <slot name="rightIcon" />
  </div>
</template>
