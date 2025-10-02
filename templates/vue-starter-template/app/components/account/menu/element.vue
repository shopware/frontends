<script lang="ts" setup>
import type { RouteObject } from "#imports";

const { link, label } = defineProps<{
  link: string | RouteObject;
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
