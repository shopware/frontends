<script setup lang="ts">
import { resolveCmsComponent } from "@shopware/composables";
import {
  getBackgroundImageUrl,
  getCmsLayoutConfiguration,
} from "@shopware/helpers";
import { h, provide, resolveComponent } from "vue";
import { useAppConfig } from "#imports";
import type { Schemas } from "#shopware";
import { getImageSizes } from "../../../helpers/cms/getImageSizes";

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();

const appConfig = useAppConfig();

const slotCount = props.content.slots?.length || 1;
provide("cms-block-slot-count", slotCount);
provide("cms-image-sizes", getImageSizes(slotCount, appConfig.imageSizes));

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
        {
          format: appConfig.backgroundImage?.format,
          quality: appConfig.backgroundImage?.quality,
        },
      );
    }

    const containerStyles = {
      backgroundColor: layoutStyles.backgroundColor,
      backgroundImage: layoutStyles.backgroundImage,
      backgroundSize: layoutStyles.backgroundSize,
    };

    layoutStyles.backgroundColor = null;
    layoutStyles.backgroundImage = null;
    layoutStyles.backgroundSize = null;
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
  if (import.meta.dev) {
    console.warn(
      `[CMS] Block type "${componentName}" is not implemented.\n  → Create a component named "${componentNameToResolve}.vue" to render it.\n  📖 Docs: https://frontends.shopware.com/getting-started/cms/create-blocks`,
    );
    return h(resolveComponent("CmsNoComponent"), { content: props.content });
  }
  return h("div", {}, "");
};
</script>

<template>
  <DynamicRender />
</template>
