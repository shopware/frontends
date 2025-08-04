<script setup lang="ts">
import Frontends from "./components/Frontends.vue";
const { refreshSessionContext } = useSessionContext();

onMounted(() => {
  refreshSessionContext();
});
</script>

<template>
  <div id="app">
    <Frontends template="Blank Vue 3 template (Nuxt)" />
  </div>
</template>
<style>
@import "./style.css";
</style>
