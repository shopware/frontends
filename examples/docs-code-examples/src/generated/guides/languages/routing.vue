<script setup lang="ts">
import { useInternationalization } from "#imports";
const localePath = (path: string) => path;
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <NuxtLink :to="formatLink('/account')"> Account</NuxtLink>
</template>
