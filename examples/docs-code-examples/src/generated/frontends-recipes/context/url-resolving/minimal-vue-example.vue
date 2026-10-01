<script setup lang="ts">
import {
  getCanonicalPathForTechnicalPath,
  isTechnicalPath,
} from "@shopware/helpers";
import { pascalCase } from "scule";

import { useI18n, useLocalePath } from "#imports";
import type { Schemas } from "#shopware";

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
const isTechnical = isTechnicalPath(routePath);

const { data: seoResult, error: resolveError } = await useAsyncData(
  `seo-url:${locale.value}:${routePath}`,
  async () => {
    if (import.meta.client && !isTechnical) {
      const { routeName: stateRouteName, foreignKey: stateForeignKey } =
        history.state ?? {};

      if (stateRouteName && stateForeignKey) {
        return {
          routeName: stateRouteName,
          foreignKey: stateForeignKey,
        } as Schemas["SeoUrl"];
      }
    }

    return await resolvePath(routePath);
  },
);

if (resolveError.value) {
  throw createError({
    statusCode: 503,
    statusMessage: `Could not resolve ${routePath}`,
    cause: resolveError.value,
    fatal: true,
  });
}

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
  throw createError({
    statusCode: 404,
    statusMessage: `No data fetched from API for ${routePath}`,
  });
}

const { routeName, foreignKey } = useNavigationContext(
  ref((canonicalRedirectTarget ? null : seoResult.value) ?? null),
);

const componentName = routeName.value ? pascalCase(routeName.value) : null;
const resolved = componentName ? resolveComponent(componentName) : null;
const pageComponent = resolved === componentName ? null : resolved;

if (!canonicalRedirectTarget && !pageComponent) {
  throw createError({
    statusCode: 404,
    statusMessage: `No page component for ${routePath}`,
  });
}
</script>

<template>
  <component
    :is="pageComponent"
    v-if="pageComponent"
    :navigation-id="foreignKey"
  />
</template>
