<script setup lang="ts">
import { resolveCmsComponent } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { h, resolveComponent } from "vue";
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
  if (import.meta.dev) {
    console.warn(
      `[CMS] Element type "${componentName}" is not implemented.\n  → Create a component named "${componentNameToResolve}.vue" to render it.\n  📖 Docs: https://frontends.shopware.com/getting-started/cms/create-elements`,
    );
    return h(resolveComponent("CmsNoComponent"), { content: props.content });
  }
  return h("div", {}, "");
};
</script>

<template>
  <DynamicRender />
</template>
