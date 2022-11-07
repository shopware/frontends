<script setup lang="ts">
import { useSessionContext } from "@shopware-pwa/composables-next";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Frontends from "./components/Frontends.vue";

const { refreshSessionContext } = useSessionContext();
refreshSessionContext();
</script>

<template>
  <Frontends template="Blank Vue 3 template (Vite)" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
</style>
