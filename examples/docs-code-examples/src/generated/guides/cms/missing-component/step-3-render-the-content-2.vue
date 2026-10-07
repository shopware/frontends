<!-- app/components/cms/{{ componentName }}.vue -->
<script setup lang="ts">
import type { ElementConfig } from "@shopware/composables";

import { computed, useCmsElementConfig } from "#imports";
import type { Schemas } from "#shopware";

type CmsElementMyCustomSlider = Omit<Schemas["CmsSlot"], "config"> & {
  config: {
    title?: ElementConfig<string>;
  };
};

const props = defineProps<{
  content: CmsElementMyCustomSlider;
}>();

const { getConfigValue } = useCmsElementConfig(props.content);
const title = computed(() => getConfigValue("title") || "");
</script>

<template>
  <div>
    <h2 v-if="title">{{ title }}</h2>
  </div>
</template>
