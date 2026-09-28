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
  // Nothing to render for a slot the block does not carry. An element would
  // take the class the call site passes and occupy a cell of its own wherever a
  // block renders this straight into a grid, as CmsBlockCenterText does. A
  // wrapper the block puts around the call site renders either way — sizing
  // that wrapper for an absent slot is the block's business, not this one's.
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
  // Production: an element type with no component renders nothing, for the same
  // reason the missing slot above does.
  return null;
};
</script>

<template>
  <DynamicRender />
</template>
