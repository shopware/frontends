<script setup lang="ts">
import { resolveCmsComponent } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { h } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsSlot"];
}>();

const DynamicRender = () => {
  const {
    resolvedComponent,
    componentName,
    isResolved,
    componentNameToResolve,
  } = resolveCmsComponent(props.content);
  if (resolvedComponent) {
    if (!isResolved)
      return h("div", {}, `Problem resolving component: ${componentName}`);

    const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
      props.content,
    );
    return h(resolvedComponent, {
      content: props.content,
      style: layoutStyles,
      class: cssClasses,
    });
  }
  console.error(`Component not resolved: ${componentNameToResolve}`);
  return h("div", {}, "");
};
</script>

<template>
  <DynamicRender />
</template>
