<script setup lang="ts">
import Frontends from "./components/Frontends.vue";
const { refreshSessionContext } = useSessionContext();

onMounted(() => {
  refreshSessionContext().catch((error) => {
    console.error("[App][refreshSessionContext]", error);
  });
});
</script>

<template>
  <div id="app" test-id="test-wrapper">
    <Frontends />
  </div>
</template>
<style>
@import "./style.css";
</style>
