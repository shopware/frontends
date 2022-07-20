<script setup lang="ts">
import { CmsSectionDefault } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsSectionDefault;
}>();

let boxedSizing = computed(() => props.content.sizingMode === "boxed");
</script>

<template>
  <div class="cms-section-default">
    <CmsGenericBlock
      v-for="cmsBlock in props.content.blocks"
      :key="cmsBlock.id"
      :content="cmsBlock"
      class="overflow-auto"
      v-bind:class="{
        'max-w-screen-xl': boxedSizing,
        'mx-auto': boxedSizing,
      }"
    />
  </div>
</template>
