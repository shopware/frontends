<script setup lang="ts">
import { CmsSection } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSection;
}>();

let boxedSizing = computed(() => props.content.sizingMode === "boxed");
</script>

<template>
  <div>
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
