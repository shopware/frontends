<script setup lang="ts">
import type { CmsElementHtml } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { computed, h } from "vue";
import xss from "xss";

const props = defineProps<{
  content: CmsElementHtml;
}>();

const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(props.content);

// Same default xss whitelist as CmsElementProductDescriptionReviews.vue, so the
// markup is identical on SSR and on hydration.
const sanitizedContent = computed(() => xss(props.content.data?.content || ""));

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
