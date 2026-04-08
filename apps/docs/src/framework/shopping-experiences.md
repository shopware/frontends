---
head:
  - - meta
    - name: og:title
      content: Shopping Experiences
  - - meta
    - name: og:description
      content: "This guide will discuss how to use and customize Shopping Experiences in your Shopware Frontends project."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Shopping%20Experiences?fontSize=150px"
nav:
  position: 20
---

# Shopping Experiences

This guide will discuss how to use and customize [Shopping Experiences](https://docs.shopware.com/en/shopware-6-en/content/ShoppingExperiences) in your Shopware Frontends project.

## How it works

Shopping Experiences are implemented as a dedicated package that you can install in your project.

If your project is based on the [Demo Store Template](../getting-started/templates/demo-store-template), that package is already installed. If you are using a custom template, follow the instructions in [Install the package](#install-the-package) first.

## Install the package

The `@shopware/cms-base-layer` package provides an implementation of all default CMS components in Shopware's Shopping Experiences. It uses Tailwind.css syntax for styling. You will now use it to render a content page.

First of all, add the package to your project:

```bash
npm install -D @shopware/cms-base-layer
```

Next, you need to register all components in its `components/public` directory globally. How to do it, depends on your environment. However, the package also comes with a nuxt module which does that for you. So in any Nuxt application, you can just add if to the `modules` section of your Nuxt config file:

```diff
/* nuxt.config.ts */

export default defineNuxtConfig({
  /* ... */
- modules: [/* ... */, "@shopware/nuxt-module"],
+ modules: [/* ... */, "@shopware/cms-base-layer"],
});
```

## CMS rendering workflow

Understanding how the API data flows into rendered components helps you know what's automatic and what requires your own implementation.

### Data → Component mapping

The Shopware API returns a nested CMS tree:

```
CmsPage
  └── CmsSection  (type e.g. "default", "sidebar")
        └── CmsBlock    (type e.g. "image-text", "product-slider")
              └── CmsSlot     (type e.g. "image", "text")
```

Each node has a `type` field. The `cms-base-layer` package resolves a Vue component for every node by converting the type to a PascalCase component name:

| API node | type value | resolved component |
|---|---|---|
| `cms_section` | `default` | `CmsSectionDefault` |
| `cms_block` | `image-text` | `CmsBlockImageText` |
| `cms_slot` | `image` | `CmsElementImage` |

This resolution is done by `resolveCmsComponent` from `@shopware/composables`.

### What is handled automatically

The `@shopware/cms-base-layer` package ships ready-made components for all **default** Shopware CMS blocks and elements. If your project uses this package, those render without any configuration.

### What requires your implementation

Any CMS block or element type that is **not** part of the default set — typically custom blocks created in the Shopware backend — will not have a matching component. In development mode you will see an outlined placeholder where the component is missing, with:

- the expected component name to create (e.g. `CmsElementMyCustomSlider.vue`)
- a link to the relevant docs
- a one-click "copy AI prompt" button pre-filled with the live API data for that element

In production the placeholder is invisible (renders nothing), so missing components fail silently.

### Implementing a missing component

When a CMS element or block has no matching Vue component, the dev-mode placeholder gives you everything you need to get started quickly.

**Using the placeholder:**

1. Open your browser on any page that contains the unimplemented CMS type.
2. You will see a highlighted placeholder showing the expected component name (e.g. `CmsElementMyCustomSlider`).
3. Click **docs ↗** to open the relevant implementation guide.
4. Click **copy AI prompt** to copy a ready-to-use prompt to your clipboard. It includes:
   - the exact component name and CMS type
   - the full `content` prop JSON as returned by the API (including `config` and `data` fields)
   - a reference to the docs
5. Paste the prompt into your AI coding assistant to generate a working first draft of the component.

**Completing the implementation:**

1. Create a file with the expected component name in your project, e.g. `components/CmsElementMyCustomSlider.vue`.
2. Nuxt auto-imports it as a global component, which is picked up by the resolver — the placeholder will disappear on the next hot-reload.
3. Use `defineProps<{ content: Schemas["CmsSlot"] }>()` and access `content.data` / `content.config` for the element's data.

::: tip Console warnings
In development mode the browser console also logs a warning for each missing component, including the component name to create and a direct link to the relevant docs page.
:::

## 3D / spatial media support

Shopping Experiences also support 3D models (GLB format) in image elements, image galleries, and the Spatial Viewer block. The 3D viewer is loaded on demand to keep the default bundle small. See [Working with Images — 3D and spatial media](../getting-started/page-elements/images.html#_3d-and-spatial-media-glb) for setup instructions.

## How to build Pages, Elements and Blocks?

<PageRef page="../getting-started/cms/" title="BUILDGING > CMS" sub="See the buliding chapter about CMS." />
