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
- `getProductPrice` is exported from `./client` too, for app islands that
  show a product price outside a CMS element. `.` also exports
  `CmsElementProductListingResults` (a client island) and
  `getClientListingFilters`, for an app that renders a listing outside a CMS
  page.
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
  the tree of the `category-navigation` element → `ctx.navigation` (the app
  sets it only when the layout holds that element: the current category's
  children on category pages, what Vue loads with
  `useNavigation({ type: category.id })`, depth 2, and the main navigation on
  the home, landing and product pages, where Vue's `useCategory()` throws; the
  element renders nothing when it is missing or empty),
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
  returns `{ ok: false }`. `findVariant` receives the product id, `parentId`,
  the selection as a `groupId → optionId` map in configurator group order,
  the `switchedGroup` and an `AbortSignal`, so the app can call
  `/product/{parentId}/find-variant` the way the Shopware storefront does
  (`useProductConfigurator` searches `/product` instead and keys its
  selection by group name). It resolves `CmsFindVariantResult`: `variant`
  (`productId` plus an unprefixed internal `url`), `notFound`, `cancelled` or
  `ok: false`. `CmsActionResult.errors` carries Store API error codes
  (`messageKey` + `params`) that the islands translate through the `errors.*`
  message tree, as the Vue cart notifications do.
- Forms (`SwContactForm`, `SwNewsletterForm`, rendered by `CmsElementForm`)
  submit through `submitContactForm` and `subscribeNewsletter` and get
  results, never toasts: `CmsFormResult.violations` are
  `{ field?, code?, message }`, with `field` the Store API body property and
  `message` already translated by the app (reviews still get raw
  `CmsApiViolation`s that the island maps). `splitFormViolations`
  (`shared/formServerErrors.ts`) puts a violation of a field the form shows
  under that field (`aria-invalid`, `aria-describedby`) and everything else,
  deduplicated, or `message` when there are none, into the `role="alert"`
  `cms-form-error` box; typing in a field clears its server error. Client and
  server field errors focus the first `aria-invalid` control. A second submit
  while one runs is ignored (a ref; the button is `disabled`, the form
  `aria-busy`), and the button takes the focus back only when it was lost.
  Only a rejected action toasts. `CmsElementForm` passes `slotId` (the
  element id), `navigationId` (`ctx.foreignKey`) and `entityName` (from
  `ctx.routeName`), because the backend reads the element's receiver and
  confirmation text only with `slotId`. The contact form requires a
  salutation whenever the slot lists any; the newsletter salutation is
  optional and has no `*`. The confirmation is the result's
  `successMessage`, else a non-empty `confirmationText`, else the default;
  the Administration stores `""` by default, so never use `??` there. It
  takes the focus when the focus was lost with the submit button. The
  newsletter success copy follows the option and the returned `status`
  (`notSet`: confirmation mail sent). Both forms are `noValidate` and show
  `form.requiredFieldsNote`.
- `getCustomerState()` on the port tells islands about the browser session
  (`loading` | `guest` | `customer` with an id); `null` (the default) means
  the app tracks none, and the island falls back to `ctx.isLoggedIn` for the
  form only. The reviews island reads `loadProductReviews` only for a customer
  with an id, the first time its tab opens and after a submit, through
  `src/reviews/useProductReviewList.ts`; the server list is the first render.
  Without an id it never reads: one shared id would show one customer's list,
  pending review included, to the next one. When the form unmounts, the
  thank-you (after a save) or the login hint (after a logout) takes the focus,
  but only if the focus was lost.
  Never drop a read in an effect cleanup: Next keeps hidden segments in
  `<Activity>`, which runs cleanups and keeps state. The exception is a
  lookup whose late answer would navigate (`SwVariantConfiguratorOptions`
  aborts it and resets its state in its layout-effect cleanup).
- `SwVariantConfiguratorOptions` selects optimistically, asks `findVariant`
  with an abort signal and lets only the latest answer act. A found variant
  is opened with `router.replace(getVariantHref(variant, urlPrefix), { scroll: false })`
  (`variantOptionGroups.ts`: `url` only when it is a single-slash internal
  path without a backslash or control character, else `/detail/<id>`, then
  `prefixUrl`); a miss or failure rolls the selection back and shows the
  message in its persistent `<output data-testid="product-variant-status">`
  (visible for `unavailable` and `failed`, `sr-only` while loading). The
  radios stay enabled while it resolves: `aria-busy` sits on the block of
  option groups, not on the root, so the `<output>` outside it is still
  announced; the `loading` overlay blocks pointers only, arrow keys navigate
  like clicks and the sr-only `product.variantConfigurator.hint`, linked by
  `aria-describedby`, says so beforehand (WCAG 3.2.2). Focus returns to the
  chosen radio after the page re-renders when it was in the configurator and
  is now lost (`lastSwitch`, module scope, so it survives the new mount).
  Its `[productId]` layout-effect cleanup aborts the lookup and resets the
  state, because a late `replace` from a page hidden in `<Activity>` would
  pull the customer back to the product.
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
  own `limit` to the standard sizes (`limitOptions`). Outside a CMS page (the
  template's `/search`) the app renders `SwProductListingFilters`,
  `CmsElementProductListingResults` and `SwProductCard` itself, with
  `getClientListingFilters(listing.aggregations)` for the filters, and passes
  `isProductSearch` to both islands; without it a filter, sort or page change
  drops `search` and `categories` from the URL. The package never reads
  `/search` itself.

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
- The test ids this package adds beyond the Vue ones, which its own tests
  use and no e2e spec asserts yet: `product-variant-status`,
  `cms-contact-form`, `cms-contact-form-submit`, `cms-newsletter-form`,
  `cms-newsletter-form-submit`, `cms-form-error` and `cms-form-success`.
- `border-brand-primary` on the selected variant option.
- Native `<select>` elements for the page-size and sort controls.

## Tooling

- `pnpm --filter @shopware/cms-base-layer-react typecheck|lint|test`.
- Tests are Vitest with two projects: `node` for `*.test.ts(x)` and `dom`
  (happy-dom) for `src/**/*.dom.test.tsx`. Pure helpers get unit tests;
  server components render through `react-dom/server` with
  `renderToReadableStream`; client islands render in `dom` tests with the
  helpers in `src/__fixtures__/dom.ts` and a `CmsActionsProvider` of mocks.
  Islands that use `next/navigation` render in `dom` tests only with
  `vi.mock("next/navigation")` (`SwVariantConfiguratorOptions.dom.test.tsx`,
  which also wraps pages in `<Activity>` to reproduce Next's hidden segments).
- Out of scope for now: 3D media (`SwMedia3D`, `CmsBlockSpatialViewer`
  renders a placeholder) and loading more reviews.
