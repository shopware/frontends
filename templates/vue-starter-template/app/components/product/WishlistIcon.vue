<script setup lang="ts">
const { isSelected, disabled = false } = defineProps<{
  isSelected: boolean;
  disabled?: boolean;
}>();
</script>
<template>
  <FormIconButton
    type="ghost"
    class="justify-center disabled:cursor-not-allowed"
    :disabled="disabled"
  >
    <div
      class="h-10 w-10 bg-brand-secondary rounded-full flex items-center justify-center transition-opacity"
      :class="{ 'opacity-60': disabled }"
    >
      <Icon
        size="1.2rem"
        :name="isSelected ? 'shopware:solid-heart' : 'shopware:heart'"
        class="color-brand-primary"
      />
    </div>
  </FormIconButton>
</template>
