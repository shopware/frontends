<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/types";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers-next";
import { resolveCmsComponent } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsSlot;
}>();

const attrs = useAttrs();

const DynamicRender = () => {
  const { resolvedComponent, componentName, isResolved } = resolveCmsComponent(
    props.content
  );
  if (resolvedComponent) {
    if (!isResolved)
      return h("div", {}, "Problem resolving component: " + componentName);

    const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
      props.content
    );

    return h(resolvedComponent, {
      ...attrs,
      content: props.content,
      style: layoutStyles,
      class: cssClasses,
    });
  }
  return h("div", {}, "Loading...");
};
</script>

<template>
  <DynamicRender />
</template>
