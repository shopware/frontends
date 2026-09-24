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

Component names mirror the CMS hierarchy: `CmsSection{Type}`, `CmsBlock{Type}`,
`CmsElement{Type}`. Blocks and elements are resolved at runtime by
`resolveCmsComponent` from `@shopware/composables`; **sections are not** — they
are resolved inline in `CmsPage.vue` with a bare `resolveComponent()` call. The
naming rules for adding one are documented in
[Creating CMS components](../../apps/docs/src/guides/cms/missing-component.md).

**An unimplemented block or element renders differently per environment.**
When the name does not resolve, dev mode logs a warning naming the exact
component file to create and renders the `CmsNoComponent` placeholder — but
production renders an empty `<div>` with no warning at all
(`CmsGenericElement.vue`, `CmsGenericBlock.vue`). So a block or element that
silently disappears in production while looking fine locally is a name that does
not match the CMS type; check the dev console before hunting for a data problem.

**Sections behave the opposite way.** `CmsPage.vue` has no dev gate: an
unresolved section renders the literal string `There is no CmsSection{Type}`
into the page, visibly, in production as well as locally. Nothing is logged, so
there is no console warning to look for.

Registration rules for the consuming template — which directories must be
`global: true`, and the trap of registering one path twice — are commented at the
`components` key of
[vue-starter-template/nuxt.config.ts](../../templates/vue-starter-template/nuxt.config.ts).

## Images

- **Never add `decoding` or `sizes` props to `NuxtImg`** in product-card or CMS
  image components. They cause Vue hydration attribute mismatches, which trigger
  a second image request per image.
- Keep `width`/`height`/`loading` on the component. In `@nuxt/image` 2.1.0 a
  preset is an `ImageOptions`, where `width`/`height` exist only under
  `modifiers` — shaping the requested URL, never the rendered `<img>`
  attributes — and `loading` is not a field at all. Fixed dimensions on the
  component are also what avoids hydration mismatches from dynamic DOM
  measurement. (`densities` does work as a preset field. `sizes` does too, but
  it lands on the same rendered attribute as the prop, so putting it in a preset
  reproduces the mismatch the bullet above forbids — don't.)
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

CMS elements and sections are documented in a sibling `.md` file — `element/`
holds `CmsElementImage.vue` next to `CmsElementImage.md`, and `section/` does
the same. Blocks are not documented this way. Match the level you are adding
to, and check the directory rather than assuming.
