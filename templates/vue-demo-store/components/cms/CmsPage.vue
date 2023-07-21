<script setup lang="ts">
import { CmsPage, CmsSection } from "@shopware-pwa/types";
import { pascalCase } from "scule";
import { getCmsLayoutConfiguration } from "@shopware-pwa/helpers-next";
import { useNavigationContext } from "@shopware-pwa/composables-next";

const props = defineProps<{
  content: CmsPage;
}>();

const { routeName } = useNavigationContext();
if (routeName.value === "frontend.navigation.page") {
  useListing();
}

const cmsSections = computed<CmsSection[]>(() => {
  return props.content?.sections || [];
});

const DynamicRender = () => {
  const componentsMap = cmsSections.value.map((section) => {
    return {
      component: resolveComponent(`CmsSection${pascalCase(section.type)}`),
      section: section,
    };
  });
  return componentsMap.map((componentObject) => {
    const { cssClasses, layoutStyles } = getCmsLayoutConfiguration(
      componentObject.section
    );
    if (typeof componentObject.component === "string")
      return h("div", {}, "There is no " + componentObject.component);
    return h(componentObject.component, {
      content: componentObject.section,
      class: {
        [cssClasses ?? ""]: true,
        "container": layoutStyles?.sizingMode === "boxed",
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
