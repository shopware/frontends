---
head:
  - - meta
    - name: og:title
      content: Implement a Missing CMS Component
  - - meta
    - name: og:description
      content: "Step-by-step guide to implementing a CMS element or block that is missing from your Shopware Frontends project."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Missing%20CMS%20Component.png?fontSize=120px"
nav:
  position: 25
---

<script setup>
import { useRoute } from 'vitepress'
import { computed, ref, watch, onMounted } from 'vue'

const route = useRoute()

const rawSearch = ref('')
onMounted(() => { rawSearch.value = window.location.search })
watch(() => route.path, () => { rawSearch.value = window.location.search })

const params = computed(() => {
  const sp = new URLSearchParams(rawSearch.value)
  return {
    component: sp.get('component'),
    type: sp.get('type'),
  }
})

// Sanitize: only allow valid PascalCase component names (letters, numbers)
const componentName = computed(() => {
  const raw = params.value.component || ''
  const sanitized = raw.replace(/[^a-zA-Z0-9]/g, '')
  return sanitized && /^Cms[A-Z]/.test(sanitized) ? sanitized : 'CmsElementMyCustomSlider'
})
const cmsType = computed(() => {
  const allowed = ['element', 'block', 'section']
  return allowed.includes(params.value.type || '') ? params.value.type : 'element'
})
const hasContext = computed(() => !!params.value.component)

const schemaType = computed(() => {
  switch (cmsType.value) {
    case 'block': return 'CmsBlock'
    case 'section': return 'CmsSection'
    default: return 'CmsSlot'
  }
})
</script>

# Implement a Missing CMS Component

<div v-if="hasContext" class="custom-block tip">
  <p class="custom-block-title">Your missing component</p>
  <p>You need to create <strong>{{ componentName }}.vue</strong> ({{ cmsType }})</p>
</div>

You are here because a CMS {{ cmsType }} in your storefront has no matching Vue component. In development mode this shows as a highlighted placeholder instead of the actual content.

This page will take you from placeholder to working component in a few minutes.

## What is happening

The Shopware API returns a CMS tree of sections, blocks, and slots. Each node has a `type` field. The `cms-base-layer` package resolves a Vue component for each type by converting the name to PascalCase:

| API node | `type` value | expected component |
|---|---|---|
| `cms_section` | `sidebar` | `CmsSectionSidebar.vue` |
| `cms_block` | `image-text` | `CmsBlockImageText.vue` |
| `cms_slot` | `my-custom-slider` | `CmsElementMyCustomSlider.vue` |

If no matching component exists, the placeholder appears. Your job is to create that component.

## Is this a default Shopware CMS component?

The `@shopware/cms-base-layer` package ships implementations for all **default** Shopware 6 CMS blocks and elements. If you are seeing a placeholder for a type that ships with a standard Shopware 6 installation (not a custom plugin or your own block), this is a missing implementation in the package itself.

::: warning Missing a default component?
If the component type is part of **core Shopware 6 CMS** and is not covered by `cms-base-layer`, please open an issue so we can add it:

👉 [Create an issue on GitHub](https://github.com/shopware/frontends/issues/new?labels=cms-base)

Add the **`cms-base`** label to the issue. Include the component name shown in the placeholder, the `type` value, and the `apiAlias` from the API response. You can copy the full content JSON from the **copy AI prompt** button in the placeholder.
:::

If the component belongs to a custom plugin or you created the block yourself in the Shopware backend, continue with the steps below.

## Step 1 — Create the file

<div v-if="hasContext" class="custom-block tip">
  <p class="custom-block-title">Your component</p>
  <p>Create <code>components/{{ componentName }}.vue</code></p>
</div>

Create the file anywhere inside your `components/` directory. Nuxt picks it up automatically as a global component:

```
your-project/
└── components/
    └── {{ componentName }}.vue   ← create this
```

## Step 2 — Define the props

Every CMS component receives a single `content` prop. Use the Shopware schema type matching the CMS node type:

```vue
<!-- components/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["{{ schemaType }}"];
}>();
</script>
```

## Step 3 — Render the content

The `content` prop contains everything the API returned for that node. The exact fields depend on your CMS configuration in Shopware, but the structure is always:

- **`content.config`** — editor-configured settings (alignment, display mode, etc.)
- **`content.data`** — resolved data (media objects, products, etc.)
- **`content.translated`** — translated field values

Use the **copy AI prompt** button on the placeholder to get a pre-filled prompt that includes the full `content` JSON for your specific {{ cmsType }} — paste it into any AI assistant to generate a working first draft.

A minimal working {{ cmsType }}:

<div v-if="cmsType === 'block'">

```vue
<!-- components/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsBlock"];
}>();

const { getSlotContent } = useCmsBlock(props.content);
const mainContent = getSlotContent("main");
</script>

<template>
  <div>
    <CmsGenericElement :content="mainContent" />
  </div>
</template>
```

</div>

<div v-else>

```vue
<!-- components/{{ componentName }}.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  content: Schemas["CmsSlot"];
}>();

// config values are typed as `unknown` — assert the shape you need
const title = props.content.config?.title?.value as string | undefined;
</script>

<template>
  <div>
    <h2 v-if="title">{{ title }}</h2>
    <!-- render content.data here -->
  </div>
</template>
```

</div>

## Step 4 — Verify

Save the file. Vite will hot-reload and the placeholder will be replaced by your component. If it still shows, check that:

- the filename exactly matches the expected component name (PascalCase, `.vue` extension)
- the file is inside a directory that Nuxt scans for components

::: tip No restart needed
Nuxt's component auto-import picks up new files without restarting the dev server.
:::

## Going deeper

<PageRef page="create-elements.html" title="Create Elements" sub="Typed composables and helpers for working with CMS element data." />
<PageRef page="create-blocks.html" title="Create Blocks" sub="How to build block layouts with named slots." />
<PageRef page="customize-components.html" title="Customize existing components" sub="Override a default component from cms-base-layer." />
