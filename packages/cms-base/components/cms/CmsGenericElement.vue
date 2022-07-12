<script setup lang="ts">
import { CmsSlot } from "@shopware-pwa/commons";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers";
import { pascalCase } from "scule";
import { resolveComponent } from "vue";

const props = defineProps<{
  content: CmsSlot;
}>();

const DynamicRender = () => {
  const componentName = props.content.type;
  const apiAlias = props.content.apiAlias;
  const type =
    apiAlias === "cms_section"
      ? "Section"
      : apiAlias === "cms_block"
      ? "Block"
      : "Element";
  const componentNameToResolve = pascalCase(`Cms-${type}-${componentName}`);
  try {
    const cmsPageView = resolveComponent(componentNameToResolve);

    if (cmsPageView) {
      if (cmsPageView === componentNameToResolve)
        return h(
          "div",
          {},
          "Problem resolving component: " + componentNameToResolve
        );

      const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
        props.content
      );

      return h(cmsPageView, {
        content: props.content,
        style: layoutStyles,
        class: cssClasses,
      });
    }
    return h("div", {}, "Loading...");
  } catch (e) {
    console.error("Problem Resolving", componentNameToResolve, ":", e.message);
    return h("div", {}, `Problem(${componentNameToResolve}): ${e.message}`);
  }
};
</script>

<template>
  <DynamicRender />
</template>
