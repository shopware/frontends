<script lang="ts" setup>
const { type = "primary" } = defineProps<{
  type?: "primary" | "secondary" | "tertiary" | "outline" | "ghost";
}>();

const styles = {
  primary:
    "bg-brand-primary hover:focus:bg-brand-primary-hover text-brand-on-primary",
  secondary:
    "bg-brand-secondary hover:focus:bg-brand-secondary-hover text-brand-on-secondary",
  tertiary:
    "bg-brand-tertiary hover:focus:bg-brand-tertiary-hover text-brand-on-tertiary",
  outline:
    "text-brand-primary bg-transparent hover:focus:bg-surface-surface-container outline outline-2 outline-offset-[-2px] outline-brand-primary",
  ghost: "bg-transparent hover:focus:bg-surface-surface-container",
};
</script>

<template>
  <button
    :class="[
      styles[type],
      {
        'bg-surface-on-surface-disabled text-surface-surface-disabled':
          $attrs.disabled,
        'w-10 h-10': type !== 'ghost',
      },
    ]"
    class="relative rounded-full border-0"
  >
    <slot />
  </button>
</template>
