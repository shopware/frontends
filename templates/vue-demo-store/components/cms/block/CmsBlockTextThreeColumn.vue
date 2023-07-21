<script setup lang="ts">
import { CmsBlockTextThreeColumn } from "@shopware-pwa/composables-next";
import SharedValueProposition from '../../shared/SharedValueProposition.vue';

const props = defineProps<{
  content: CmsBlockTextThreeColumn;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftContent = getSlotContent("left");
const rightContent = getSlotContent("right");
const centerContent = getSlotContent("center");
</script>

<template>
  <SharedValueProposition v-if="props.content.name?.toLowerCase() === 'value-proposition'"/>
  <article v-else class="grid md:grid-cols-3 gap-4">
    <CmsGenericElement :content="leftContent" class="" />
    <CmsGenericElement :content="centerContent" class="" />
    <CmsGenericElement :content="rightContent" class="" />
  </article>
</template>
