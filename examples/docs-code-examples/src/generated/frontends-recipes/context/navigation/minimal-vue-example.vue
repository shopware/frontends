<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Ref } from "vue";

import type { Schemas } from "#shopware";

const props = defineProps<{ navigationId: string }>();

const { search } = useCategorySearch();
const { routeName, foreignKey } = useNavigationContext();
const { breadcrumbs, buildDynamicBreadcrumbs, clearBreadcrumbs } =
  useBreadcrumbs();
const { apiClient } = useShopwareContext();
const router = useRouter();

const { data: categoryResponse, error } = await useAsyncData(
  `categoryPage${props.navigationId}`,
  async () => {
    try {
      return await search(props.navigationId, { withCmsAssociations: true });
    } catch (searchError) {
      if (searchError instanceof ApiClientError && searchError.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: "Category not found",
        });
      }
      throw searchError;
    }
  },
);

if (error.value) {
  throw error.value;
}

if (!categoryResponse.value) {
  throw createError({ statusCode: 404, statusMessage: "Category not found" });
}

const { category } = useCategory(categoryResponse as Ref<Schemas["Category"]>);

const isLoadingBreadcrumbs = ref(false);
const breadcrumbsError = ref<string | null>(null);
const breadcrumbRequest = import.meta.client
  ? new AbortController()
  : undefined;

clearBreadcrumbs();

if (import.meta.client) {
  const removeGuard = router.beforeEach((to, from) => {
    if (to.fullPath !== from.fullPath) breadcrumbRequest?.abort();
  });

  onBeforeUnmount(() => {
    breadcrumbRequest?.abort();
    removeGuard();
  });
}

onMounted(async () => {
  isLoadingBreadcrumbs.value = true;

  try {
    const response = await apiClient.invoke(
      "readBreadcrumb get /breadcrumb/{id}",
      {
        pathParams: { id: props.navigationId },
        fetchOptions: { signal: breadcrumbRequest?.signal },
      },
    );
    await buildDynamicBreadcrumbs(response.data);
  } catch (requestError) {
    if (breadcrumbRequest?.signal.aborted) return;
    breadcrumbsError.value = "The breadcrumb trail could not be loaded.";
    console.error("[CategoryPage]", requestError);
  } finally {
    isLoadingBreadcrumbs.value = false;
  }
});
</script>

<template>
  <nav aria-label="Breadcrumb">
    <p v-if="isLoadingBreadcrumbs" aria-live="polite">
      Loading the breadcrumb trail…
    </p>
    <p v-else-if="breadcrumbsError" role="alert">{{ breadcrumbsError }}</p>

    <ol v-else-if="breadcrumbs?.length">
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="`${breadcrumb.name}-${index}`"
      >
        <NuxtLink
          v-if="breadcrumb.path && index < breadcrumbs.length - 1"
          :to="breadcrumb.path"
        >
          {{ breadcrumb.name }}
        </NuxtLink>
        <span
          v-else
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ breadcrumb.name }}
        </span>
      </li>
    </ol>
  </nav>

  <h1>{{ category.translated?.name ?? category.name }}</h1>

  <p v-if="routeName">
    This URL resolves to {{ routeName }} with the id {{ foreignKey }}.
  </p>
</template>
