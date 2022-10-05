<script lang="ts">
export default {
  name: "PageResolver",
};
</script>

<script setup lang="ts">
import { Ref, resolveComponent } from "vue";
import { pascalCase } from "scule";
import { useCms } from "@shopware-pwa/composables-next";
import { useCmsHead } from "@/composables/useCmsHead";
import { CmsPageResponse } from "@shopware-pwa/types";

const { search } = useCms();
const route = useRoute();

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

provide("cms-page", cmsResponse); // TODO: remove after clearing references
provide("cmsResponse", cmsResponse);
provide("swCmsContext", cmsResponse);

const page = cmsResponse as Ref<CmsPageResponse>;
const cmsPage = computed(() => page.value?.cmsPage);

useCmsHead(unref(page), { mainShopTitle: "Shopware Frontends Demo Store" });

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
