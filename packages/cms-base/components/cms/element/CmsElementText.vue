<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";

const props = defineProps<{
  content: CmsSlot;
}>();

const CmsTextRender = () => {
  const rawHtml =
    props.content?.data?.content ?? props.content?.config?.content?.value;
  return h("div", { innerHTML: rawHtml });
};
</script>
<template>
  <CmsTextRender />
</template>
