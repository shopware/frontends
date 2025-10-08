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

const props = withDefaults(defineProps<SwBaseButtonProps>(), {
  variant: "primary",
  size: "medium",
  disabled: false,
  loading: false,
  type: "button",
  block: false,
});

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
  classes.push(sizeClasses[props.size]);

  const variantClasses = {
    primary:
      "bg-brand-primary hover:bg-brand-primary-hover text-white focus:ring-brand-primary",
    secondary:
      "bg-brand-secondary hover:bg-brand-secondary-hover text-white focus:ring-brand-secondary",
    success: "bg-success hover:bg-success-600 text-white focus:ring-success",
    warning: "bg-warning hover:bg-warning-600 text-white focus:ring-warning",
    outline:
      "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary",
    ghost:
      "bg-transparent text-surface-on-surface-variant hover:text-surface-on-surface focus:ring-surface-on-surface",
  };

  if (props.disabled || props.loading) {
    classes.push(
      "bg-surface-surface-disabled text-surface-on-surface cursor-not-allowed opacity-50",
    );
  } else {
    classes.push(variantClasses[props.variant]);
  }

  if (props.block) {
    classes.push("w-full");
  }

  return classes.join(" ");
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
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
    <div v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>

    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>