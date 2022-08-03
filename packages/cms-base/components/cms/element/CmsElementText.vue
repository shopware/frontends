<script setup lang="ts">
import { CmsElementText } from "@shopware-pwa/composables-next";
import { ComputedRef, CSSProperties } from "vue";

const props = defineProps<{
  content: Pick<CmsElementText, "config" | "data" | "type" | "slot">;
}>();

const style: ComputedRef<CSSProperties> = computed(() => ({
  alignItems: props.content.config?.verticalAlign?.value,
}));

const hasVerticalAlignment = computed(() => !!style.value.alignItems);

const CmsTextRender = () => {
  const rawHtml =
    props.content?.data?.content ?? props.content?.config?.content?.value;
  return h("div", { innerHTML: rawHtml });
};
</script>
<template>
  <div
    :class="{ flex: hasVerticalAlignment, 'flex-row': hasVerticalAlignment }"
    :style="style"
  >
    <CmsTextRender />
  </div>
</template>
<style>
/** Global CSS styles for text elements */
h1,
h2,
h3,
h4,
h5 {
  margin-bottom: 10px;
  font-weight: 600;
}

h1 {
  line-height: 2.5rem;
  font-size: 2.25rem;
}

h2 {
  line-height: 2rem;
  font-size: 1.75rem;
}

h3 {
  line-height: 1.5rem;
  font-size: 1.25rem;
}

ol,
ul,
dl {
  list-style-type: disc;
  padding-left: 40px;
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
