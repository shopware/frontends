<script setup lang="ts">
import StarterLayout from "../../../vue-starter-template/app/layouts/default.vue";

// The tools plugin lists the tools for this layout only and serves them
// only in browsers with WebMCP. Others never load the component.
const { $serveWebMcpTools } = useNuxtApp();
const withTools = ref(false);
onMounted(() => {
  withTools.value = Boolean($serveWebMcpTools);
});
</script>

<template>
  <!-- Agent tools on every default-layout page. Cart and checkout use their own layout. -->
  <StarterLayout>
    <LazyWebMcpTools v-if="withTools" />
    <slot />
  </StarterLayout>
</template>
