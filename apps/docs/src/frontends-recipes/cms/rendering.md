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
    - useCmsElementConfig
    - useCmsElementImage
    - useCmsMeta
    - useCmsTranslations
    - useNavigationContext
    - useCategorySearch
    - useLandingSearch
    - useCategory
    - useListing
  helpers:
    - getCmsLayoutConfiguration
    - getProductListingFromCmsPage
    - getTranslatedProperty
  operations:
    - readCms post /cms/{id}
    - readCategory post /category/{navigationId}
    - readCategoryGet get /category/{navigationId}
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
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "Composable",
    action: "Fetch the entity",
    detail:
      "The CMS page is not fetched on its own. The category and landing page routes resolve the layout server-side and return it as the entity's cmsPage property, so withCmsAssociations is not what produces it.",
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
    code: 'apiClient.invoke("readCategory post /category/{navigationId}")',
    state: "sw-context-token",
    typeKeys: ['Schemas["CmsPage"]'],
  },
  {
    title: "UI",
    action: "Resolve the section",
    detail:
      "Each section's type becomes a component name. Resolving it and checking whether the result is still a string is what tells you the component exists. The component has to be registered global: true for resolveComponent to reach it.",
    code: "resolveComponent(`CmsSection${pascalCase(section.type)}`)",
    state: "none",
    typeKeys: ['Schemas["CmsSection"]'],
  },
  {
    title: "Composable",
    action: "Filter the section's blocks",
    detail:
      "useCmsSection(section).getPositionContent(position) returns the blocks for one section position. It takes a plain object, not a ref.",
    code: "getPositionContent('main')",
    state: "none",
    typeKeys: ['Schemas["CmsBlock"]'],
  },
  {
    title: "Composable",
    action: "Pick a block's slot",
    detail:
      "useCmsBlock(block).getSlotContent(name) matches on slot.slot. It casts the result, so a missing slot is undefined at runtime while the type says otherwise.",
    code: "getSlotContent('left')",
    state: "none",
    typeKeys: ['Schemas["CmsSlot"]'],
  },
  {
    title: "Shared state",
    action: "Seed the category listing",
    detail:
      "On a category page the CMS payload already contains the first page of products. CmsPage lifts it out and uses it to seed the shared listing context.",
    code: "createCategoryListingContext(getProductListingFromCmsPage(content))",
    state: "categoryListing",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Set the meta tags",
    detail:
      "useCmsMeta reads the meta fields off the entity, not off the CMS page. It takes the entity itself rather than a ref — the templates unwrap theirs inside useCmsHead — so it does not follow a replacement.",
    code: "const { title, meta } = useCmsMeta(unref(category))",
    state: "document head",
    typeKeys: [],
  },
];
</script>

# Rendering CMS Pages

## Goal

Render a Shopping Experiences page: walk its sections, blocks and slots and map each one to a component. The important part is that the whole tree arrives in the request that fetched the category or landing page, so rendering is a resolution problem rather than a data-fetching one.

## Shopware Flow

`readCms post /cms/{id}` exists and nothing in Shopware Frontends calls it. The CMS page comes back nested inside the entity instead: `POST /category/{navigationId}` and `POST /landing-page/{landingPageId}` both resolve the assigned layout server-side and return it as `cmsPage`, whether or not the criteria asked for it. `useLandingSearch().search(id, { withCmsAssociations: true })` widens the criteria around that with the media association and a deeper `cmsPage` association tree. `useCategorySearch().search()` takes the same flag but nests the association object one level too deep, so it requests neither — and the category layout still arrives. The flag is not what produces the tree, and a page that renders without it is no evidence that it was applied.

What comes back is `CmsPage → sections → blocks → slots`. Every level carries a `type`, and that type is the component name. There is no registry to consult — the renderer pascal-cases the type into `CmsSection<Type>`, `CmsBlock<Type>` or `CmsElement<Type>` and asks Vue to resolve it.

<RecipeFlowDiagram label="CMS rendering flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The page fetches its entity; the route returns the resolved `cmsPage` along with it.
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

