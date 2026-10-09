# @shopware/cms-base-layer-react

React Server Components for Shopware Shopping Experiences (CMS) pages. It is
the React counterpart of `@shopware/cms-base-layer` and is consumed by
`templates/react-starter-template`. Every section, block and element exists
there as a Vue single-file component; this package ports them one to one, so
read the Vue file at `packages/cms-base-layer/app/components/**` before
writing or changing the React one.

## What the package is

- It ships TypeScript source (`src/`), no build. Next.js compiles it: Turbopack
  transpiles workspace packages on its own, and an npm install needs
  `transpilePackages: ["@shopware/cms-base-layer-react"]`.
- `.` (`src/index.ts`) is the server-safe API: `CmsPage`, the registry, the
  context, helpers and the default registry. `./client` (`src/client.ts`)
  holds everything a client component may import: the actions port, listing
  navigation, translations and formatting helpers. A client component must
  never import from `.`, because that pulls server components into the
  client bundle.
- `./styles.css` carries the rich-text rules and the `.cms-element-image`
  rules. The consuming app imports it after `@import "tailwindcss"` and adds
  `@source` for this package's `src` so Tailwind sees the class names.
- The package never calls the Store API. Everything a component renders comes
  from `content` (the CMS slot, block or section) or from `ctx`. Mutations go
  through the actions port in `src/actions/CmsActionsContext.tsx`; the app
  provides the implementation with `<CmsActionsProvider>`.

## Resolution: a registry instead of `resolveComponent`

Vue resolves `CmsBlockImageText` from the global component registry. Here the
app passes a registry object (`ctx.registry`), keyed by the raw CMS `type`:

```ts
registry.sections["sidebar"];
registry.blocks["image-text"];
registry.elements["product-listing"];
```

`src/registry.default.ts` wires every component of this package and is the
contract for file and export names: block `image-text` lives in
`src/components/block/CmsBlockImageText.tsx` and exports
`CmsBlockImageText`; element `product-listing` lives in
`src/components/element/CmsElementProductListing.tsx` and exports
`CmsElementProductListing`. The name is `getCmsComponentName(content)`, the
same `pascalCase("Cms-<Kind>-<type>")` rule as Vue. An app overrides a
component with `mergeCmsRegistries(defaultCmsRegistry, { blocks: { "image-text": MyBlock } })`.

A type without a component renders `CmsNoComponent` in development and
nothing in production, like `CmsGenericBlock.vue`.

## Component contract

Every section, block and element is a function component of
`CmsComponentProps<CONTENT>` (`src/registry.ts`):

- `content` — the typed CMS node (`src/types`, ported from
  `@shopware/composables`).
- `ctx` — `CmsContext` (`src/context.ts`). It replaces Vue's `inject`:
  `cms-block-slot-count` → `ctx.slotCount`, `cms-image-sizes` →
  `ctx.imageSizes`, `cms-section-layout` → `ctx.sectionLayout`, `urlPrefix` →
  `ctx.urlPrefix`, `cmsTranslations` → `ctx.translations`, the current
  product/category/listing → `ctx.product`, `ctx.category`, `ctx.listing`,
  the navigation tree rooted at the current category (what Vue loads with
  `useNavigation({ type: category.id })`, depth 2) → `ctx.navigation`,
  `useUser().isLoggedIn` → `ctx.isLoggedIn` (the app sets it from the
  session, default `false`), "is this the search listing" →
  `ctx.isProductSearch` (default `false`; it decides whether the `search`
  and `categories` query params are kept).
- `className` and `style` — the layout the generic renderer computed
  (`getCmsLayout`). Every component spreads both onto its root element,
  merged with its own classes through `cx()`. Vue did this with attribute
  fallthrough; React does not, so forgetting it drops CMS margins and
  visibility classes.

A block reads its slots with `getSlotContent(content, "left")` and renders
them with `<CmsGenericElement content={slot} ctx={ctx} />`. An element reads
its config with `getConfigValue(content, "displayMode")`, which returns
`undefined` for mapped values, where Vue returned `false`.

## Server first, client islands only where needed

- Sections, blocks and most elements are server components: no hooks, no
  event handlers, no `"use client"`. They may be `async`.
- Interactive parts are client islands in their own files starting with
  `"use client"`: carousels, galleries, filters, forms, add-to-cart, variant
  switching, tabs, the copy button in `CmsNoComponent`.
- Props crossing into a client island must be serializable. Never pass `ctx`
  (it carries the registry, which is functions); pass `toClientContext(ctx)`
  or the individual values. Never pass whole entities when an id and a few
  fields are enough; the RSC payload carries every prop.
