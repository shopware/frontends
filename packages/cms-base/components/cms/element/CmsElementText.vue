<script setup lang="ts">
import type { CmsElementText } from "@shopware-pwa/composables-next";
import { useCmsElementConfig } from "@shopware-pwa/composables-next";
import { ComputedRef, CSSProperties } from "vue";

const props = defineProps<{
  content: CmsElementText;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);

const style: ComputedRef<CSSProperties> = computed(() => ({
  alignItems: getConfigValue("verticalAlign"),
}));

const hasVerticalAlignment = computed(() => !!style.value.alignItems);

const CmsTextRender = () => {
  return h("div", { innerHTML: getConfigValue("content") });
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