`POST` is the request-layer default, but not what the supported template does: `vue-starter-template` sets `cacheableReads: true` under `runtimeConfig.public.shopware`, and with that flag `useCategorySearch` calls `readCategoryGet get /category/{navigationId}` instead, compressing the same criteria into a `_criteria` query param so the read is HTTP-cacheable. `useLandingSearch` has not been moved to the cacheable variant and always posts. Either way the same `cmsPage` tree comes back.

The last row is the operation nothing uses. It takes a `slots` string of `|`-separated identifiers to resolve only some slots, and a `ProductListingCriteria` for the listing an element on the page may hold.

## Composables

Pick by scope — how much of the CMS page the composable is about:

| Composable             | Scope                | Reach for it when                                               |
| ---------------------- | -------------------- | --------------------------------------------------------------- |
| `useCategorySearch`    | a category page      | fetching the entity whose `cmsPage` you are about to render     |
| `useLandingSearch`     | a landing page       | the same, for a landing page                                    |
| `useCategory`          | the current category | reading the category a page already fetched, as a `ComputedRef` |
| `useNavigationContext` | the current route    | deciding whether the page behaves as a category page            |
| `useCmsMeta`           | the entity           | filling the document title and meta tags                        |
| `useCmsTranslations`   | every CMS component  | overriding a component's fallback strings per locale            |
| `useCmsSection`        | one section          | splitting a section's blocks by position                        |
| `useCmsBlock`          | one block            | picking the slot an element component renders from              |
| `useCmsElementConfig`  | one element          | reading what the admin configured on that element               |
| `useCmsElementImage`   | one media element    | rendering an image without re-deriving its attributes           |

The tree walk is what you use on every page:

- **Sections** — `useCmsSection(section)` returns `section` and `getPositionContent(position)`, which filters the section's blocks by `sectionPosition` (`main`, `sidebar`).
- **Blocks** — `useCmsBlock(block)` returns `block` and `getSlotContent(slotName)`, which matches a slot on its own `slot` name. That name is whatever the block declares; `left`, `right`, `content` and `center` are the common ones.
- **Elements** — `useCmsElementConfig(element)` returns `getConfigValue(key)` for the admin configuration, and `useCmsElementImage(element)` derives `imageAttrs`, `anchorAttrs`, `imageContainerAttrs`, `imageLink`, `containerStyle`, `displayMode`, `ariaLabel`, `isDecorative`, `isVideoElement` and `mimeType` for an image or manufacturer-logo element.

Five things the generated reference will not tell you:

- None of the four follows a replacement. `useCmsSection`, `useCmsBlock` and `useCmsElementConfig` read the object and return plain values; `useCmsMeta` returns computeds over it, which do track that object's fields while it is reactive but never point at a new one. A `Ref` breaks all four in two different ways: `useCmsSection` and `useCmsBlock` throw, while `useCmsElementConfig` returns `undefined` and `useCmsMeta` returns empty strings.
- `getSlotContent(name)` is `Array.find` with a cast. A slot the block does not have is `undefined` at runtime while the type promises a value.
- `getConfigValue(key)` returns `false`, not the value, when the entry's `source` is `"mapped"` — the case where the value comes from the surrounding entity rather than from the layout.
- `useCmsMeta(entity)` returns a `title` and a `meta` computed, and it takes the entity, not a ref to it. Neither template calls it directly; both wrap it in their own `useCmsHead(entity)`, which unwraps the ref, passes the title, description and Open Graph tags to `useSeoMeta`, and the remaining meta entries and the canonical link to `useHead`.
- `useCmsElementConfig` and `useCmsElementImage` live in `packages/composables/src/cms/` rather than in a `use*` directory of their own, so the generated reference — built one page per `use*` directory — has no page for them.

`resolveCmsComponent(content)` is exported from `@shopware/composables` alongside them. It derives the component name from `content.type` and `content.apiAlias` and attempts the resolution for you.

Two names in this flow come from outside the CMS set. `useNavigationContext().routeName` is what the base layer's `CmsPage` component checks before it lifts the embedded listing. `createCategoryListingContext(initialListing)` and `useCategoryListing()` both come from `useListing`: `CmsPage` creates that context — and only when `getProductListingFromCmsPage` actually finds a listing — the product listing element consumes it, and the element throws when nothing created it. Neither template holds these calls; they live in `packages/cms-base-layer`.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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

