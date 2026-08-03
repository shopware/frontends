<script lang="ts" setup>
defineSlots<{
  default(): unknown;
}>();

const {
  label,
  variant = "primary",
  size = "regular",
  loading = false,
  disabled = false,
} = defineProps<{
  label?: string;
  variant?: "primary" | "secondary" | "tertiary" | "outline";
  size?: "regular" | "small";
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
}>();

const variantClasses = {
  primary: "bg-brand-primary text-brand-on-primary",
  secondary: "bg-brand-secondary text-brand-on-secondary",
  tertiary: "bg-brand-tertiary text-brand-on-tertiary",
  outline: "bg-transparent border-1 border-brand-primary",
};

const sizeClasses = {
  regular: "py-3",
  small: "py-1.5",
};
</script>
<template>
  <button
    :class="[variantClasses[variant], sizeClasses[size]]"
    class="px-4 rounded inline-flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-surface-surface-disabled disabled:bg-text-bg-surface-surface-disabled"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span
      v-if="loading"
      class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
      aria-hidden="true"
    />
    <div class="justify-start text-base font-bold leading-normal">
      <slot> {{ label }}</slot>
    </div>
  </button>
</template>
