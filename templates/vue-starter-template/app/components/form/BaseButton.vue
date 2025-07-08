<script lang="ts" setup>
defineSlots<{
  default(): unknown;
}>();

const { label, variant = "primary" } = defineProps<{
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "outline";
}>();

const variantClasses = {
  primary: "bg-brand-primary text-brand-on-primary",
  secondary: "bg-brand-secondary text-brand-on-secondary",
  tertiary: "bg-brand-tertiary text-brand-on-tertiary",
  outline: "bg-transparent border-1 border-brand-primary",
};
</script>
<template>
  <button
    :class="variantClasses[variant]"
    class="px-4 py-3 rounded inline-flex justify-center items-center gap-1 disabled:bg-surface-surface-disabled disabled:bg-text-bg-surface-surface-disabled"
  >
    <div class="justify-start text-base font-bold leading-normal">
      <slot> {{ label }}</slot>
    </div>
  </button>
</template>