Each of the four carries a `type` and an `apiAlias`. The first is what the component name is built from; the second picks the prefix below the page level: `resolveCmsComponent` maps `cms_section` to `CmsSection`, `cms_block` to `CmsBlock`, and treats everything else — `cms_slot` included, and any alias it does not know — as `CmsElement`. The `CmsPage` itself is never resolved to a component; the renderer walks straight into its sections.

## Minimal Vue Example

<CodeExample title="Minimal CMS page renderer">

```vue
<script setup lang="ts">
import { getCmsLayoutConfiguration } from "@shopware/helpers";
import { pascalCase } from "scule";

import type { Schemas } from "#shopware";

const { content } = defineProps<{ content: Schemas["CmsPage"] }>();

const resolveSection = (section: Schemas["CmsSection"]) => {
  const component = resolveComponent(`CmsSection${pascalCase(section.type)}`);
  return typeof component === "string" ? null : component;
};

const sections = computed(() =>
  (content.sections ?? []).map((section) => ({
    section,
    resolved: resolveSection(section),
    layout: getCmsLayoutConfiguration(section),
  })),
);
</script>

<template>
  <template v-for="{ section, resolved, layout } in sections" :key="section.id">
    <component
      :is="resolved"
      v-if="resolved"
      :content="section"
      :class="layout.cssClasses"
      :style="{ backgroundColor: layout.layoutStyles?.backgroundColor }"
    />
    <p v-else>No component for section type {{ section.type }}.</p>
  </template>
</template>
```

</CodeExample>

The component name is built at runtime, so Nuxt cannot rewrite `resolveComponent` into a static import and the lookup falls back to the globally registered components. The section components therefore have to sit under a path registered `global: true` — `app/components/cms/` in `vue-starter-template` — or every section renders the fallback.

A section component then does the same one level down. `useCmsSection(content)` gives it `getPositionContent(position)` for its blocks, and each block component uses `useCmsBlock(content)` and `getSlotContent(name)` to reach its elements. The element at the end of that walk is where rendering stops being generic: it reads what the admin configured with `const { getConfigValue } = useCmsElementConfig(content)` and renders its own markup from those values.

## State And Session

Almost nothing here is state. `useCmsSection`, `useCmsBlock` and `useCmsMeta` all take a plain object and return derived values over it. `useCmsMeta` wraps its output in computeds, but nothing is stored, no context is provided and no request is made. They are helpers with a composable's naming, and passing a `Ref` instead of the object breaks them — loudly in `useCmsSection` and `useCmsBlock`, silently in `useCmsMeta`.

The two places state does appear are worth knowing. `useCmsTranslations()` injects whatever the application provided under `cmsTranslations`, so a CMS component's fallback strings can be overridden per locale without prop drilling. And on a category page the base layer's `CmsPage` lifts the product listing out of the CMS payload with `getProductListingFromCmsPage` and seeds the shared listing context with `createCategoryListingContext(initialListing)` — which is why a category listing renders products before any listing request is made.

The CMS payload is context-dependent like everything else. Prices inside a product element are calculated for the current currency and tax state, and `visibility` on a section or block can hide it for a given device. A currency or language switch invalidates the whole rendered page.

## Edge Cases

