<script setup lang="ts">
import {
  getBackgroundImageUrl,
  getCmsLayoutConfiguration,
  getProductListingFromCmsPage,
} from "@shopware/helpers";
import { pascalCase } from "scule";
import { computed, h, resolveComponent, watchEffect } from "vue";
import {
  createCategoryListingContext,
  useAppConfig,
  useNavigationContext,
} from "#imports";
import type { Schemas } from "#shopware";
import { useLcpImagePreload } from "../../../composables/useLcpImagePreload";

const props = defineProps<{
  content: Schemas["CmsPage"];
}>();

const { routeName } = useNavigationContext();
const appConfig = useAppConfig();

// Function to initialize or update listing context
function updateListingContext(content: Schemas["CmsPage"]) {
  if (routeName.value === "frontend.navigation.page") {
    const initialListing =
      getProductListingFromCmsPage<Schemas["ProductListingResult"]>(content);

    if (initialListing) {
      createCategoryListingContext(initialListing);
    }
  }
}

// Watch for content changes and update context
watchEffect(() => {
  updateListingContext(props.content);
});

const cmsSections = computed<Schemas["CmsSection"][]>(() => {
  return props.content?.sections || [];
});

useLcpImagePreload(props.content?.sections || []);

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
        appConfig.backgroundImage,
      );
    }

    return h(componentObject.component, {
      content: componentObject.section,
      class: {
        ...cssClasses,
        "max-w-screen-2xl w-full mx-auto": layoutStyles?.sizingMode === "boxed",
        "w-full": layoutStyles?.sizingMode === "full_width",
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
