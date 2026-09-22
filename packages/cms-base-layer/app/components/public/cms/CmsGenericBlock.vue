<script setup lang="ts">
import { resolveCmsComponent } from "@shopware/composables";
import {
  getBackgroundImageUrl,
  getCmsLayoutConfiguration,
} from "@shopware/helpers";
import { computed, h, provide, resolveComponent } from "vue";

import type { Schemas } from "#shopware";

import { useTypedAppConfig } from "../../../composables/useTypedAppConfig";
import { getImageSizes } from "../../../helpers/cms/getImageSizes";

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();

const appConfig = useTypedAppConfig();

// Provided as computeds so a block handed different content updates its
// children in place instead of needing a remount. Read them with `toValue()`.
const slotCount = computed(() => props.content.slots?.length || 1);
provide("cms-block-slot-count", slotCount);
provide(
  "cms-image-sizes",
  computed(() => getImageSizes(slotCount.value, appConfig.imageSizes)),
);

const DynamicRender = () => {
  const { resolvedComponent, componentName, componentNameToResolve } =
    resolveCmsComponent(props.content);

  if (resolvedComponent) {
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
      `[CMS] Block type "${componentName}" is not implemented.\n  → Create a component named "${componentNameToResolve}.vue" to render it.\n  📖 Docs: https://developer.shopware.com/frontends/guides/cms/create-blocks`,
    );
    return h(resolveComponent("CmsNoComponent"), { content: props.content });
  }
  // Production: a block type with no component renders nothing.
  return null;
};
</script>

<template>
  <DynamicRender />
</template>
