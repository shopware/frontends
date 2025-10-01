<script lang="ts" setup>
import { NuxtLink } from "#components";

defineProps<{
  link?: string;
}>();

defineSlots<{
  default(): unknown;
}>();
</script>
<template>
  <component :is="link ? NuxtLink : 'div'" v-bind="link ? { to: link } : {}">
    <span
    :class="{link: `hover:underline hover:decoration-brand-primary-hover hover:decoration-2 hover:underline-offset-4 hover:text-brand-primary-hover`}"
      class="justify-start leading-normal no-underline text-surface-on-surface"
    >
      <slot />
    </span>
  </component>
</template>
