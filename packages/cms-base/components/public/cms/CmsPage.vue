<script setup lang="ts">
import type { CmsPage, CmsSection } from "@shopware-pwa/types";
import { pascalCase } from "scule";
import {
  getCmsLayoutConfiguration,
  getBackgroundImageUrl,
} from "@shopware-pwa/helpers-next";
import { useCategoryListing, useNavigationContext } from "#imports";
import { computed, h, resolveComponent } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: CmsPage | Schemas["CmsPage"];
}>();

const { routeName } = useNavigationContext();
if (routeName.value === "frontend.navigation.page") {
  useCategoryListing();
}

const cmsSections = computed<CmsSection[]>(() => {
  return (props.content?.sections as unknown as CmsSection[]) || [];
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
      return h("div", {}, "There is no " + componentObject.component);
    } else {
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
          "max-w-screen-2xl mx-auto": layoutStyles?.sizingMode === "boxed",
        },
        style: {
          backgroundColor: layoutStyles?.backgroundColor,
          backgroundImage: layoutStyles?.backgroundImage,
          backgroundSize: layoutStyles?.backgroundSize,
        },
      });
    }
  });
};
</script>

<template>
  <DynamicRender />
</template>
