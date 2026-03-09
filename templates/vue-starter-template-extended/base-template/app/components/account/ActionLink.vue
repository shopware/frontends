<script setup lang="ts">
defineSlots<{
  default(): unknown;
}>();

defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <FormLinkButton
    class="leading-0 border-b-1 border-b-solid border-b-brand-primary hover:border-transparent transition-all duration-200 h-6 w-fit"
    :class="{
      'opacity-50 pointer-events-none': disabled,
    }"
    variant="tertiary"
    :disabled="disabled"
  >
    <slot />
  </FormLinkButton>
</template>
