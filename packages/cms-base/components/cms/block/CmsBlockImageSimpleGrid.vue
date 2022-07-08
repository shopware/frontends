<script setup lang="ts">
import { CmsBlockImageSimpleGrid } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsBlockImageSimpleGrid;
}>();

const { getSlotContent } = useCmsBlock(props.content);

const leftTopContent = getSlotContent("left-top");
const leftBottomContent = getSlotContent("left-bottom");
const rightContent = getSlotContent("right");
</script>

<template>
  <article class="grid md:grid-cols-2 auto-rows-fr gap-10">
    <div class="grid gap-10">
      <CmsGenericElement :content="leftTopContent" />
      <CmsGenericElement :content="leftBottomContent" />
    </div>
    <CmsGenericElement :content="rightContent" />
  </article>
</template>
