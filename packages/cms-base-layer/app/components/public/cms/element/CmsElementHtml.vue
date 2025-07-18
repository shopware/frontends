<script setup lang="ts">
import type { CmsElementHtml } from "@shopware/composables";

import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { h } from "vue";

const props = defineProps<{
  content: CmsElementHtml;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);

const HtmlComponent = () => {
  return h("div", {
    class: cssClasses,
    style: layoutStyles,
    innerHTML: props.content.data.content || "",
  });
};
</script>

<template>
  <HtmlComponent />
</template>
