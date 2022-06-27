<script setup lang="ts">
const props = defineProps({
  content: Object,
});

const getContent = computed(() => props.content?.slots?.[0]);
</script>
<template>
  <div class="container mx-auto">
    <CmsGenericElement v-if="getContent" :content="getContent" />
  </div>
</template>
