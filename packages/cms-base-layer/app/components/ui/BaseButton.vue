<script setup lang="ts">
import { computed } from "vue";

export interface SwBaseButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "outline"
    | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  block?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const {
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  type = "button",
  block = false,
} = defineProps<SwBaseButtonProps>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => {
  const classes = [
    "inline-flex justify-center items-center gap-2 rounded font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  ];

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3 text-base",
    large: "px-6 py-4 text-lg",
  };
  classes.push(sizeClasses[size]);

  const variantClasses = {
    primary:
      "bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary focus:ring-brand-primary",
    secondary:
      "bg-brand-secondary hover:bg-brand-secondary-hover text-brand-on-secondary focus:ring-brand-secondary",
    success:
      "bg-states-success hover:opacity-90 text-white focus:ring-states-success transition-opacity",
    warning:
      "bg-states-warning hover:opacity-90 text-white focus:ring-states-warning transition-opacity",
    outline:
      "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-on-primary focus:ring-brand-primary",
    ghost:
      "bg-transparent text-surface-on-surface-variant hover:text-surface-on-surface focus:ring-surface-on-surface",
  };

  if (disabled || loading) {
    classes.push(
      "bg-surface-surface-disabled text-surface-on-surface cursor-not-allowed opacity-50",
    );
  } else {
    classes.push(variantClasses[variant]);
  }

  if (block) {
    classes.push("w-full");
  }

  return classes.join(" ");
});

const handleClick = (event: MouseEvent) => {
  if (!disabled && !loading) {
    emit("click", event);
  }
};
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    v-bind="$attrs"
  >
    <div
      v-if="loading"
      class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    ></div>

    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>
