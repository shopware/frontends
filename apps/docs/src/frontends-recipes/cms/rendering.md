---
nav:
  position: 10
recipe:
  area: cms
  status: stable
  frameworks:
    - vue
  composables:
    - useCmsSection
    - useCmsBlock
    - useCmsMeta
    - useCmsTranslations
    - useNavigationContext
    - useCategorySearch
    - useLandingSearch
  helpers:
    - getCmsLayoutConfiguration
    - getProductListingFromCmsPage
  operations:
    - readCms post /cms/{id}
    - readCategory post /category/{navigationId}
    - readLandingPage post /landing-page/{landingPageId}
  schemas:
    - CmsPage
    - CmsSection
    - CmsBlock
    - CmsSlot
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Page",
    action: "Fetch with CMS associations",
    detail:
      "The CMS page is not fetched on its own. It arrives as the cmsPage association on a category or a landing page, which is what withCmsAssociations requests.",
    code: "search(navigationId, { withCmsAssociations: true })",
    state: "category or landing page",
    typeKeys: [
      'operations["readCategory post /category/{navigationId}"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Return the nested tree",
    detail:
      "A CmsPage carries sections, each section carries blocks, each block carries slots. Rendering is a walk over that tree, not a series of requests.",
    code: "category.cmsPage",
    state: "sw-context-token",
    typeKeys: ['Schemas["CmsPage"]'],
  },
  {
    title: "Section",
    action: "Resolve by type",
    detail:
      "Each section's type becomes a component name. Resolving it and checking whether the result is still a string is what tells you the component exists.",
    code: "resolveComponent(`CmsSection${pascalCase(section.type)}`)",
    state: "none",
    typeKeys: ['Schemas["CmsSection"]'],
  },
  {
    title: "Block",
    action: "Filter by position",
    detail:
      "useCmsSection(section).getPositionContent(position) returns the blocks for one section position. It takes a plain object, not a ref.",
    code: "getPositionContent('main')",
    state: "none",
    typeKeys: ['Schemas["CmsBlock"]'],
  },
  {
    title: "Slot",
    action: "Pick one slot",
    detail:
      "useCmsBlock(block).getSlotContent(name) matches on slot.slot. It casts the result, so a missing slot is undefined at runtime while the type says otherwise.",
    code: "getSlotContent('left')",
    state: "none",
    typeKeys: ['Schemas["CmsSlot"]'],
  },
  {
    title: "Listing",
    action: "Seed the category listing",
    detail:
      "On a category page the CMS payload already contains the first page of products. It is lifted out and used to seed the shared listing context.",
    code: "createCategoryListingContext(getProductListingFromCmsPage(content))",
    state: "useListingInitial-categoryListing",
    typeKeys: [],
  },
  {
    title: "Head",
    action: "Set the meta tags",
    detail:
      "useCmsMeta reads the meta fields off the entity, not off the CMS page. It also takes a plain entity, so its computeds do not follow a new one.",
    code: "const { title, meta } = useCmsMeta(category)",
    state: "document head",
    typeKeys: [],
  },
];
</script>

# Rendering CMS Pages

## Goal

Render a Shopping Experiences page: walk its sections, blocks and slots and map each one to a component. The important part is that the whole tree arrives in the request that fetched the category or landing page, so rendering is a resolution problem rather than a data-fetching one.

## Shopware Flow

`readCms post /cms/{id}` exists and nothing in Shopware Frontends calls it. The CMS page is fetched as an association: `useCategorySearch().search(id, { withCmsAssociations: true })` and `useLandingSearch().search(id, { withCmsAssociations: true })` both add a deep `cmsPage` association tree to the criteria, and the page comes back nested inside the entity.

What comes back is `CmsPage → sections → blocks → slots`. Every level carries a `type`, and that type is the component name. There is no registry to consult — the renderer pascal-cases the type into `CmsSection<Type>`, `CmsBlock<Type>` or `CmsElement<Type>` and asks Vue to resolve it.

<RecipeFlowDiagram label="CMS rendering flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The page fetches its entity with `withCmsAssociations: true`.
2. The response carries the full `cmsPage` tree — sections, blocks and slots.
3. Each section's `type` is resolved to a `CmsSection<Type>` component.
4. `useCmsSection(section).getPositionContent(position)` groups the blocks by section position.
5. `useCmsBlock(block).getSlotContent(name)` picks one slot for an element component.
6. On a category page the embedded product listing seeds the shared listing context.
7. `useCmsMeta(entity)` supplies the title and meta tags for the document head.

