---
head:
  - - meta
    - name: og:title
      content: CMS - Integrations
  - - meta
    - name: og:description
      content: "How to integrate external Content Management Systems with Shopware Composable Frontends."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/CMS%20Integrations.png?fontSize=120px"
nav:
  position: 10
---

# CMS Integrations

Composable Frontends does not force one content source. Shopware can render its
own Shopping Experiences, and your storefront can also read from a headless CMS
such as Storyblok, Strapi, Sanity, Contentful, Hygraph, Builder.io, or a custom
editorial API.

The important architectural rule is simple:

**let the CMS own editorial content, and let Shopware own live commerce data.**

That means the CMS can decide what appears on a page, but product names, prices,
availability, variants, cart, checkout, customer data, and promotions should still
come from the Shopware Store API at request time.

## Existing examples

<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
  <div>
    <a href="strapi.html" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow text-gray-700 hover:bg-gray-100 dark:bg-#242424 dark:border-#363636 dark:border-solid dark:hover:bg-#282828 my-5 text-center">
      <span class="hidden dark:block mb-2 text-2xl font-bold tracking-tight text-gray-900"><img src="../../.assets/cms-icons/Strapi.full.logo.light.png" alt="Strapi Logo" class="my-8 h-14 inline" /></span>
      <span class="block dark:hidden mb-2 text-2xl font-bold tracking-tight text-gray-900"><img src="../../.assets/cms-icons/Strapi.full.logo.dark.png" alt="Strapi Logo" class="my-8 h-14 inline" /></span>
      <p class="font-normal text-gray-700 dark:text-gray-400 h-40">Strapi is an open-source headless content management system (CMS). It's built on Node.js and provides a customizable API out of the box. Here's how you can integrate it into Composable Frontends.</p>
    </a>
  </div>
  <div>
    <a href="storyblok.html" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow text-gray-700 hover:bg-gray-100 dark:bg-#242424 dark:border-#363636 dark:border-solid dark:hover:bg-#282828 my-5 text-center">
      <span class="hidden dark:block mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><img src="../../.assets/cms-icons/storyblok.light.svg" alt="storyblok Logo" class="my-8 h-14 inline" /></span>
      <span class="block dark:hidden mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><img src="../../.assets/cms-icons/storyblok.dark.svg" alt="storyblok Logo" class="my-8 h-14 inline" /></span>
      <p class="font-normal text-gray-700 dark:text-gray-400 h-40">Storyblok is a headless Content Management System (CMS) that allows developers to manage and distribute content across multiple platforms. Use the Nuxt Module to integrate it into Composable Frontends.</p>
    </a>
  </div>
  <div>
    <a href="sanity.html" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow text-gray-700 hover:bg-gray-100 dark:bg-#242424 dark:border-#363636 dark:border-solid dark:hover:bg-#282828 my-5 text-center">
      <span class="block mb-2 text-2xl font-bold tracking-tight text-gray-900"><img src="../../.assets/cms-icons/sanity.svg" alt="Sanity Logo" class="my-8 h-14 inline" /></span>
      <p class="font-normal text-gray-700 dark:text-gray-400 h-40">Sanity is a headless CMS where the content model lives in code and editors compose pages in a real-time Studio. This example pairs a Sanity Page Builder for content with Shopware for live commerce (products &amp; cart).</p>
    </a>
  </div>
</div>

## Choose an integration model

Most integrations fit into one of these patterns:

| Pattern                   | Good for                                                                 | How it works                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| CMS as page source        | Landing pages, editorial homepages, campaign pages                       | The external CMS resolves the route and returns a page builder payload. Vue components render each CMS block. |
| CMS as section source     | Global banners, teasers, content slots in product/category pages         | Shopware still resolves the main page. The external CMS fills specific areas.                                 |
| Shopware CMS fallback     | Mixed migrations, gradual adoption, legacy Shopware Shopping Experiences | Try the external CMS first or only when Shopware does not resolve a route.                                    |
| Product references in CMS | Merchandising sections, product carousels, buying guides                 | The CMS stores Shopware product IDs. The frontend resolves live product data with Shopware composables.       |

