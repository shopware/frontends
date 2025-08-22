<script lang="ts" setup>
const link = defineProps<{
  link: string;
  label: string;
}>();
</script>

<template>
  <NuxtLink
    class="text-surface-on-surface hover:border-b hover:border-surface-on-surface"
    :to="link"
  >
    {{ label }}
  </NuxtLink>
</template>
