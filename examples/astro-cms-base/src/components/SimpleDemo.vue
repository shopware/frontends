<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import type { CmsElementText, CmsElementImage } from "@shopware/composables";

// Import CMS components from cms-base-layer
// Note: In a real Shopware project, these would receive data from the CMS API
const CmsElementText = defineAsyncComponent(
  () =>
    import(
      "@shopware/cms-base-layer/app/components/public/cms/element/CmsElementText.vue"
    ),
);
const CmsElementImage = defineAsyncComponent(
  () =>
    import(
      "@shopware/cms-base-layer/app/components/public/cms/element/CmsElementImage.vue"
    ),
);

// Mock CMS data structure for demonstration
// In a real application, this would come from Shopware API
const textElement = ref<CmsElementText>({
  type: "text",
  data: {
    content: `
      <h2>Welcome to CMS Base Components in Astro!</h2>
      <p>This is a <strong>CmsElementText</strong> component rendering HTML content.</p>
      <p>It supports:</p>
      <ul>
        <li>Rich HTML formatting</li>
        <li>Links and buttons</li>
        <li>Custom styling</li>
      </ul>
      <p>You can use <a href="https://shopware.com">links</a> and other HTML elements.</p>
    `,
  },
  config: {},
  apiAlias: "cms_text",
});

const imageElement = ref<CmsElementImage>({
  type: "image",
  data: {
    media: {
      url: "https://via.placeholder.com/800x400/1976d2/ffffff?text=CMS+Image+Component",
      alt: "Placeholder image",
      thumbnails: [],
    },
  },
  config: {
    displayMode: { value: "cover" },
  },
  apiAlias: "cms_image",
});
</script>

<template>
  <div class="space-y-8">
    <!-- Text Element Demo -->
    <section class="border border-outline-primary rounded-lg p-6">
      <h3 class="text-2xl font-semibold mb-4 text-brand-primary">CmsElementText Example</h3>
      <div class="bg-white p-4 rounded">
        <Suspense>
          <template #default>
            <CmsElementText :content="textElement" />
          </template>
          <template #fallback>
            <div class="animate-pulse">Loading text component...</div>
          </template>
        </Suspense>
      </div>
      <details class="mt-4">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-brand-primary">
          View component data structure
        </summary>
        <pre class="mt-2 text-xs bg-gray-100 p-4 rounded overflow-x-auto"><code>{{ textElement }}</code></pre>
      </details>
    </section>

    <!-- Image Element Demo -->
    <section class="border border-outline-primary rounded-lg p-6">
      <h3 class="text-2xl font-semibold mb-4 text-brand-primary">CmsElementImage Example</h3>
      <div class="bg-white p-4 rounded" style="height: 300px;">
        <Suspense>
          <template #default>
            <CmsElementImage :content="imageElement" />
          </template>
          <template #fallback>
            <div class="animate-pulse h-full bg-gray-200 rounded">Loading image component...</div>
          </template>
        </Suspense>
      </div>
      <details class="mt-4">
        <summary class="cursor-pointer text-sm text-gray-600 hover:text-brand-primary">
          View component data structure
        </summary>
        <pre class="mt-2 text-xs bg-gray-100 p-4 rounded overflow-x-auto"><code>{{ imageElement }}</code></pre>
      </details>
    </section>

    <!-- Info Section -->
    <section class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-2">💡 Integration Notes</h3>
      <ul class="list-disc list-inside space-y-2 text-sm">
        <li>Components are loaded asynchronously with <code>defineAsyncComponent</code></li>
        <li>We use <code>&lt;Suspense&gt;</code> to handle loading states</li>
        <li>Mock data mimics the Shopware CMS API response structure</li>
        <li>In production, you'd fetch this data from Shopware's Store API</li>
        <li>The <code>#imports</code> alias is resolved to <code>@shopware/composables</code></li>
      </ul>
    </section>
  </div>
</template>
