<script setup lang="ts">
import {
  getBackgroundImageUrl,
  getCmsLayoutConfiguration,
} from "@shopware/helpers";
import { pascalCase } from "scule";
import { computed, h, resolveComponent } from "vue";
import { createCategoryListingContext, useNavigationContext } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsPage"];
}>();

const { routeName } = useNavigationContext();
if (routeName.value === "frontend.navigation.page") {
  createCategoryListingContext();
}

const cmsSections = computed<Schemas["CmsSection"][]>(() => {
  return props.content?.sections || [];
});

const DynamicRender = () => {
  const componentsMap = cmsSections.value.map((section) => {
    return {
      name: `CmsSection${pascalCase(section.type)}`,
      component: resolveComponent(`CmsSection${pascalCase(section.type)}`),
      section: section,
    };
  });
  return componentsMap.map((componentObject) => {
    const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
      componentObject.section,
    );
    if (typeof componentObject.component === "string") {
      return h("div", {}, `There is no ${componentObject.component}`);
    }

    if (layoutStyles?.backgroundImage) {
      layoutStyles.backgroundImage = getBackgroundImageUrl(
        layoutStyles.backgroundImage,
        componentObject.section,
      );
    }

    return h(componentObject.component, {
      content: componentObject.section,
      class: {
        ...cssClasses,
        "max-w-screen-2xl w-full mx-auto": layoutStyles?.sizingMode === "boxed",
      },
      style: {
        backgroundColor: layoutStyles?.backgroundColor,
        backgroundImage: layoutStyles?.backgroundImage,
        backgroundSize: layoutStyles?.backgroundSize,
      },
    });
  });
};
</script>

<template>
  <DynamicRender />
</template>
