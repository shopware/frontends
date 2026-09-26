<script setup lang="ts">
const {
  icon,
  variant = "brand",
  size = "regular",
} = defineProps<{
  icon: string;
  variant?: "brand" | "success" | "error";
  size?: "regular" | "large";
}>();

const variantClasses = {
  brand: "bg-brand-secondary text-brand-primary",
  success: "bg-states-success-container text-states-on-success-container",
  error: "bg-states-error-container text-states-on-error-container",
};

const sizeClasses = {
  regular: { badge: "size-14", icon: "size-7" },
  large: { badge: "size-20", icon: "size-10" },
};
</script>
<template>
  <div
    class="rounded-full inline-flex items-center justify-center shrink-0"
    :class="[variantClasses[variant], sizeClasses[size].badge]"
    aria-hidden="true"
  >
    <div :class="[icon, sizeClasses[size].icon]" />
  </div>
</template>
