<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from "vue";
import {
  apiClient,
  SHOPWARE_ENDPOINT,
  SHOPWARE_ACCESS_TOKEN,
} from "../shopware";

// Import CmsPage component from cms-base-layer
const CmsPage = defineAsyncComponent(
  () =>
    import("@shopware/cms-base-layer/app/components/public/cms/CmsPage.vue"),
);

// State
const cmsPageData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const isUsingMockData = ref(false);

// Mock CMS page data for fallback
const mockCmsPageData = {
  type: "page",
  sections: [
    {
      type: "default",
      blocks: [
        {
          type: "text",
          slots: [
            {
              type: "text",
              slot: "content",
              data: {
                content: `
                  <h1>Summer Trends - CMS Page Demo</h1>
                  <p>This is <strong>mock data</strong> because the Shopware API is not available.</p>
                  <p>To see the real Summer Trends category page, configure a valid Shopware endpoint and access token.</p>
                  <h2>What you should see with a real API:</h2>
                  <ul>
                    <li>Summer Trends category CMS layout</li>
                    <li>Hero banners and image galleries</li>
                    <li>Product sliders and listings</li>
                    <li>Rich content blocks</li>
                  </ul>
                `,
              },
              config: {},
            },
          ],
        },
      ],
    },
  ],
};

async function fetchHomePage() {
  isLoading.value = true;
  error.value = null;
  isUsingMockData.value = false;

  try {
    // Step 1: Resolve SEO URL to get category ID
    const seoResult = await apiClient.invoke("readSeoUrl post /seo-url", {
      body: {
        filter: [
          {
            type: "equals",
            field: "seoPathInfo",
            value: "Summer-Trends/",
          },
        ],
      },
    });

    const categoryId = seoResult?.data.elements?.[0]?.foreignKey;
    console.log(
      "[CmsPageDemo] Found category ID for Summer-Trends:",
      categoryId,
    );

    if (!categoryId) {
      throw new Error(
        "Could not find Summer-Trends category from SEO URL",
        seoResult,
      );
    }

    // Step 2: Fetch category with CMS page associations
    const category = await apiClient.invoke(
      "readCategory post /category/{categoryId}",
      {
        pathParams: {
          categoryId,
        },
        body: {
          associations: {
            cmsPage: {
              associations: {
                sections: {
                  associations: {
                    blocks: {
                      associations: {
                        slots: {},
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    );

    if (category?.data?.cmsPage) {
      cmsPageData.value = category?.data?.cmsPage;
      console.log(
        "[CmsPageDemo] Successfully loaded CMS page:",
        category?.data?.cmsPage,
      );
    } else {
      throw new Error("No CMS page found in category");
    }
  } catch (err: any) {
    console.error("[CmsPageDemo] Error fetching CMS page:", err);
    error.value = err.message || "Failed to fetch CMS page";

    // Fallback to mock data
    isUsingMockData.value = true;
    cmsPageData.value = mockCmsPageData;
  } finally {
    isLoading.value = false;
  }
}

// Fetch on mount
onMounted(() => {
  fetchHomePage();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Status Banner -->
    <div v-if="isLoading" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
        <p class="text-lg">Loading CMS page from Shopware API...</p>
      </div>
    </div>

    <div v-else-if="isUsingMockData" class="bg-orange-50 border border-orange-200 rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-2">📦 Using Mock Data</h3>
      <p class="mb-3 text-sm"><strong>Could not connect to Shopware API:</strong> {{ error }}</p>
      <div class="text-sm space-y-2">
        <p>
          Displaying mock CMS page data. This might happen if:
        </p>
        <ul class="list-disc list-inside ml-4 space-y-1">
          <li>The demo API is temporarily unavailable</li>
          <li>Network connectivity issues</li>
          <li>Invalid API endpoint or access token</li>
        </ul>
        <p class="mt-3">
          To connect to your own Shopware instance, update the API configuration in
          <code class="bg-orange-100 px-2 py-1 rounded">src/shopware.ts</code>
        </p>
      </div>
    </div>

    <div v-else class="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-2">✅ Live Data Loaded</h3>
      <p>Successfully fetched CMS page from Shopware API: {{ SHOPWARE_ENDPOINT }}</p>
    </div>

    <!-- Configuration Info -->
    <details class="border border-outline-primary rounded-lg p-4">
      <summary class="cursor-pointer font-semibold text-brand-primary">
        API Configuration
      </summary>
      <div class="mt-4 space-y-2 text-sm">
        <div class="flex gap-2">
          <span class="font-semibold min-w-32">Endpoint:</span>
          <code class="bg-gray-100 px-2 py-1 rounded">{{ SHOPWARE_ENDPOINT }}</code>
        </div>
        <div class="flex gap-2">
          <span class="font-semibold min-w-32">Access Token:</span>
          <code class="bg-gray-100 px-2 py-1 rounded">{{ SHOPWARE_ACCESS_TOKEN.substring(0, 20) }}...</code>
        </div>
        <p class="mt-4 text-gray-600">
          Update these values in <code>src/shopware.ts</code> to connect to your Shopware instance.
        </p>
        <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
          <strong>Note:</strong> The endpoint must include <code>/store-api</code> suffix
          (e.g., <code>https://your-store.com/store-api</code>)
        </div>
      </div>
    </details>

    <!-- CMS Page Rendering -->
    <div class="border border-outline-primary rounded-lg p-6">
      <h3 class="text-2xl font-semibold mb-4 text-brand-primary">CMS Page Content</h3>

      <Suspense>
        <template #default>
          <div v-if="cmsPageData" class="cms-page-wrapper">
            <CmsPage :content="cmsPageData" />
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            No CMS page data available
          </div>
        </template>
        <template #fallback>
          <div class="animate-pulse space-y-4">
            <div class="h-32 bg-gray-200 rounded"></div>
            <div class="h-48 bg-gray-200 rounded"></div>
            <div class="h-32 bg-gray-200 rounded"></div>
          </div>
        </template>
      </Suspense>
    </div>

    <!-- Debug Info -->
    <details class="border border-outline-primary rounded-lg p-4">
      <summary class="cursor-pointer font-semibold text-brand-primary">
        View CMS Page Data Structure
      </summary>
      <pre class="mt-4 text-xs bg-gray-100 p-4 rounded overflow-x-auto max-h-96"><code>{{ cmsPageData }}</code></pre>
    </details>

    <!-- Implementation Notes -->
    <section class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-2">💡 How This Works</h3>
      <ol class="list-decimal list-inside space-y-2 text-sm">
        <li>Creates API client with <code>createAPIClient()</code></li>
        <li>Fetches navigation to find home category ID</li>
        <li>Fetches category with full CMS page associations</li>
        <li>Passes <code>cmsPage</code> data to <code>&lt;CmsPage&gt;</code> component</li>
        <li>CmsPage automatically renders all sections, blocks, and elements</li>
        <li>Falls back to mock data if API is unavailable</li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.cms-page-wrapper {
  /* Add any custom styling for CMS page rendering here */
  min-height: 200px;
}
</style>
