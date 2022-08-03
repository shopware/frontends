<script setup lang="ts">
import { CmsBlock } from "@shopware-pwa/types";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers-next";
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
const props = defineProps<{
  content: CmsBlock;
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

      const containerStyles = {
        backgroundColor: layoutStyles.backgroundColor,
        backgroundImage: layoutStyles.backgroundImage,
      };

      layoutStyles.backgroundColor = null;
      layoutStyles.backgroundImage = null;

      return h(
        "div",
        {
          style: containerStyles,
        },
        h(cmsPageView, {
          content: props.content,
          style: layoutStyles,
          class: cssClasses,
        })
      );
    }
    return h("div", {}, "Loading...");
  } catch (e) {
    console.error(
      "Problem Resolving",
      componentNameToResolve,
      ":",
      (e as Error).message
    );
    return h(
      "div",
      {},
      `Problem(${componentNameToResolve}): ${(e as Error).message}`
    );
  }
};
</script>

<template>
  <DynamicRender />
</template>
