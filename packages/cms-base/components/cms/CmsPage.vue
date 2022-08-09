<script setup lang="ts">
import { CmsPage } from "@shopware-pwa/types";
import { pascalCase } from "scule";

const props = defineProps<{
  content: CmsPage;
}>();

useListing();

const cmsSections = computed(() => {
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
    if (typeof componentObject.component === "string")
      return h("div", {}, "There is no " + componentObject.component); // TODO: cmsNoComponent
    return h(componentObject.component, {
      content: componentObject.section,
      style: {
        backgroundColor: componentObject.section.backgroundColor,
      },
    });
  });
};
</script>

<template>
  <DynamicRender />
</template>
