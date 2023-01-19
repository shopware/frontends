<script setup lang="ts">
import { useSessionContext } from "@shopware-pwa/composables-next";

const { refreshSessionContext } = useSessionContext();
await refreshSessionContext();
</script>
<template></template>
<style scoped></style>
