<script setup lang="ts">
import { resolveComponent } from "vue";
import { pascalCase } from "scule";
import { useCms } from "@shopware-pwa/composables-next";

const { search } = useCms();
const route = useRoute();
const { apiInstance } = useShopwareContext();

const { data: cmsResponse } = await useAsyncData(
  "cmsResponse" + route.path,
  () => {
    return search(route.path, {
      associations: {
        manufacturer: {},
        media: {},
        properties: {
          associations: {
            group: {},
          },
        },
      },
    });
  }
);
console.error("our cms response", cmsResponse.value);

provide("cms-page", cmsResponse); // TODO: remove after clearing references
provide("cmsResponse", cmsResponse);

const page = cmsResponse;
const cmsPage = computed(() => page.value?.cmsPage);

function render() {
  const componentName = page.value?.resourceType;
  const componentNameToResolve = pascalCase(componentName);
  const cmsPageView =
    page.value?.resourceType && resolveComponent(componentNameToResolve);
  if (cmsPageView) {
    if (cmsPageView === componentNameToResolve)
      return h("div", {}, "Problem resolving component: " + componentName);
    return h("div", h(cmsPageView, { cmsPage: cmsPage.value }));
  }
  return h("div", {}, "Loading...");
}
</script>

<template>
  <render />
</template>
