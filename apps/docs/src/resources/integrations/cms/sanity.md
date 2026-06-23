---
head:
  - - meta
    - name: og:title
      content: Sanity integration (CMS)
  - - meta
    - name: og:description
      content: "Integrate Sanity (headless CMS) with Composable Frontends: a Page Builder for content, Shopware for live commerce."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Sanity%20Integration.png?fontSize=120px"
nav:
  position: 30
---

# Sanity Integration

[<img src="../../../.assets/cms-icons/sanity.svg" alt="Sanity Logo" class="mb-8 h-16" />](https://www.sanity.io/)

[Sanity](https://www.sanity.io/) is a headless CMS where the content model lives in
code and editors compose pages in a real-time Studio. Paired with Composable
Frontends, **Sanity owns the editorial layout** and **Shopware owns commerce** -
the two never duplicate each other.

::: tip Runnable example
A complete, working Nuxt example lives in
[`examples/sanity-cms`](https://github.com/shopware/frontends/tree/main/examples/sanity-cms).
This guide walks through how it is built. The Sanity Studio it reads from is a
standalone project you create separately - see [The Studio](#the-studio-the-editor).
:::

## The pattern: content + commerce

The single rule that makes this work: **store a reference, never a copy.** Sanity
keeps editorial content and a product's _id_; Shopware provides the live data.

| Concern | Owner | Why |
| --- | --- | --- |
| Page layout, sections, copy, images, **which products to feature** | **Sanity** | editorial, versioned, editor-controlled |
| Product **price, name, stock, availability, media** | **Shopware** | live commerce data - changes constantly |
| **Cart**, totals, checkout, logged-in user | **Shopware** | transactional, per-user, real-time |

```
Sanity (page.pageBuilder[]) --GROQ--> Nuxt --productIds--> Shopware Store API --> live cards
```

## 1. Install & configure

Add the official [`@nuxtjs/sanity`](https://sanity.nuxtjs.org/) module. It bundles
`@sanity/client`, `@portabletext/vue` and `groq`, and auto-imports
`useSanityQuery`, `groq`, and the `<SanityContent>` / `<SanityImage>` components.

```bash
npx nuxi@latest module add sanity
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@shopware/nuxt-module", "@nuxtjs/sanity"],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "<your-sales-channel-access-token>",
  },
  sanity: {
    projectId: "<your-project-id>",
    dataset: "production",
    apiVersion: "2026-05-15",
    useCdn: true, // public, cacheable reads
  },
});
```

A **public** dataset needs no token for the frontend to read. The Shopware
`accessToken` is your sales-channel key.

## 2. Model content as a Page Builder

In the Studio, a `page` document holds an ordered array of section blocks the
editor arranges freely. The `featuredProducts` block stores **only Shopware
product IDs**:

```ts
// studio/schemaTypes/objects/featuredProducts.ts
import { defineField, defineType } from "sanity";

export const featuredProducts = defineType({
  name: "featuredProducts",
  title: "Featured products",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "productIds",
      title: "Shopware product IDs",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
```

```ts
// studio/schemaTypes/documents/page.ts
defineField({
  name: "pageBuilder",
  type: "array",
  of: [
    { type: "hero" },
    { type: "featuredProducts" },
    { type: "richText" },
    { type: "banner" },
    { type: "gallery" },
  ],
});
```

## 3. Render the page

Fetch the page builder with GROQ and map each block `_type` to a component.
`groq` and `useSanityQuery` are auto-imported.

```vue
<!-- app/app.vue -->
<script setup lang="ts">
const PAGE_QUERY = groq`*[_type == "page"] | order(_createdAt asc)[0]{
  title,
  pageBuilder[]{ ... }
}`;
const { data: page } = await useSanityQuery(PAGE_QUERY);
</script>

<template>
  <PageBuilder :sections="page?.pageBuilder ?? []" />
</template>
```

```vue
<!-- app/components/PageBuilder.vue -->
<script setup lang="ts">
import SectionHero from "./sections/SectionHero.vue";
import SectionFeaturedProducts from "./sections/SectionFeaturedProducts.vue";
// ...

const components = {
  hero: SectionHero,
  featuredProducts: SectionFeaturedProducts,
  // richText, banner, gallery...
};

defineProps<{ sections: Array<{ _key: string; _type: string }> }>();
</script>

<template>
  <component
    :is="components[section._type]"
    v-for="section in sections"
    :key="section._key"
    :section="section"
  />
</template>
```

Rich text uses the module's `<SanityContent :value="block.content" />`, images use
`<SanityImage :asset-id="image.asset._ref" />`.

## 4. Resolve products from Shopware

The `featuredProducts` block arrives with only IDs. Resolve them to live products
with `useProductSearch` during SSR, so the cards render in the initial HTML:

```vue
<!-- app/components/sections/SectionFeaturedProducts.vue -->
<script setup lang="ts">
const props = defineProps<{
  section: { _key?: string; heading?: string; productIds?: string[] };
}>();

const { search } = useProductSearch();

const { data: products } = await useAsyncData(
  `featured-products-${props.section._key}`,
  async () => {
    const ids = props.section.productIds ?? [];
    const resolved = await Promise.all(
      ids.map((id) => search(id).then((r) => r.product).catch(() => null)),
    );
    return resolved.filter(Boolean);
  },
);
</script>
```

::: warning Match the sales channel
Product IDs are **per sales channel**. IDs from one channel return `404` in
another - make sure the IDs stored in Sanity belong to the sales channel your
`accessToken` points to.
:::

## 5. Cart & notifications

Commerce interactions stay with Shopware composables. The product card adds to the
cart and raises a toast; a mini cart reads the live cart:

```ts
const { addToCart } = useAddToCart(product);
const { pushSuccess } = useNotifications();

const add = async () => {
  await addToCart();
  pushSuccess(`${product.value.translated?.name} added to cart`);
};
```

```ts
// the cart is per-user session state - load it on the client, not in cached SSR
const { cartItems, count, totalPrice, isEmpty, removeItem, refreshCart } = useCart();
onMounted(() => refreshCart());
```

## The Studio (the editor)

The Studio - where editors model content and compose pages - is a **standalone**
Sanity project, separate from the Nuxt app. Scaffold one with
`npm create sanity@latest`, add the `page` document and the block schemas shown
above, then run it locally or deploy it to Sanity's hosting:

```bash
npx sanity dev      # http://localhost:3333
npx sanity deploy   # https://<name>.sanity.studio
```

See [Sanity's Studio documentation](https://www.sanity.io/docs/studio) for
creating, configuring and deploying a Studio.

## Resources

- Example: [`examples/sanity-cms`](https://github.com/shopware/frontends/tree/main/examples/sanity-cms)
- [`@nuxtjs/sanity` docs](https://sanity.nuxtjs.org/)
- [Create & deploy a Sanity Studio](https://www.sanity.io/docs/studio)
- [Sanity documentation](https://www.sanity.io/docs)