You do not need a request per section, block or element. The only later requests are the ones an element makes for itself — a cross-selling slider, a product listing page change.

## Request Flow

| Step                        | Code                                                            | Store API                            | Type                                                                                                      |
| --------------------------- | --------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Fetch a category page       | `useCategorySearch().search(id, { withCmsAssociations: true })` | `POST /category/{navigationId}`      | <SchemaTypeTooltip type-key='operations["readCategory post /category/{navigationId}"]["body"]' />         |
| Fetch a landing page        | `useLandingSearch().search(id, { withCmsAssociations: true })`  | `POST /landing-page/{landingPageId}` | <SchemaTypeTooltip type-key='operations["readLandingPage post /landing-page/{landingPageId}"]["body"]' /> |
| Read the CMS page           | `entity.cmsPage`                                                | either                               | <SchemaTypeTooltip type-key='Schemas["CmsPage"]' />                                                       |
| Read one section            | `useCmsSection(section).section`                                | none                                 | <SchemaTypeTooltip type-key='Schemas["CmsSection"]' />                                                    |
| Read blocks by position     | `getPositionContent("main")`                                    | none                                 | <SchemaTypeTooltip type-key='Schemas["CmsBlock"]' />                                                      |
| Read one slot               | `getSlotContent("left")`                                        | none                                 | <SchemaTypeTooltip type-key='Schemas["CmsSlot"]' />                                                       |
| Fetch a page by id directly | `invoke("readCms post /cms/{id}", { body: { slots } })`         | `POST /cms/{id}`                     | <SchemaTypeTooltip type-key='operations["readCms post /cms/{id}"]["body"]' />                             |

The last row is the operation nothing uses. It takes a `slots` string of `|`-separated identifiers to resolve only some slots, and a `ProductListingCriteria` for the listing an element on the page may hold.

## Composables

- `useCmsSection`: takes a `CmsSection` object and exposes `section` plus `getPositionContent(position)`, which filters the blocks by `sectionPosition`.
- `useCmsBlock`: takes a `CmsBlock` object and exposes `block` plus `getSlotContent(slotName)`, which finds the slot whose `slot` matches.
- `useCmsMeta`: takes a `Category`, `Product` or `LandingPage` and exposes `title` and `meta`, built from the entity's translated `name`, `metaTitle`, `metaDescription` and `keywords`.
- `useCmsTranslations`: `inject("cmsTranslations", {})`. Nothing in the composables package provides it — the application does, typically with the i18n messages for the active prefix.
- `useNavigationContext`: `routeName` tells the renderer whether it is on a category page, which is what decides if the embedded listing should be lifted out.

`resolveCmsComponent(content)` is exported from `@shopware/composables` alongside them. It derives the component name from `content.type` and `content.apiAlias` and attempts the resolution for you.

## Types

Use generated Store API types when you need to type the CMS tree, the criteria, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readCms post /cms/{id}"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["CmsPage"]' />
  <SchemaTypeTooltip type-key='Schemas["CmsSection"]' />
  <SchemaTypeTooltip type-key='Schemas["CmsBlock"]' />
  <SchemaTypeTooltip type-key='Schemas["CmsSlot"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type ReadCmsBody = operations["readCms post /cms/{id}"]["body"];
type CmsPage = Schemas["CmsPage"];
type CmsSection = Schemas["CmsSection"];
type CmsBlock = Schemas["CmsBlock"];
type CmsSlot = Schemas["CmsSlot"];
```

Each of the four carries a `type` and an `apiAlias`. The first is what the component name is built from; the second — `cms_section`, `cms_block` or `cms_slot` — is what decides which of the three prefixes to use.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { pascalCase } from "scule";

import type { Schemas } from "#shopware";

const { content } = defineProps<{ content: Schemas["CmsPage"] }>();

const sections = computed(() => content.sections ?? []);

// resolveComponent returns the name it was given when nothing matches
const resolveSection = (section: Schemas["CmsSection"]) => {
  const name = `CmsSection${pascalCase(section.type)}`;
  const component = resolveComponent(name);
  return typeof component === "string" ? null : component;
};

const layoutOf = (section: Schemas["CmsSection"]) =>
  getCmsLayoutConfiguration(section);
</script>

<template>
  <template v-for="section in sections" :key="section.id">
    <component
      :is="resolveSection(section)"
      v-if="resolveSection(section)"
      :content="section"
      :class="layoutOf(section).cssClasses"
      :style="{
        backgroundColor: layoutOf(section).layoutStyles?.backgroundColor,
      }"
    />
    <div v-else>No component for section type {{ section.type }}.</div>
  </template>
</template>
```

