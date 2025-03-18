<script lang="ts" setup>
const { label, type = "info" } = defineProps<{
  label: string;
  type?: "info" | "success" | "warning" | "error";
}>();

// @unocss-include
const classes = {
  info: "bg-states-info",
  success: "bg-states-success",
  warning: "bg-states-warning",
  error: "bg-states-error",
};
</script>
<template>
  <div
    :class="classes[type]"
    class="px-1.5 py-1 rounded inline-flex justify-center items-center"
  >
    <div
      class="justify-start text-white text-xs font-bold leading-[18px]"
    >
      {{ label }}
    </div>
  </div>
</template>
