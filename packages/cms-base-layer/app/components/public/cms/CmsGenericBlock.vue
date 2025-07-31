<script setup lang="ts">
import { resolveCmsComponent } from "@shopware/composables";
import {
  getBackgroundImageUrl,
  getCmsLayoutConfiguration,
} from "@shopware/helpers";
import { h } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsBlock"];
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

    if (layoutStyles.backgroundImage) {
      layoutStyles.backgroundImage = getBackgroundImageUrl(
        layoutStyles.backgroundImage,
        props.content,
      );
    }

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
      h(resolvedComponent, {
        content: props.content,
        style: layoutStyles,
        class: cssClasses,
      }),
    );
  }
  console.error(`Component not resolve: ${componentNameToResolve}`);
  return h("div", {}, "");
};
</script>

<template>
  <DynamicRender />
</template>
