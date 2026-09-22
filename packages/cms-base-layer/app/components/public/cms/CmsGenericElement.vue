<script setup lang="ts">
import { resolveCmsComponent } from "@shopware/composables";
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { h, resolveComponent } from "vue";

import type { Schemas } from "#shopware";

const props = defineProps<{
  /**
   * A block asks for its slots by name, and a block does not have to carry
   * every slot its layout allows, so this can be undefined.
   */
  content?: Schemas["CmsSlot"];
}>();

const DynamicRender = () => {
  // A slot the block does not carry renders nothing at all: an empty element
  // would still take a class from the call site and occupy a grid or flex cell.
  if (!props.content) return null;

  const { resolvedComponent, componentName, componentNameToResolve } =
    resolveCmsComponent(props.content);
  if (resolvedComponent) {
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
      `[CMS] Element type "${componentName}" is not implemented.\n  → Create a component named "${componentNameToResolve}.vue" to render it.\n  📖 Docs: https://developer.shopware.com/frontends/guides/cms/create-elements`,
    );
    return h(resolveComponent("CmsNoComponent"), { content: props.content });
  }
  return h("div", {}, "");
};
</script>

<template>
  <DynamicRender />
</template>
