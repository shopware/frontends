<script setup lang="ts">
defineProps<{
  template: string;
}>();
</script>

<template>
  <div>
    <img class="logo" src="~/assets/shopware-frontends-logo.png" />
  </div>
  <h1>{{ template }}</h1>
</template>
<style scoped>
.logo {
  max-width: 100%;
}
</style>
