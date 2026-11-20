<script setup lang="ts">
import type { CmsElementHtml } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { computed, h } from "vue";

import { sanitizeHtml } from "../../../../helpers/cms/sanitizeHtml";

const props = defineProps<{
  content: CmsElementHtml;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);

// String-only sanitizing, so the markup is identical on SSR and on hydration.
const sanitizedContent = computed(() =>
  sanitizeHtml(props.content.data?.content),
);

const HtmlComponent = () => {
  return h("div", {
    class: ["cms-element-html", "cms-element-text", cssClasses],
    style: layoutStyles,
    innerHTML: sanitizedContent.value,
  });
};
</script>

<template>
  <HtmlComponent />
</template>
