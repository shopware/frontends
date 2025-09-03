<script lang="ts" setup>
const { link, label } = defineProps<{
  link: string;
  label: string;
}>();
</script>

<template>
  <NuxtLink
    class="text-surface-on-surface hover:border-b hover:border-surface-on-surface"
    :to="link"
    active-class="border-b border-surface-on-surface"
  >
    {{ label }}
  </NuxtLink>
</template>