Use the smallest pattern that solves the project. A global campaign banner should
not need a full route resolver. A full editorial site with nested pages usually
should.

## Recommended architecture

Keep the integration as a thin adapter between three layers:

1. **CMS client**: fetches typed content from the external CMS.
2. **CMS resolver**: maps a route, locale, and request context to a normalized page.
3. **Vue renderer**: maps CMS block types to Vue components.

This keeps vendor SDKs out of your components and makes it easier to replace a
CMS later.

```ts
type CmsRouteContext = {
  path: string;
  locale: string;
  salesChannelId?: string;
};

type CmsBlock = {
  id: string;
  type: string;
  props: Record<string, unknown>;
};

type CmsPage = {
  title?: string;
  seo?: {
    title?: string;
    description?: string;
  };
  blocks: CmsBlock[];
};

type CmsAdapter = {
  resolvePage(context: CmsRouteContext): Promise<CmsPage | null>;
};
```

Then implement the adapter with the CMS tooling your project uses. The rest of
the storefront should only depend on the normalized contract:

```ts
export function createCmsResolver(adapter: CmsAdapter) {
  return async (context: CmsRouteContext) => {
    const page = await adapter.resolvePage(context);

    if (!page) return null;

    return {
      ...page,
      blocks: page.blocks.filter((block) => Boolean(block.type)),
    };
  };
}
```

The adapter can call a REST API, GraphQL API, SDK, or internal service. Keep that
vendor-specific code in one place:

```ts
const cmsAdapter: CmsAdapter = {
  async resolvePage(context) {
    const rawPage = await fetchFromYourCms(context);

    if (!rawPage) return null;

    return normalizeCmsPage(rawPage);
  },
};
```

## Rendering CMS blocks

A page builder should be explicit. Map every external block type to one Vue
component, and render nothing for unknown blocks in production. In development,
show a small placeholder so the missing component is obvious.

```vue
<!-- app/components/ExternalCmsPage.vue -->
<script setup lang="ts">
import type { Component } from "vue";
import CmsHero from "./external-cms/CmsHero.vue";
import CmsRichText from "./external-cms/CmsRichText.vue";
import CmsFeaturedProducts from "./external-cms/CmsFeaturedProducts.vue";

defineProps<{
  blocks: Array<{
    id: string;
    type: string;
    props: Record<string, unknown>;
  }>;
}>();

const components: Record<string, Component> = {
  hero: CmsHero,
  richText: CmsRichText,
  featuredProducts: CmsFeaturedProducts,
};
</script>

<template>
  <template v-for="block in blocks" :key="block.id">
    <component
      :is="components[block.type]"
      v-if="components[block.type]"
      v-bind="block.props"
    />
    <div v-else-if="import.meta.dev" class="border border-dashed p-4 text-sm">
      Missing external CMS component: {{ block.type }}
    </div>
  </template>
</template>
```

This is the same idea used by the [Sanity example](./sanity.html): Sanity
provides a `pageBuilder` array, while Vue maps each `_type` to a section
component.

## Resolving routes

If the external CMS owns complete pages, resolve it from the catch-all route.
If Shopware should remain the primary router, use the [Multiple CMS](../../guides/cms/multiple-cms)
middleware pattern and only render the external CMS when Shopware does not return
a route component.

```vue
<!-- app/pages/[...all].vue -->
<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const { resolvePage } = useExternalCms();

const path =
  route.path.replace(`/${locale.value}`, "").replace(/^\//, "") || "home";

const { data: page } = await useAsyncData(
  `external-cms-${locale.value}-${path}`,
  () => resolvePage(path, locale.value),
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useSeoMeta({
  title: page.value.seo?.title ?? page.value.title,
  description: page.value.seo?.description,
});
</script>

<template>
  <ExternalCmsPage :blocks="page?.blocks ?? []" />
</template>
```

