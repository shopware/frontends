<script setup lang="ts">
/**
 * Content API Comparison Page
 * Side-by-side comparison of old CMS API vs new Content API
 */

definePageMeta({
  layout: "content",
});

import type { Schemas } from "#shopware";

const contentPath = "product/demo-product";

// Fetch both old CMS and new Content
const { data: newContent } = await useFetch<Schemas["ContentPage"]>(
  `/api/mock/content/${contentPath}`,
);

// Mock old CMS data (would normally come from CMS API)
const oldCmsPage = ref({
  apiAlias: "cms_page",
  type: "product_detail",
  sections: [
    {
      type: "default",
      blocks: [
        {
          type: "image-text",
          slots: [
            {
              type: "image",
              config: { displayMode: { value: "cover" } },
              data: {
                media: {
                  url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                },
              },
            },
            {
              type: "text",
              config: {},
              data: {
                content:
                  "<h2>Old CMS API</h2><p>Traditional sections → blocks → slots hierarchy</p>",
              },
            },
          ],
        },
      ],
    },
  ],
});

useHead({
  title: "CMS vs Content API Comparison",
});
</script>

<template>
  <div class="comparison-page min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          CMS API vs Content API
        </h1>
        <p class="text-gray-600">
          Side-by-side comparison of the old and new content systems
        </p>
        <div class="mt-4">
          <NuxtLink to="/content-demo" class="text-blue-600 hover:underline">
            ← Back to demo
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Comparison Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Old CMS API -->
        <div class="comparison-old">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h2 class="text-xl font-bold text-red-900 mb-2">
              ❌ Old CMS API
            </h2>
            <ul class="text-sm text-red-700 space-y-1">
              <li>• Deeply nested: sections → blocks → slots</li>
              <li>• Mixed config + data objects</li>
              <li>• Large response size (no deduplication)</li>
              <li>• Fixed hierarchy</li>
              <li>• Only controls <code>&lt;main&gt;</code> area</li>
            </ul>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Data Structure</h3>
            <pre class="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96"><code>{{
              JSON.stringify(
                {
                  type: "product_detail",
                  sections: [
                    {
                      type: "default",
                      blocks: [
                        {
                          type: "image-text",
                          slots: [
                            {
                              type: "image",
                              config: { displayMode: "cover" },
                              data: { media: "..." },
                            },
                            {
                              type: "text",
                              config: {},
                              data: { content: "..." },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                null,
                2
              )
            }}</code></pre>

            <div class="mt-4 text-sm text-gray-600">
              <strong>Component Resolution:</strong><br />
              <code class="bg-gray-100 px-2 py-1 rounded">section.type</code> → <code class="bg-gray-100 px-2 py-1 rounded">CmsSectionDefault</code><br />
              <code class="bg-gray-100 px-2 py-1 rounded">block.type</code> → <code class="bg-gray-100 px-2 py-1 rounded">CmsBlockImageText</code>
            </div>
          </div>
        </div>

        <!-- New Content API -->
        <div class="comparison-new">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h2 class="text-xl font-bold text-green-900 mb-2">
              ✅ New Content API
            </h2>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• Flat element tree with nested slots</li>
              <li>• Unified properties object</li>
              <li>• Deduplication support (decomposed)</li>
              <li>• Flexible structure</li>
              <li>• Controls entire page layout</li>
            </ul>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Data Structure</h3>
            <pre
              v-if="newContent"
              class="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96"
            ><code>{{
              JSON.stringify(
                {
                  layoutId: newContent.layoutId,
                  layoutName: newContent.layoutName,
                  elements: [
                    {
                      id: newContent.elements[0]?.id,
                      component: newContent.elements[0]?.component,
                      properties: { columns: 2, gap: "large" },
                      slots: {
                        left: { elements: ["..."] },
                        right: { elements: ["..."] },
                      },
                    },
                  ],
                },
                null,
                2
              )
            }}</code></pre>

            <div class="mt-4 text-sm text-gray-600">
              <strong>Component Resolution:</strong><br />
              <code class="bg-gray-100 px-2 py-1 rounded">element.component</code> → <code class="bg-gray-100 px-2 py-1 rounded">ContentGrid</code><br />
              <code class="bg-gray-100 px-2 py-1 rounded">"Sw:Content:Text"</code> → <code class="bg-gray-100 px-2 py-1 rounded">ContentText</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Rendered Output Comparison -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Rendered Output</h2>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Old CMS Rendered -->
          <div>
            <h3 class="font-semibold text-gray-700 mb-4">Old CMS (Mocked)</h3>
            <div class="bg-white rounded-lg shadow-sm border-2 border-red-200 p-6">
              <div class="space-y-4">
                <div class="aspect-video bg-gray-200 rounded"></div>
                <h2 class="text-2xl font-bold">Old CMS API</h2>
                <p class="text-gray-600">Traditional sections → blocks → slots hierarchy</p>
              </div>
            </div>
          </div>

          <!-- New Content Rendered -->
          <div>
            <h3 class="font-semibold text-gray-700 mb-4">New Content API</h3>
            <div class="bg-white rounded-lg shadow-sm border-2 border-green-200 p-6">
              <ContentPage v-if="newContent" :content="newContent" />
            </div>
          </div>
        </div>
      </div>

      <!-- Benefits Table -->
      <div class="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Feature Comparison</h2>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Old CMS
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                New Content
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 text-sm text-gray-900">Full layout control</td>
              <td class="px-6 py-4 text-center">❌</td>
              <td class="px-6 py-4 text-center">✅</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900">Data deduplication</td>
              <td class="px-6 py-4 text-center">❌</td>
              <td class="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td class="px-6 py-4 text-sm text-gray-900">Skeleton-first loading</td>
              <td class="px-6 py-4 text-center">❌</td>
              <td class="px-6 py-4 text-center">✅</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900">Flexible hierarchy</td>
              <td class="px-6 py-4 text-center">❌</td>
              <td class="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td class="px-6 py-4 text-sm text-gray-900">Progressive enhancement</td>
              <td class="px-6 py-4 text-center">❌</td>
              <td class="px-6 py-4 text-center">✅</td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900">Bandwidth optimization</td>
              <td class="px-6 py-4 text-center">❌</td>
              <td class="px-6 py-4 text-center">✅</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
