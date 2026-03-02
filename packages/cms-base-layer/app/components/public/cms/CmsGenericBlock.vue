<script setup lang="ts">
import { resolveCmsComponent } from "@shopware/composables";
import {
  getBackgroundImageUrl,
  getCmsLayoutConfiguration,
} from "@shopware/helpers";
import { h, provide } from "vue";
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
  console.error(`Component not resolve: ${componentNameToResolve}`);
  return h("div", {}, "");
};
</script>

<template>
  <DynamicRender />
</template>
