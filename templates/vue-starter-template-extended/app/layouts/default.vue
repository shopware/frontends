<script setup lang="ts">
import StarterLayout from "../../../vue-starter-template/app/layouts/default.vue";
</script>

<template>
  <!-- Agent tools on every default-layout page. Cart and checkout use their own layout. -->
  <StarterLayout>
    <WebMcpTools />
    <slot />
  </StarterLayout>
</template>
