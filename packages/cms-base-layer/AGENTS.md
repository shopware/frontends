# @shopware/cms-base-layer — agent notes

Nuxt layer implementing Shopware Shopping Experiences (CMS). **No build step** —
it ships its sources as-is and is consumed with `extends`, so edits are live in
any template that extends it.

Usage, setup and component overriding are documented in [README.md](README.md).
The complete set of `app.config.ts` options is
[app/app.config.ts](app/app.config.ts) — the README and [index.d.ts](index.d.ts)
each describe most of them but neither lists all, so read the defaults from the
config itself.

This file holds only what neither the README nor the code makes obvious.

## Component resolution

Component names mirror the CMS hierarchy (`CmsSection{Type}`, `CmsBlock{Type}`,
`CmsElement{Type}`) and are resolved at runtime by `resolveCmsComponent` from
`@shopware/composables`. The naming rules for adding one are documented in
[Creating CMS components](../../apps/docs/src/guides/cms/missing-component.md).

**An unimplemented type renders differently per environment.** When the name
does not resolve, dev mode logs a warning naming the exact component file to
create and renders the `CmsNoComponent` placeholder — but production renders an
empty `<div>` with no warning at all (`CmsGenericElement.vue`,
`CmsGenericBlock.vue`). So CMS content that silently disappears in production
while looking fine locally is a name that does not match the CMS type. Check the
dev console before hunting for a data problem.

Registration rules for the consuming template — which directories must be
`global: true`, and the trap of registering one path twice — are commented at the
`components` key of
[vue-starter-template/nuxt.config.ts](../../templates/vue-starter-template/nuxt.config.ts).

## Listing filters

`SwProductListingFilter` dispatches on the filter's `code`, not on its shape;
the mapping is the `componentMap` inside `filterComponent` in
[SwProductListingFilter.vue](app/components/SwProductListingFilter.vue). Any
filter that exposes `options` and matches no code falls back to
`SwFilterProperties` — that fallback is why new backend filters often "just
work" without a code change here.

Each call to `useSelectedListingFilters` builds its own `reactive` state, so
the sidebar and the horizontal bar do **not** share a selection object — a
mutation in one is invisible to the other until it reaches the route.
`applyQueryToFilters`
([app/utils/useSelectedListingFilters.ts](app/utils/useSelectedListingFilters.ts))
maps URL to state, and both filter components push it back with `router.push`.
(`app/utils/routeQuery.ts` is only two query-parsing helpers — nothing
filter-specific in it.)

**How the results refetch differs by listing type, and getting it wrong is
silent.** `useListing` also holds shared in-memory listing state
(`createInjectionState` for `categoryListing`, `createSharedComposable` for
`useProductSearchListing`). A search page's `useAsyncData` watches `route.query`,
so navigating is enough there and calling `search()` as well double-fetches and
flickers; a **category listing has no URL watcher**, so `search()` must be called
explicitly — see the `if (!isProductSearch)` branch and its comment in
`SwProductListingFilters.vue`.

When you add a filter, the place that turns query params back into a request body
is `buildSearchCriteria` in
[vue-starter-template/app/pages/search.vue](../../templates/vue-starter-template/app/pages/search.vue),
not `CmsElementProductListing.vue` — that one only paginates and spreads
`...route.query`, so new filters pass through it untouched.

## Images

- **Never add `decoding` or `sizes` props to `NuxtImg`** in product-card or CMS
  image components. They cause Vue hydration attribute mismatches, which trigger
  a second image request per image.
- Keep `width`/`height`/`loading` on the component. In `@nuxt/image` 2.1.0 a
  preset is an `ImageOptions`, where `width`/`height` exist only under
  `modifiers` — shaping the requested URL, never the rendered `<img>`
  attributes — and `loading` is not a field at all. Fixed dimensions on the
  component are also what avoids hydration mismatches from dynamic DOM
  measurement. (`densities` and `sizes` _are_ preset fields and do propagate,
  contrary to the older note in the README.)
- The full sizing recipe, including the retina and SSR-measurement behaviour, is
  under [Responsive CMS Images](README.md#responsive-cms-images).

## Heavy components

`SwMedia3D` (TresJS/Three.js) is deliberately excluded from auto-import so the
3D stack stays out of the initial bundle. Only `CmsElementImage` gates the
`defineAsyncComponent` call itself, inside a `computed` keyed on `isSpatial`
(`app/helpers/media/isSpatial.ts`). `CmsElementImageGallery` and
`CmsBlockSpatialViewer` both create the async component unconditionally at setup
and gate at render instead, on `isSpatial(currentImage)` and on `modelUrl`.
Either shape keeps the chunk out of the initial bundle — just don't assume the
gallery matches `CmsElementImage`. Consuming apps must add `@tresjs/nuxt` to
their modules themselves.

## Documenting components

CMS **elements** and **sections** carry a sibling `.md` file
(`CmsElementImage.vue` next to `CmsElementImage.md`): 18 of 20 elements and both
sections have one. Blocks do not — none of the 41 `CmsBlock*.vue` files has a doc
sibling. Follow the convention of the level you are adding to.