- `readCms post /cms/{id}` is never called by Shopware Frontends. Debugging a missing block means looking at the `cmsPage` the category or landing page response already carried, not at that operation.
- `withCmsAssociations` is not what makes `cmsPage` appear. Both routes resolve the layout on their own, so removing the flag does not reproduce a missing-layout bug, and adding it does not fix one.
- `useCmsSection` and `useCmsBlock` take a plain object. Passing `toRef(() => content)` gives them a `Ref` whose `.blocks` and `.slots` are undefined, and the lookups throw — during SSR that surfaces as a 500 on first paint, not as a browser console error.
- Neither is reactive, and re-running the lookup is not enough. `getPositionContent` and `getSlotContent` close over the object handed to the composable, so on a new `content` prop they still read the old one. Call the composable again inside the `computed`, or key the child on `content.id` so it remounts.
- `getSlotContent(name)` returns the result of `Array.find` cast to a slot. A missing slot is `undefined` at runtime while the type claims a value, so guard on it.
- `getPositionContent(position)` returns an empty array for a position no block uses. That is the normal way a section with an unused side column behaves.
- `resolveCmsComponent().isResolved` compares the resolved value with `content.type`, while `resolveComponent` returns the _component name_ when it cannot resolve. The two strings differ, so `isResolved` can be `true` for a component that does not exist — the package's own test asserts exactly that. Check `resolvedComponent !== undefined` instead.
- `resolveComponent` must be called during render or setup. Calling it in a plain module function outside a component context logs a Vue warning and resolves nothing.
- A component whose name is built at runtime only resolves if it is registered `global: true`. Dropping a `CmsSection*` or `CmsElement*` override into plain `app/components/` leaves it out of `resolveComponent`'s reach, and the fallback renders with no error — in the starter the registered path is `app/components/cms/`.
- `useCmsMeta(entity)` closes over the entity it was given. It reads the entity's meta fields, not the CMS page's, and does not follow a replacement.
- `useCmsMeta` takes the entity, not a ref. `useCategory()` and `useAsyncData` both hand you a `Ref`, and `getTranslatedProperty` falls back to `""` for anything it cannot read — so a ref produces an empty title and no meta entries, without an error.
- `getConfigValue(key)` returns `false` for a config entry whose `source` is `"mapped"`. Mapped values come from the surrounding entity (a product page element bound to the product), so an element that only reads `getConfigValue` renders nothing there.
- `useCmsTranslations()` returns `{}` when nothing was provided. A component relying on it has to keep its own defaults, which is what the CMS base layer does with `defu`.
- The embedded listing is lifted only when `routeName` is `frontend.navigation.page`. A product listing element on a landing page therefore finds no context and `useCategoryListing()` throws instead of rendering empty. The admin only offers the listing block on a listing layout, so this surfaces with hand-built layouts rather than in normal editing.
- `visibility` on sections and blocks is per breakpoint. Server-rendering everything and hiding with CSS is the intended behaviour, not a bug.

## Common Mistakes

- Do not fetch the CMS page separately. The route already returned it on the entity.
- Do not pass a `Ref` to `useCmsSection` or `useCmsBlock`.
- Do not treat them as reactive. On a new `content` prop re-invoke the composable, not just the lookup.
- Do not use `getSlotContent` without a guard. The cast hides a possible `undefined`.
- Do not trust `resolveCmsComponent().isResolved`. Check `resolvedComponent`.
- Do not call `resolveComponent` outside a component's setup or render.
- Do not put a CMS component override outside a path registered `global: true`.
- Do not read meta tags off the CMS page. `useCmsMeta` takes the entity, unwrapped.
- Do not issue a listing request on a category page before checking whether the CMS payload already carried one.
- Do not assume a rendered CMS page survives a currency or language switch.

## Testing Checklist

- A category page gets its layout from the category request itself — a `GET /category/{navigationId}?_criteria=…` with the starter template's `cacheableReads: true`, a `POST` without it — and never a separate `readCms post /cms/{id}` request.
- Every section in the payload resolves to a component, and an unknown type renders the fallback rather than nothing.
- `getPositionContent` returns only the blocks whose `sectionPosition` matches.
- `getSlotContent` returns `undefined` for a slot the block does not have, without throwing.
- A category page renders its first page of products before any listing request is sent.
- A product listing element on a landing page fails loudly through `useCategoryListing` instead of rendering an empty listing.
- `useCmsMeta` produces a title from the entity's translated name and meta entries only for the fields that are set.
- A component reading `useCmsTranslations()` renders its own defaults when nothing was provided.
- An element reads its admin configuration through `getConfigValue`, and a key the layout does not set comes back `undefined`.
- Switching the language re-renders the page with translated CMS content.

## Related Links

- [Create content pages](../../guides/cms/content-pages.html)
- [Create Blocks (CMS)](../../guides/cms/create-blocks.html)
- [Create Elements (CMS)](../../guides/cms/create-elements.html)
- [Implement a Missing CMS Component](../../guides/cms/missing-component.html)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
