<script setup lang="ts">
import type { CmsBlockHtml } from "@shopware/composables";

import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { h } from "vue";

const props = defineProps<{
  content: CmsBlockHtml;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);

const HtmlComponent = () => {
  return h("div", {
    class: cssClasses,
    style: layoutStyles,
    innerHTML: props.content.slots[0].data.content || "",
  });
};
</script>

<template>
  <HtmlComponent />
</template>
