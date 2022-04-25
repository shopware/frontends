<script setup>
const open = ref(false);
defineProps(["cmsPage"]);
</script>

<template>
  <CmsPage :content="cmsPage" />
</template>
