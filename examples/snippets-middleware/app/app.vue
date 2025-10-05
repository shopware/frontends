<script setup lang="ts">
import Frontends from "./components/Frontends.vue";
const { refreshSessionContext } = useSessionContext();

onMounted(() => {
  refreshSessionContext();
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
