<script setup lang="ts">
const { isSelected } = defineProps<{
  isSelected: boolean;
}>();
</script>
<template>
  <FormIconButton type="ghost" class="justify-center">
    <div
      class="h-10 w-10 bg-brand-secondary rounded-full flex items-center justify-center"
    >
      <Icon
        size="1.2rem"
        :name="isSelected ? 'shopware:solid-heart' : 'shopware:heart'"
        class="color-brand-primary"
      />
    </div>
  </FormIconButton>
</template>
