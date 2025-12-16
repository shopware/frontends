<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useContent } from "~/composables/useContent/useContent";
import { useContentHydration } from "~/composables/useContentHydration/useContentHydration";
import type { Schemas } from "#shopware";
import ContentPage from "./ContentPage.vue";

const props = defineProps<{
  /**
   * Content path (e.g., "product/my-product-id")
   */
  path: string;

  /**
   * Pre-fetched skeleton (for SSR skeleton-first strategy)
   * If provided, data will be fetched on client mount
   */
  skeleton?: Schemas["ContentSkeletonPage"];

  /**
   * Pre-fetched full content (for SSR full hydration)
   * If provided, no additional fetching occurs
   */
  content?: Schemas["ContentPage"];

  /**
   * Loading strategy:
   * - "full": Fetch fully hydrated content (default for SSR)
   * - "skeleton-first": Fetch skeleton, then hydrate with data (progressive)
   * - "decomposed": Fetch decomposed format all at once
   */
  strategy?: "full" | "skeleton-first" | "decomposed";

  /**
   * Optional language ID
   */
  languageId?: string;

  /**
   * Optional element ID for partial rendering
   */
  elementId?: string;
}>();

const { fetchFullContent, fetchSkeleton, fetchData, fetchDecomposed } =
  useContent();
const { hydrate } = useContentHydration();

const hydratedContent = ref<Schemas["ContentPage"] | undefined>(props.content);
const skeletonData = ref<Schemas["ContentSkeletonPage"] | undefined>(
  props.skeleton,
);
const isLoading = ref(false);
const error = ref<Error | undefined>();

const effectiveStrategy = computed(() => {
  // If content is provided, no fetching needed
  if (props.content) return "none";

  // If skeleton is provided, use skeleton-first
  if (props.skeleton) return "skeleton-first";

  // Otherwise use provided strategy or default to full
  return props.strategy || "full";
});

const showSkeleton = computed(() => {
  return skeletonData.value && !hydratedContent.value && !isLoading.value;
});

const showContent = computed(() => {
  return hydratedContent.value && !error.value;
});

/**
 * Fetch and hydrate content based on strategy
 */
async function loadContent() {
  if (effectiveStrategy.value === "none") {
    return;
  }

  isLoading.value = true;
  error.value = undefined;

  try {
    const options = {
      languageId: props.languageId,
      elementId: props.elementId,
    };

    switch (effectiveStrategy.value) {
      case "full":
        hydratedContent.value = await fetchFullContent(props.path, options);
        break;

      case "skeleton-first": {
        if (!skeletonData.value) {
          skeletonData.value = await fetchSkeleton(props.path, options);
        }

        // Fetch data and hydrate
        const dataResponse = await fetchData(props.path, options);
        hydratedContent.value = hydrate(
          skeletonData.value,
          (dataResponse.data || {}) as Record<string, unknown>,
          (dataResponse.assignments || {}) as Record<
            string,
            Record<string, string>
          >,
        );
        break;
      }

      case "decomposed": {
        const decomposed = await fetchDecomposed(props.path, options);
        hydratedContent.value = hydrate(
          {
            ...decomposed,
            apiAlias: "content_skeleton_page",
            elements: decomposed.skeletons,
          },
          (decomposed.data || {}) as Record<string, unknown>,
          (decomposed.assignments || {}) as Record<
            string,
            Record<string, string>
          >,
        );
        break;
      }
    }
  } catch (e) {
    error.value = e as Error;
    console.error("Failed to load content:", e);
  } finally {
    isLoading.value = false;
  }
}

// Load content on mount (client-side)
onMounted(() => {
  if (effectiveStrategy.value !== "none") {
    loadContent();
  }
});
</script>

<template>
  <div class="content-hydrator">
    <!-- Loading state -->
    <div v-if="isLoading" class="content-loading">
      <slot name="loading">
        <div class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </slot>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="content-error">
      <slot name="error" :error="error">
        <div class="bg-red-50 border border-red-200 rounded p-4 text-red-800">
          <strong>Error loading content:</strong> {{ error.message }}
        </div>
      </slot>
    </div>

    <!-- Skeleton state (before hydration) -->
    <div v-else-if="showSkeleton && skeletonData" class="content-skeleton">
      <ContentPage :content="{ ...skeletonData, apiAlias: 'content_page' }" />
    </div>

    <!-- Hydrated content -->
    <div v-else-if="showContent && hydratedContent" class="content-hydrated">
      <ContentPage :content="hydratedContent" />
    </div>

    <!-- Fallback -->
    <div v-else class="content-empty">
      <slot name="empty">
        <div class="text-gray-500">No content available</div>
      </slot>
    </div>
  </div>
</template>
