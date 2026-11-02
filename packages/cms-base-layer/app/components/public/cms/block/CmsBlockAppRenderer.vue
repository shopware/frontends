<script setup lang="ts">
import type { CmsBlockAppRenderer } from "@shopware/composables";
import { computed, getCurrentInstance } from "vue";
import type { Component, CSSProperties } from "vue";

import { getAppRendererLayout } from "../../../../helpers/cms/getAppRendererLayout";

const props = defineProps<{
  content: CmsBlockAppRenderer;
}>();

const appContext = getCurrentInstance()?.appContext;

const layout = computed(() => getAppRendererLayout(props.content));

const appBlockComponent = computed<Component | undefined>(() => {
  const name = layout.value.componentName;

  return name ? appContext?.components[name] : undefined;
});

const gridStyle = computed<CSSProperties>(() => ({
  display: "grid",
  grid: layout.value.grid,
}));
</script>
<template>
  <component
    :is="appBlockComponent"
    v-if="appBlockComponent"
    :content="content"
  />
  <div
    v-else
    class="cms-block-app-renderer"
    :class="`cms-block-app-renderer-fallback-block-${layout.appBlockName}`"
    :style="gridStyle"
  >
    <div
      v-for="slot in layout.slots"
      :key="slot.id"
      class="min-w-0"
      :class="`cms-block-app-renderer-fallback-slot-${slot.type}`"
    >
      <CmsGenericElement :content="slot" />
    </div>
  </div>
</template>
