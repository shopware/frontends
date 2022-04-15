<script setup lang="ts">
import { resolveComponent } from "vue";
import { pascalCase } from "scule";
import { getCmsPage } from "@shopware-pwa/shopware-6-client";

const { error, loading, search } = useCms();
const route = useRoute();
const { apiInstance } = useShopwareContext();

const { data: cmsResponse } = await useAsyncData(
  "cmsResponse",
  () => {
    return getCmsPage(
      route.path,
      {
        associations: {
          manufacturer: {},
          media: {},
          properties: {
            associations: {
              group: {},
            },
          },
        },
      },
      apiInstance
    );
  },
  {
    lazy: true,
  }
);

provide("cms-page", cmsResponse); // TODO: remove after clearing references
provide("cmsResponse", cmsResponse);

const page = cmsResponse;
const cmsPage = computed(() => page.value?.cmsPage);
const staticPage = computed(() => page.value);
const staticError = computed(() => error.value);

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
