<script lang="ts" setup>
const { placeholder, type = "text" } = defineProps<{
  placeholder?: string;
  type?: "text" | "password";
  invalid?: boolean;
}>();

const model = defineModel<string>({
  required: true,
});

const slots = defineSlots<{
  leftIcon(): unknown;
  rightIcon(): unknown;
}>();
</script>
<template>
  <div
    :class="{
      'outline-red': invalid,
    }"
    class="flex items-center rounded-lg px-4 py-2 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant text-surface-on-surface-variant"
  >
    <slot name="leftIcon" />
    <input
      v-model="model"
      class="text-sm w-full"
      :placeholder="placeholder"
      :type="type"
    />
    <slot name="rightIcon" />
  </div>
</template>
