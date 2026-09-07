# @shopware/cms-base-layer — agent notes

Nuxt layer implementing Shopware Shopping Experiences (CMS). **No build step** —
it ships its sources as-is and is consumed with `extends`, so edits are live in
any template that extends it.

Usage, setup, image optimization, app-config options and component overriding
are documented in [README.md](README.md) — that is the single source for them,
do not restate it here. The `app.config.ts` options are typed with JSDoc in
[index.d.ts](index.d.ts); read those two files rather than a copy of their
contents.

This file holds only what neither the README nor the code makes obvious.

## Component resolution

CMS content is hierarchical — page → section → block → element — and component
names follow it exactly: `CmsSection{Type}`, `CmsBlock{Type}`, `CmsElement{Type}`,
matching the type strings Shopware sends. `CmsGenericBlock`/`CmsGenericElement`
resolve the name at runtime through `resolveCmsComponent` from
`@shopware/composables`.

**An unimplemented element renders differently per environment.** When the name
does not resolve, dev mode logs a warning naming the exact component file to
create and renders the `CmsNoComponent` placeholder — but production renders an
empty `<div>` with no warning at all. So CMS content that silently disappears in
production, while looking fine locally, is a name that does not match the CMS
type. Check the dev console before hunting for a data problem.

CMS components must stay globally registered for `resolveComponent` to find
them, and overrides must live at the matching path in the consuming project.
The registration rules and the `global: true` double-registration trap are in
the root [AGENTS.md](../../AGENTS.md#nuxt-component-registration-templates).

## Listing filters

`SwProductListingFilter` dispatches on the filter's `code`, not on its shape:

| `code`          | Component              |
| --------------- | ---------------------- |
| `categories`    | `SwFilterCategories`   |
| `price`         | `SwFilterPrice`        |
| `rating`        | `SwFilterRating`       |
| `shipping-free` | `SwFilterShippingFree` |
| `manufacturer`  | `SwFilterProperties`   |

Any other filter exposing `options` falls back to `SwFilterProperties` — that
fallback is why new backend filters often "just work". Selection state is shared
through `app/utils/useSelectedListingFilters.ts`, and `app/utils/routeQuery.ts`
maps it to and from the URL query. Change one without the other and the UI and
the URL drift apart.

## Heavy components

`SwMedia3D` (TresJS/Three.js) is deliberately excluded from auto-import so the
3D stack stays out of the initial bundle. It is loaded with
`defineAsyncComponent` for `.glb` media by `CmsElementImage`,
`CmsElementImageGallery` and `CmsBlockSpatialViewer`. Consuming apps must add
`@tresjs/nuxt` to their modules themselves.

Image pitfalls that will silently double your requests (NuxtImg `decoding`/
`sizes`, preset props that don't propagate) are in the root
[AGENTS.md](../../AGENTS.md#images-cms-base-layer).
