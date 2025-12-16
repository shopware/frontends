<script setup lang="ts">
/**
 * Content API Demo Page
 * Demonstrates different loading strategies for the new Content API
 */

definePageMeta({
  layout: "content", // Use minimal layout - content controls everything
});

const strategy = ref<"full" | "skeleton-first" | "decomposed">("full");
const contentPath = ref("product/demo-product");

// For full strategy - fetch immediately on SSR
const { data: fullContent, refresh: refreshFull } = await useFetch(
  () => `/api/mock/content/${contentPath.value}`,
  {
    key: `full-${contentPath.value}`,
    lazy: true,
  },
);

// For skeleton-first strategy
const { data: skeleton, refresh: refreshSkeleton } = await useFetch(
  () => `/api/mock/content-skeleton/${contentPath.value}`,
  {
    key: `skeleton-${contentPath.value}`,
    lazy: true,
  },
);

const pathOptions = [
  { value: "product/demo-product", label: "Product Page" },
  { value: "category/electronics", label: "Category Page" },
  { value: "landing-page/home", label: "Landing Page" },
];

function changeStrategy(newStrategy: typeof strategy.value) {
  strategy.value = newStrategy;

  if (newStrategy === "full") {
    refreshFull();
  } else if (newStrategy === "skeleton-first") {
    refreshSkeleton();
  }
}

function changePath(newPath: string) {
  contentPath.value = newPath;
  refreshFull();
  refreshSkeleton();
}

useHead({
  title: "Content API Demo",
  meta: [
    {
      name: "description",
      content: "Demo of the new Content API with different loading strategies",
    },
  ],
});
</script>

<template>
  <div class="content-demo min-h-screen bg-gray-50">
    <!-- Control Panel -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">
          Content API Demo
        </h1>

        <div class="flex flex-col md:flex-row gap-4">
          <!-- Strategy Selector -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Loading Strategy
            </label>
            <div class="flex gap-2">
              <button
                v-for="strat in ['full', 'skeleton-first', 'decomposed']"
                :key="strat"
                @click="changeStrategy(strat as any)"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                :class="
                  strategy === strat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
              >
                {{ strat }}
              </button>
            </div>
          </div>

          <!-- Path Selector -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content Path
            </label>
            <select
              v-model="contentPath"
              @change="changePath(contentPath)"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="opt in pathOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Info Badge -->
        <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
          <svg
            class="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          Using mock API: <code class="ml-1 font-mono">/api/mock/content/{{ contentPath }}</code>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Strategy: Full Hydration -->
      <div v-if="strategy === 'full'" class="strategy-full">
        <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 class="font-semibold text-green-900">Full Hydration Strategy</h3>
          <p class="text-sm text-green-700 mt-1">
            Complete content fetched in one request. Best for SSR.
          </p>
        </div>

        <ContentPage v-if="fullContent" :content="fullContent" />
        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>

      <!-- Strategy: Skeleton First -->
      <div v-else-if="strategy === 'skeleton-first'" class="strategy-skeleton">
        <div class="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 class="font-semibold text-purple-900">
            Skeleton-First Strategy
          </h3>
          <p class="text-sm text-purple-700 mt-1">
            Loads layout structure first, then hydrates with data on client.
            Progressive enhancement.
          </p>
        </div>

        <ContentHydrator
          v-if="skeleton"
          :path="contentPath"
          :skeleton="skeleton"
          strategy="skeleton-first"
        >
          <template #loading>
            <div class="animate-pulse space-y-4 py-12">
              <div class="h-8 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="grid grid-cols-3 gap-4 mt-8">
                <div class="h-64 bg-gray-200 rounded"></div>
                <div class="h-64 bg-gray-200 rounded"></div>
                <div class="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </template>
        </ContentHydrator>
        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading skeleton...</p>
        </div>
      </div>

      <!-- Strategy: Decomposed -->
      <div v-else-if="strategy === 'decomposed'" class="strategy-decomposed">
        <div class="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 class="font-semibold text-orange-900">Decomposed Strategy</h3>
          <p class="text-sm text-orange-700 mt-1">
            Fetches skeleton + deduplicated data + assignments. Bandwidth
            optimized.
          </p>
        </div>

        <ContentHydrator
          :path="contentPath"
          strategy="decomposed"
        />
      </div>
    </div>

    <!-- Footer Info -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-gray-200">
      <div class="text-center text-sm text-gray-600">
        <p>
          This demo uses the new Content API with mock data. Switch between strategies to see different loading approaches.
        </p>
        <p class="mt-2">
          <NuxtLink to="/content-comparison" class="text-blue-600 hover:underline">
            View comparison with old CMS API →
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
