<script setup lang="ts">
/**
 * Simple Content API Demo - With Separated Props
 *
 * This demonstrates the separation of concerns:
 * - htmlProps: Standard HTML attributes (class, id, style, aria-*, data-*)
 * - props: Component-specific data (title, content, url, etc.)
 *
 * Benefits:
 * - htmlProps are fully typed (known HTML attributes)
 * - props are component-specific and can be typed per component
 * - Clear separation between styling/a11y and content data
 */

// Type definitions for the separated props approach
type HtmlProps = {
  class?: string;
  id?: string;
  style?: Record<string, string>;
  // Accessibility
  role?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  // Data attributes
  dataTestid?: string;
};

type ContentElement = {
  apiAlias: "content_element";
  id: string;
  component: string;
  // HTML attributes - fully typed, universal
  htmlProps?: HtmlProps;
  // Component-specific props - typed per component
  props?: Record<string, unknown>;
  // Legacy support
  properties?: Record<string, unknown>;
};

// Mock content with separated htmlProps and props
const mockContent = {
  apiAlias: "content_page" as const,
  layoutId: "demo-layout-001",
  layoutName: "Simple Demo Layout",
  layoutVersion: "1.0.0",
  elements: [
    {
      apiAlias: "content_element" as const,
      id: "text-hero",
      component: "Sw:Content:Text",
      // HTML attributes - styling & accessibility
      htmlProps: {
        class: "bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl",
        id: "hero-section",
        ariaLabel: "Hero section",
        dataTestid: "hero-text",
      },
      // Component-specific data
      props: {
        title: "Welcome to the New Content System",
        content:
          "<p>This demo shows the <strong>separated props</strong> approach where HTML attributes and component data are kept separate.</p>",
        alignment: "center",
      },
    },
    {
      apiAlias: "content_element" as const,
      id: "image-hero",
      component: "Sw:Content:Image",
      htmlProps: {
        class: "rounded-lg shadow-lg overflow-hidden",
        dataTestid: "hero-image",
      },
      props: {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop",
        alt: "Modern e-commerce storefront",
        title: "Shopping Experience",
        displayMode: "standard",
      },
    },
    {
      apiAlias: "content_element" as const,
      id: "text-explanation",
      component: "Sw:Content:Text",
      htmlProps: {
        class: "bg-white border border-gray-200 p-6 rounded-lg",
      },
      props: {
        title: "Two Types of Props",
        content: `
          <div class="grid md:grid-cols-2 gap-6">
            <div class="p-4 bg-blue-50 rounded">
              <h4 class="font-bold text-blue-800 mb-2">htmlProps</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• class, id, style</li>
                <li>• aria-label, role</li>
                <li>• data-* attributes</li>
                <li>• Fully typed (known set)</li>
              </ul>
            </div>
            <div class="p-4 bg-green-50 rounded">
              <h4 class="font-bold text-green-800 mb-2">props</h4>
              <ul class="text-sm text-green-700 space-y-1">
                <li>• title, content, url</li>
                <li>• Component-specific data</li>
                <li>• Typed per component</li>
                <li>• Business logic data</li>
              </ul>
            </div>
          </div>
        `,
        alignment: "left",
      },
    },
    {
      apiAlias: "content_element" as const,
      id: "image-diagram",
      component: "Sw:Content:Image",
      htmlProps: {
        class: "border-4 border-dashed border-gray-300 rounded-lg p-2",
        style: { background: "#fafafa" },
      },
      props: {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        alt: "Data visualization",
        displayMode: "standard",
      },
    },
  ] as ContentElement[],
};
</script>

<template>
  <div class="content-simple-demo max-w-4xl mx-auto px-4 py-8">
    <!-- Page Header -->
    <header class="mb-8 pb-4 border-b">
      <h1 class="text-3xl font-bold text-gray-900">
        Content API Demo
        <span class="text-lg font-normal text-gray-500">
          - Separated Props
        </span>
      </h1>
      <p class="text-gray-600 mt-2">
        Layout: {{ mockContent.layoutName }}
      </p>
    </header>

    <!-- Content Elements -->
    <div class="space-y-8">
      <div
        v-for="element in mockContent.elements"
        :key="element.id"
        v-bind="element.htmlProps"
        :data-element-id="element.id"
        :data-component="element.component"
      >
        <!-- Render ContentText -->
        <ContentText
          v-if="element.component === 'Sw:Content:Text'"
          :element="element"
          :properties="element.props || {}"
        />

        <!-- Render ContentImage -->
        <ContentImage
          v-else-if="element.component === 'Sw:Content:Image'"
          :element="element"
          :properties="element.props || {}"
        />

        <!-- Fallback for unknown components -->
        <div
          v-else
          class="p-4 bg-yellow-50 border border-yellow-200 rounded"
        >
          <p class="text-yellow-800">
            Unknown component: {{ element.component }}
          </p>
        </div>
      </div>
    </div>

    <!-- Debug: Show Raw Data -->
    <details class="mt-12 p-4 bg-gray-100 rounded-lg">
      <summary class="cursor-pointer font-medium text-gray-700">
        View Raw API Response (with separated props)
      </summary>
      <pre class="mt-4 text-xs overflow-auto p-4 bg-gray-900 text-green-400 rounded">{{
        JSON.stringify(mockContent, null, 2)
      }}</pre>
    </details>

    <!-- Props Comparison -->
    <div class="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-bold mb-4">Props Comparison</h3>
      <div class="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 class="font-medium text-gray-700 mb-2">Old Approach (mixed)</h4>
          <pre class="bg-gray-800 text-gray-300 p-3 rounded text-xs">{
  "properties": {
    "title": "Hello",
    "class": "my-class",  // mixed!
    "aria-label": "..."   // mixed!
  }
}</pre>
        </div>
        <div>
          <h4 class="font-medium text-gray-700 mb-2">New Approach (separated)</h4>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-xs">{
  "htmlProps": {
    "class": "my-class",
    "ariaLabel": "..."
  },
  "props": {
    "title": "Hello"
  }
}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
