<script setup lang="ts">
import {
  getCanonicalPathForTechnicalPath,
  isTechnicalPath,
} from "@shopware/helpers";
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
const localePath = useLocalePath();
const localeRootPath = `/${locale.value}`;
const routePath =
  route.path === localeRootPath
    ? "/"
    : route.path.startsWith(`${localeRootPath}/`)
      ? route.path.slice(localeRootPath.length)
      : route.path;
const isTechnicalUrl = isTechnicalPath(routePath);

const { data: seoResult } = await useAsyncData(
  `cmsResponse${routePath}`,
  async () => {
    // For client links if the history state contains seo url information we can omit the api call
    if (import.meta.client && !isTechnicalUrl) {
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

const canonicalPath = getCanonicalPathForTechnicalPath(
  routePath,
  seoResult.value,
);
const canonicalRedirectTarget = canonicalPath
  ? localePath({ path: canonicalPath, query: route.query })
  : null;

if (canonicalRedirectTarget) {
  await navigateTo(canonicalRedirectTarget, {
    redirectCode: 301,
    replace: true,
  });
}

if (!canonicalRedirectTarget && !seoResult.value?.foreignKey) {
  console.error("[...all].vue:", `No data found in API for ${routePath}`);

  throw createError({
    statusCode: 404,
    statusMessage: `No data fetched from API for ${routePath}`,
  });
}

const navigationContext = computed(() =>
  canonicalRedirectTarget ? null : seoResult.value,
);
const { routeName, foreignKey } = useNavigationContext(
  navigationContext as Ref<Schemas["SeoUrl"] | null>,
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
  <template v-if="!canonicalRedirectTarget">
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
</template>