## Connecting content with commerce

Do not copy product data into the CMS. Store stable Shopware identifiers and
resolve them during SSR with Shopware composables.

```vue
<!-- app/components/external-cms/CmsFeaturedProducts.vue -->
<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  heading?: string;
  productIds: string[];
}>();

const { search } = useProductSearch();

const { data: products } = await useAsyncData(
  `external-cms-products-${props.productIds.join("-")}`,
  async () => {
    const resolved = await Promise.all(
      props.productIds.map((id) =>
        search(id)
          .then((response) => response.product)
          .catch(() => null),
      ),
    );

    return resolved.filter(
      (product): product is Schemas["Product"] => !!product,
    );
  },
);
</script>

<template>
  <section>
    <h2 v-if="heading">{{ heading }}</h2>
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </section>
</template>
```

This is the safest split for commerce projects:

- CMS stores product IDs, copy, layout, campaign images, and editorial order.
- Shopware resolves price, stock, translated product names, media, variants, and
  purchase actions.
- Cart, checkout, and customer account flows stay entirely in Shopware
  composables.

::: warning Match the sales channel
Product IDs must belong to the same Shopware sales channel as the access token
used by the storefront. If editors paste IDs from another environment, the Store
API can return `404` or products that are not visible in the current channel.
:::

## Caching strategy

Treat CMS content and commerce data differently.

| Data                         | Cache recommendation                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| Published CMS pages          | Cache on the server or CDN, then revalidate on publish webhooks.         |
| Draft CMS pages              | Never share-cache. Use `private, no-store`.                              |
| Product cards resolved by ID | Render during SSR, but keep freshness aligned with Shopware cache rules. |
| Cart, customer, wishlist     | Client/session data only. Do not include it in cacheable HTML.           |

When using Nuxt `routeRules`, cache public editorial routes but keep personalized
routes such as `/checkout`, `/account/**`, and cart flows out of ISR.

## Localization

Pass the active storefront locale to the CMS resolver and keep a clear fallback
policy:

```ts
const { locale } = useI18n();
const page = await resolvePage(path, locale.value);
```

For multi-language storefronts, align:

- Nuxt route prefixes
- Shopware sales channel language
- CMS locale codes
- canonical URLs and `hreflang`
- translated product IDs or product references, if the CMS stores environment
  specific references

## Content modeling checklist

Before implementing the integration, define these contracts with the content
team:

- Which system owns each route?
- Which CMS blocks are allowed on product and category pages?
- What is the stable reference for Shopware products: product ID, product number,
  or a custom field?
- Should editors select products manually, through a filtered query, or through a
  curated list?
- How are draft, published, scheduled, and archived entries represented?
- Which fields are required for SEO, Open Graph, breadcrumbs, and structured data?
- How should the frontend behave when a CMS block references a missing product?

## Security and reliability

External CMS data is still untrusted input. Render it carefully:

- sanitize rich text if the CMS returns HTML instead of structured rich text
- allowlist block types and component props
- keep private tokens in server runtime config
- validate webhook signatures before purging caches
- handle missing CMS entries with real `404` responses
- add observability around CMS fetch failures and slow responses
- keep checkout and account flows independent from CMS availability

## Where to go next

- [Sanity integration](./sanity.html): page builder, live Shopware products, cart,
  and a runnable Nuxt example.
- [Strapi integration](./strapi.html): global banner and route fallback example.
- [Storyblok integration](./storyblok.html): Nuxt module setup and visual editor
  oriented component rendering.
- [Multiple CMS](../../guides/cms/multiple-cms): render an external
  CMS as a fallback next to Shopware Shopping Experiences.
- [Shopping Experiences](../../concepts/shopping-experiences): customize the
  Shopware CMS renderer and default CMS components.