- A client island reaches the app through `useCmsActions()` from `./client`
  (add to cart, wishlist, variant lookup, forms, reviews, notifications).
  Without a provider it gets `notImplementedCmsActions`, which warns and
  returns `{ ok: false }`. `findVariant` receives `parentId` next to the
  product id so the app can query `/product/{parentId}/find-variant` the way
  `useProductConfigurator` does; `CmsActionResult.errors` carries Store API
  error codes (`messageKey` + `params`) that the islands translate through
  the `errors.*` message tree, as the Vue cart notifications do.
- Listing filters, sorting and pagination keep their state in the URL with
  `useListingNavigation()` from `./client`. The query contract is the one the
  Vue layer and the e2e suite use: `manufacturer`, `properties` and
  `categories` joined with `|`, `min-price`, `max-price`, `rating`,
  `shipping-free`, `order`, `limit`, `p`. The app re-reads the listing from
  those params and passes it as `ctx.listing`; the element renders
  `ctx.listing ?? content.data.listing`. `buildListingQueryParams` sends
  `limit` and `order` only when the URL or the caller's defaults give them
  (the app passes the embedded listing's `limit` and `sorting`), so the
  backend's own listing defaults apply otherwise; `LISTING_DEFAULTS` is a UI
  fallback, never a value to send. The page-size select adds the listing's
  own `limit` to the standard sizes (`limitOptions`).

## Images, links, prices, text

- Render media with `CmsMedia` (`src/components/ui/CmsMedia.tsx`): a plain
  `<img>` with the thumbnail `srcSet` from `getSrcSetForMedia` and `sizes`
  from `ctx.imageSizes`. There is no `next/image` and no image optimizer.
- Internal links use `next/link`. Build hrefs with `getProductUrl` and
  `getCategoryUrl` from `@shopware/helpers` and prefix them with
  `prefixUrl(url, ctx.urlPrefix)`. `ctx.urlPrefix` is the locale prefix
  without slashes (`"de-DE"`, or `""` for the default locale), the value the
  Vue starter provides as `urlPrefix`. `getProductRoute` and
  `getCategoryRoute` return Vue Router objects; do not use them.
- Prices: `formatPrice(value, ctx)` (`Intl.NumberFormat` with `ctx.locale` and
  `ctx.currencyCode`). The Vue layer formats with the browser locale; this one
  formats with the URL locale so server and client agree.
- Rich text: `renderRichText(html, { urlPrefix: ctx.urlPrefix })` sanitizes
  with `xss` and rewrites links, `<font color>` and images the way
  `CmsElementText.vue` does. `CmsElementHtml` is sanitized too, which the Vue
  element is not; that is deliberate.

## Translations

Each component keeps its English defaults in a local object and merges them
with `withTranslationDefaults(ctx.translations, defaults)`, the same shape as
the Vue `defu(useCmsTranslations(), translations)` pattern. Keep the key paths
of the Vue component so one message tree serves both layers. Placeholders
use `getCmsTranslate(text, { count })`.

## Styling

- Tailwind CSS v4 utility classes with the Shopware color tokens
  (`bg-brand-primary`, `text-surface-on-surface`, …). The class names match
  the Vue layer; the tokens come from `@shopware/design-tokens`.
- Vue `<style scoped>` blocks become Tailwind classes, using arbitrary
  variants for descendant rules (`[&_.cms-element-image]:rounded-full`). Do
  not add CSS files per component; `src/assets/styles.css` is the only
  stylesheet.
- UnoCSS shorthands that Tailwind v4 lacks need the v4 spelling:
  `text-10` → `text-[10px]`, `border-1` → `border`, `border-3` →
  `border-[3px]`, `max-w-screen-2xl` stays (it is a `@utility` in
  `styles.css`).
- Icons are inline SVG components under `src/components/icons/`. Carbon icons
  (`i-carbon-*` in Vue) get their path data from `@iconify-json/carbon`.

## Contracts to keep

- The `data-testid` attributes, ARIA roles and English copy of the Vue
  components, because `apps/e2e-tests` asserts them (for example
  `product-box-product-name-link`, `add-to-cart-button`, `product-variant`,
  `listing-filter-{code}`, `listing-pagination-limit-select`, `loading`).
- `border-brand-primary` on the selected variant option.
- Native `<select>` elements for the page-size and sort controls.

## Tooling

- `pnpm --filter @shopware/cms-base-layer-react typecheck|lint|test`.
- Tests are Vitest in the `node` environment. Pure helpers get unit tests;
  server components render through `react-dom/server` with
  `renderToReadableStream` (async components are supported there). Client
  islands that use `next/navigation` are not rendered in tests.
- Out of scope for now: 3D media (`SwMedia3D`, `CmsBlockSpatialViewer`
  renders a placeholder) and loading more reviews.
