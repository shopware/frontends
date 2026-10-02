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

If your project is based on the [Vue Starter Template](../introduction/templates/vue-starter-template.html), that package is already installed. If you are using a custom template, follow the instructions in [Install the package](#install-the-package) first.

## Install the package

The `@shopware/cms-base-layer` package provides an implementation of all default CMS components in Shopware's Shopping Experiences. The components use utility classes for styling, but the shared UnoCSS configuration and design tokens now live in a separate layer: `@shopware/unocss-design-tokens-layer`.

First of all, add the package to your project:

<!-- automd:file src="examples/docs-code-examples/src/generated/concepts/shopping-experiences/install-the-package.sh" code lang="bash" no-name -->

```bash
npm install -D @shopware/cms-base-layer
```

<!-- /automd -->

In a Nuxt application, extend the CMS layer and, if you want the shared styling defaults, also extend the design-tokens layer:

<!-- automd:file src="examples/docs-code-examples/src/generated/concepts/shopping-experiences/install-the-package.ts" code lang="ts" no-name -->

```ts
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "@shopware/cms-base-layer",
    "@shopware/unocss-design-tokens-layer",
  ],
  modules: ["@shopware/nuxt-module", "@unocss/nuxt"],
  css: ["@unocss/reset/tailwind-compat.css"],
  unocss: {
    nuxtLayers: true,
  },
});
```

<!-- /automd -->

If you already have your own UnoCSS or Tailwind setup, you can keep using `@shopware/cms-base-layer` without the design-tokens layer and provide your own styling configuration instead.

## CMS rendering workflow

The [Rendering CMS Pages recipe](../frontends-recipes/cms/rendering.html) explains how the CMS tree in the API response — sections, blocks and slots — is resolved to components.

### What is handled automatically

The `@shopware/cms-base-layer` package ships ready-made components for all **default** Shopware CMS blocks and elements. If your project uses this package, those render without any configuration.

### What requires your implementation

A block or element type outside the default set — typically a custom block created in the Shopware backend — has no matching component. In development it renders a placeholder with the component name to create; in production it renders nothing. A missing section type shows a plain "There is no …" line instead, in every mode. [Implement a Missing CMS Component](../guides/cms/missing-component.html) takes you from the placeholder to a working component.

## 3D / spatial media support

Shopping Experiences also support 3D models (GLB format) in image elements, image galleries, and the Spatial Viewer block. The 3D viewer is loaded on demand to keep the default bundle small. See [Working with Images — 3D and spatial media](../guides/page-elements/images.html#_3d-and-spatial-media-glb) for setup instructions.

## How to build Pages, Elements and Blocks?

<PageRef page="../guides/cms/" title="CMS guides" sub="Create, override and implement CMS blocks and elements." />