A section component then does the same one level down. `useCmsSection(content)` gives it `getPositionContent(position)` for its blocks, and each block component uses `useCmsBlock(content)` and `getSlotContent(name)` to reach its elements.

## State And Session

Almost nothing here is state. `useCmsSection`, `useCmsBlock` and `useCmsMeta` all take a plain object and return derived values over it — no refs are created, no context is provided, no requests are made. They are helpers with a composable's naming, and passing a `Ref` instead of the object breaks them.

The two places state does appear are worth knowing. `useCmsTranslations()` injects whatever the application provided under `cmsTranslations`, so a CMS component's fallback strings can be overridden per locale without prop drilling. And on a category page the renderer lifts the product listing out of the CMS payload with `getProductListingFromCmsPage` and seeds the shared listing context with `createCategoryListingContext(initialListing)` — which is why a category listing renders products before any listing request is made.

The CMS payload is context-dependent like everything else. Prices inside a product element are calculated for the current currency and tax state, and `visibility` on a section or block can hide it for a given device. A currency or language switch invalidates the whole rendered page.

## Edge Cases

- `readCms post /cms/{id}` is never called by Shopware Frontends. Debugging a missing block means looking at the `cmsPage` association tree, not at that operation.
- `useCmsSection` and `useCmsBlock` take a plain object. Passing `toRef(() => content)` gives them a `Ref` whose `.blocks` and `.slots` are undefined, and the lookups throw.
- Neither is reactive. A component that receives a new `content` prop has to recompute the lookups itself — the returned `section` and `block` are the object that was passed in.
- `getSlotContent(name)` returns the result of `Array.find` cast to a slot. A missing slot is `undefined` at runtime while the type claims a value, so guard on it.
- `getPositionContent(position)` returns an empty array for a position no block uses. That is the normal way a section with an unused side column behaves.
- `resolveCmsComponent().isResolved` compares the resolved value with `content.type`, while `resolveComponent` returns the _component name_ when it cannot resolve. The two strings differ, so `isResolved` can be `true` for a component that does not exist — the package's own test asserts exactly that. Check `resolvedComponent !== undefined` instead.
- `resolveComponent` must be called during render or setup. Calling it in a plain module function outside a component context logs a Vue warning and resolves nothing.
- `useCmsMeta(entity)` closes over the entity it was given. It reads the entity's meta fields, not the CMS page's, and does not follow a replacement.
- `useCmsTranslations()` returns `{}` when nothing was provided. A component relying on it has to keep its own defaults, which is what the CMS base layer does with `defu`.
- The embedded listing is lifted only when `routeName` is `frontend.navigation.page`. A landing page carrying a listing element does not seed the category listing context.
- `visibility` on sections and blocks is per breakpoint. Server-rendering everything and hiding with CSS is the intended behaviour, not a bug.

## Common Mistakes

- Do not fetch the CMS page separately. Request it as an association.
- Do not pass a `Ref` to `useCmsSection` or `useCmsBlock`.
- Do not treat them as reactive. Recompute on a new `content` prop.
- Do not use `getSlotContent` without a guard. The cast hides a possible `undefined`.
- Do not trust `resolveCmsComponent().isResolved`. Check `resolvedComponent`.
- Do not call `resolveComponent` outside a component's setup or render.
- Do not read meta tags off the CMS page. `useCmsMeta` takes the entity.
- Do not issue a listing request on a category page before checking whether the CMS payload already carried one.
- Do not assume a rendered CMS page survives a currency or language switch.

## Testing Checklist

- A category page issues one request carrying the CMS association tree and no separate `readCms post /cms/{id}` request.
- Every section in the payload resolves to a component, and an unknown type renders the fallback rather than nothing.
- `getPositionContent` returns only the blocks whose `sectionPosition` matches.
- `getSlotContent` returns `undefined` for a slot the block does not have, without throwing.
- A category page renders its first page of products before any listing request is sent.
- A landing page with a listing element does not seed the category listing context.
- `useCmsMeta` produces a title from the entity's translated name and meta entries only for the fields that are set.
- A component reading `useCmsTranslations()` renders its own defaults when nothing was provided.
- Switching the language re-renders the page with translated CMS content.

## Related Links

- [Content pages](../../getting-started/cms/content-pages.html)
- [Create blocks](../../getting-started/cms/create-blocks.html)
- [Create elements](../../getting-started/cms/create-elements.html)
- [Missing component](../../getting-started/cms/missing-component.html)
- [CMS base layer package](../../packages/cms-base-layer.html)
