<script setup lang="ts">
import { pascalCase } from "scule";
import { computed, resolveComponent } from "vue";
import type { Ref } from "vue";
import { useNavigationContext, useNavigationSearch } from "#imports";
import type { Schemas } from "#shopware";

defineOptions({
  name: "PageResolver",
});

const { resolvePath } = useNavigationSearch();
const route = useRoute();
const { locale } = useI18n();
const routePath = route.path.replace(`${locale.value}`, "").replace("//", "/");

const { data: seoResult } = await useAsyncData(
  `cmsResponse${routePath}`,
  async () => {
    // For client links if the history state contains seo url information we can omit the api call
    if (import.meta.client) {
      if (history.state?.routeName) {
        return {
          routeName: history.state?.routeName,
          foreignKey: history.state?.foreignKey,
        };
      }
    }
    return await resolvePath(routePath);
  },
);

if (!seoResult.value?.foreignKey) {
  console.error("[...all].vue:", `No data found in API for ${routePath}`);

  throw createError({
    statusCode: 404,
    statusMessage: `No data fetched from API for ${routePath}`,
  });
}

const { routeName, foreignKey } = useNavigationContext(
  seoResult as Ref<Schemas["SeoUrl"]>,
);

const componentName = computed(() =>
  routeName.value ? pascalCase(routeName.value) : null,
);

const resolvedPageComponent = computed(() => {
  if (!componentName.value) {
    return null;
  }

  const component = resolveComponent(componentName.value);
  return component === componentName.value ? null : component;
});
</script>

<template>
  <component
    :is="resolvedPageComponent"
    v-if="resolvedPageComponent"
    :navigation-id="foreignKey"
  />
  <div v-else-if="componentName">
    {{ `Problem resolving component: ${componentName}` }}
  </div>
  <div v-else>No component found</div>
</template>
