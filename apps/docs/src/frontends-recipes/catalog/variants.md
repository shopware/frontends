---
nav:
  position: 40
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - useProductConfigurator
    - useProduct
    - useProductSearch
    - useUrlResolver
  helpers:
    - getTranslatedProperty
    - getProductRoute
    - buildUrlPrefix
  operations:
    - readProduct post /product
    - readProductGet get /product
    - readProductDetail post /product/{productId}
    - searchProductVariantIds post /product/{productId}/find-variant
    - searchProductVariantIdsGet get /product/{productId}/find-variant
  schemas:
    - Product
    - PropertyGroup
    - PropertyGroupOption
    - ProductDetailResponse
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "Page",
    action: "Provide the product",
    detail:
      "useProduct(product, configurator) seeds the product and configurator context. useProductConfigurator takes no arguments and reads both from there, so the context has to exist before it runs.",
    code: "useProduct(product, configurator)",
    typeKeys: ['Schemas["ProductDetailResponse"]'],
    state: "product, configurator",
  },
  {
    title: "Composable",
    action: "Derive the selection",
    detail:
      "On setup the composable walks product.optionIds and maps each one to the group that contains it. The map is keyed by the translated group name, not by the group id, and it is built once.",
    code: "selected[getTranslatedProperty(group, 'name')] = optionId",
    state: "getSelectedOptions",
    typeKeys: ['Schemas["PropertyGroup"]'],
  },
  {
    title: "UI",
    action: "Pick an option",
    detail:
      "handleChange writes the new option into the selection and then awaits the callback you passed. It issues no request of its own, and passing no callback records the choice and nothing else.",
    code: "handleChange(groupName, optionId, onChangeHandled)",
    state: "getSelectedOptions",
    typeKeys: ['Schemas["PropertyGroupOption"]'],
  },
  {
    title: "Store API",
    action: "Find the variant",
    detail:
      "findVariantForSelectedOptions builds an equals filter on parentId plus one per selected option and searches the product list with limit 1. It does not use the find-variant operation. With cacheableReads enabled the same criteria goes to readProductGet as an encoded _criteria query parameter.",
    code: 'apiClient.invoke("readProduct post /product", { body: criteria })',
    state: "sw-context-token",
    typeKeys: ['operations["readProduct post /product"]["body"]'],
  },
  {
    title: "Composable",
    action: "Return a trimmed product",
    detail:
      "The criteria includes only id, translated, productNumber and seoUrls, and associates seoUrls so the path is there. What comes back is enough to build a link and nothing more — no price, no stock, no cover.",
    code: "response.data.elements?.[0]",
    state: "none shared",
    typeKeys: ['operations["readProduct post /product"]["response"]'],
  },
  {
    title: "UI",
    action: "Navigate or merge",
    detail:
      "The default is a route change to the variant's URL, which loads the full variant. Wrap the route in buildUrlPrefix so a localised storefront keeps its language prefix. Merging with changeVariant instead keeps the previous product's fields for everything the criteria left out.",
    code: "router.push(buildUrlPrefix(getProductRoute(variant), prefix))",
    state: "route or product context",
    typeKeys: ['Schemas["Product"]'],
  },
];
</script>

# Product Variants

## Goal

Build a variant selector on a product detail page: render the option groups, track the selection, resolve the matching variant and show it. The important part is that resolving a variant is a filtered product search returning a deliberately trimmed product, which is why the default behaviour is to navigate to it rather than merge it into the page.

## Shopware Flow

The Store API has an operation built for this — `searchProductVariantIds post /product/{productId}/find-variant` — and Shopware Frontends does not use it. `findVariantForSelectedOptions` instead searches the product list with an `equals` filter on `parentId` and one `equals` filter per selected option id, limited to one result.

That search carries an `includes` clause restricting the product to `id`, `translated`, `productNumber` and `seoUrls`, plus a `seoUrls` association and a `seo_url` include for `seoPathInfo`. The result is therefore a link target, not a product you can render. Which is exactly why the shipped configurator pushes the router to the variant's URL and lets the page reload the real product.

The request is `readProduct post /product` by default. With `shopware: { cacheableReads: true }` — which `vue-starter-template` ships with — the composable sends the identical criteria to `readProductGet get /product` in the `_criteria` query parameter instead, so the storefront can cache it. Filter, `includes` and result are the same either way; only the transport changes. See [Caching best practices](../../best-practices/caching.html).

<RecipeFlowDiagram label="Product variants flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A parent component calls `useProduct(product, configurator)` to provide both contexts.
2. `useProductConfigurator()` builds the initial selection from `product.optionIds`, keyed by translated group name.
3. Choosing an option calls `handleChange(groupName, optionId, onChangeHandled?)`, which updates the selection and awaits the callback if you passed one.
4. `findVariantForSelectedOptions()` searches the product list — from that callback, or from an explicit action in your own UI.
5. The response is one product carrying only the fields the `includes` clause allowed.
6. The UI reads the selection from `getSelectedOptions` instead of keeping its own copy, and either navigates to the resolved variant or emits it into `changeVariant()`.

You do not get a request from `handleChange` itself. The composable separates "the customer changed the selection" from "resolve what that selection means", and the second half is yours to trigger.

`cms-base-layer` ships that second half: `SwVariantConfigurator` renders the groups and resolves the variant, with an `allowRedirect` prop that is `true` by default. Set it to `false` and the component emits `change` with the resolved variant instead of navigating. `CmsElementBuyBox` renders it with `@change="changeVariant"` but leaves the default in place, so out of the box the redirect always wins; that handler only runs in a project that renders `SwVariantConfigurator` itself with `:allow-redirect="false"`. `vue-starter-template` has no selector of its own — it extends `@shopware/cms-base-layer`, so a CMS-rendered product page gets that one as-is. Read it before writing your own.

## Request Flow

| Step                     | Code                                                                       | Store API                                                 | Type                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Load the product page    | `useProductSearch().search(productId)`                                     | `POST /product/{productId}` (`GET` with `cacheableReads`) | <SchemaTypeTooltip type-key='operations["readProductDetail post /product/{productId}"]["response"]' />                |
| Read the option groups   | `getOptionGroups`                                                          | none                                                      | <SchemaTypeTooltip type-key='Schemas["PropertyGroup"]' />                                                             |
| Change one option        | `handleChange(groupName, optionId, callback)`                              | none                                                      | <SchemaTypeTooltip type-key='Schemas["PropertyGroupOption"]' />                                                       |
| Resolve the variant      | `findVariantForSelectedOptions()`                                          | `POST /product` (`GET` with `cacheableReads`)             | <SchemaTypeTooltip type-key='operations["readProduct post /product"]["body"]' />                                      |
| Read the trimmed variant | `response.data.elements?.[0]`                                              | same request                                              | <SchemaTypeTooltip type-key='operations["readProduct post /product"]["response"]' />                                  |
| Merge without navigating | `changeVariant(variant)`                                                   | none                                                      | <SchemaTypeTooltip type-key='Schemas["Product"]' />                                                                   |
| Use the dedicated route  | `invoke("searchProductVariantIds post /product/{productId}/find-variant")` | `POST /product/{productId}/find-variant`                  | <SchemaTypeTooltip type-key='operations["searchProductVariantIds post /product/{productId}/find-variant"]["body"]' /> |

The last row has no composable. It takes the selected options — as an array of option ids, or as a map keyed by **group id**, not by group name — and returns the found combination with the variant id, so a custom selector that only needs an id can avoid the product search entirely.

Its response type is the one place on this page where the generated contract does not match the route. `FindProductVariantRouteResponse` nests the payload under an optional `foundCombination` object, while the route answers with the `FoundCombination` struct flat — `variantId`, `options` and `apiAlias` at the root — on the POST operation and on `searchProductVariantIdsGet` alike. Read `variantId` from the response root and type it locally; typed access through the generated response points one level too deep and reads `undefined`.

## Composables

Pick by scope — how much of the product page the composable is about:

| Composable               | Scope                        | Reach for it when                                             |
| ------------------------ | ---------------------------- | ------------------------------------------------------------- |
| `useProductSearch`       | one product, by id           | loading the detail page that the selector lives on            |
| `useProduct`             | the shared product context   | reading the current product or merging a resolved variant     |
| `useProductConfigurator` | the option groups and choice | rendering the selector and resolving the selected combination |

`useProductConfigurator` is the one this recipe is about:

- **Read** — `getOptionGroups` (the configurator from the product context), `getSelectedOptions` (a group name to option id map), `isLoadingOptions`.
- **Act** — `handleChange(group, option, onChangeHandled?)` records a choice, `findVariantForSelectedOptions(options?)` resolves it.

Six things the generated reference will not tell you:

- `getSelectedOptions` is keyed by the **translated group name**, and `handleChange` expects that same key. A group id in that position silently creates a second entry for the group, and the search then filters on two options of one group and matches nothing.
- `handleChange` sends no request. It writes the selection and awaits `onChangeHandled`, so without that callback the selection changes and nothing else happens.
- `findVariantForSelectedOptions(options?)` reads `Object.values()` of the map you pass, so only the option ids matter — the keys of an override map are ignored.
- `isLoadingOptions` is initialised from `product.options?.length` and is never written again by the composable. Own the loading flag in your component.
- `useProduct(product, configurator)` copies the values it is given (`ref(unref(context))`), so the context is a snapshot taken during setup, not a live link to the ref you passed. `changeVariant(variant)` is the supported way to update it.
- `useProduct()` with no arguments injects, and injection only works while a component is setting up. Calling it from an event handler throws `injectLocal must be called in setup`. Destructure what you need — `changeVariant`, `product` — from the `useProduct(...)` call in `setup` instead.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type the configurator, the variant search, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readProductDetail post /product/{productId}"]["response"]' />
  <SchemaTypeTooltip type-key='operations["readProduct post /product"]["body"]' />
  <SchemaTypeTooltip type-key='operations["searchProductVariantIds post /product/{productId}/find-variant"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["ProductDetailResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["PropertyGroup"]' />
  <SchemaTypeTooltip type-key='Schemas["PropertyGroupOption"]' />
  <SchemaTypeTooltip type-key='Schemas["Product"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type ProductDetailResponse = Schemas["ProductDetailResponse"];
type PropertyGroup = Schemas["PropertyGroup"];
type PropertyGroupOption = Schemas["PropertyGroupOption"];
type FindVariantBody =
  operations["searchProductVariantIds post /product/{productId}/find-variant"]["body"];
type Product = Schemas["Product"];

// what the find-variant route actually answers with
type FoundCombination = {
  variantId?: string;
  options?: string[];
};
```

`ProductDetailResponse` is where the configurator comes from: it is `{ product, configurator }`, and `configurator` is the `PropertyGroup[]` that `getOptionGroups` returns.

`FoundCombination` is written by hand for the mismatch above: the generated response type puts those two fields inside a `foundCombination` object that the route does not send.

## Minimal Vue Example

<CodeExample title="Minimal variant selector">

```vue
<script setup lang="ts">
import {
  buildUrlPrefix,
  getProductRoute,
  getTranslatedProperty,
} from "@shopware/helpers";

import type { Schemas } from "#shopware";

const { product, configurator } = defineProps<{
  product: Schemas["Product"];
  configurator: Schemas["PropertyGroup"][];
}>();

useProduct(product, configurator);

const {
  getOptionGroups,
  getSelectedOptions,
  handleChange,
  findVariantForSelectedOptions,
} = useProductConfigurator();

const router = useRouter();
const { getUrlPrefix } = useUrlResolver();

const isResolving = ref(false);
const resolveMessage = ref("");

const isOptionSelected = (optionId: string) =>
  Object.values(getSelectedOptions.value).includes(optionId);

const selectOption = (group: Schemas["PropertyGroup"], optionId: string) =>
  handleChange(getTranslatedProperty(group, "name"), optionId);

const resolveVariant = async () => {
  if (isResolving.value) return;

  resolveMessage.value = "";
  isResolving.value = true;

  try {
    const variant = await findVariantForSelectedOptions();

    if (!variant) {
      resolveMessage.value = "We could not load that combination. Try again.";
      return;
    }

    const failure = await router.push(
      buildUrlPrefix(getProductRoute(variant), getUrlPrefix()),
    );

    if (failure) resolveMessage.value = "We could not open that variant.";
  } catch {
    resolveMessage.value = "We could not open that variant.";
  } finally {
    isResolving.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="resolveVariant">
    <p v-if="resolveMessage" role="alert">{{ resolveMessage }}</p>

    <fieldset
      v-for="group in getOptionGroups"
      :key="group.id"
      :aria-busy="isResolving"
    >
      <legend>{{ getTranslatedProperty(group, "name") }}</legend>

      <label v-for="option in group.options ?? []" :key="option.id">
        <input
          type="radio"
          :name="group.id"
          :value="option.id"
          :checked="isOptionSelected(option.id)"
          @change="selectOption(group, option.id)"
        />
        {{ getTranslatedProperty(option, "name") }}
      </label>
    </fieldset>

    <button type="submit" :aria-disabled="isResolving">
      Show this variant
    </button>

    <p v-if="isResolving" role="status">Resolving the selected variant…</p>
  </form>
</template>
```

</CodeExample>

The sample resolves from a submit button rather than from `handleChange`'s callback, and that is the one deliberate departure from `SwVariantConfigurator`. A callback that navigates turns a radio group into a trap: arrow keys move **and** check, so every option a keyboard customer passes over fires `change` and routes them away before they reach the one they wanted. Pass the callback when the outcome stays on the page; resolve from an explicit action when it is a route change.

To keep the customer on the page instead, destructure `changeVariant` from the `useProduct(product, configurator)` call in `setup` and use it in place of the `router.push` — not `useProduct().changeVariant(variant)`, which injects and throws outside `setup`. The cost is described below: the merged product only carries the fields the variant search asked for.

## State And Session

The product and the configurator live in the `product` and `configurator` injections that `useProduct` provides. `useProductConfigurator` takes no arguments and reads both from there, so it works in the component that called `useProduct(product, configurator)` and in anything below it — otherwise `useProduct()` throws a `ContextError`.

The selection itself is local to the `useProductConfigurator()` instance, not shared. Two selectors on one page each keep their own map, but both read the same product context.

`changeVariant(variant)` writes into the shared product context with `Object.assign({}, current, variant)`. Because it merges rather than replaces, every field absent from the partial keeps the previous variant's value — which is the whole reason the shipped configurator prefers a route change.

## Edge Cases

- The initial map is built once during setup and never rebuilt. An `optionId` whose option is in no configurator group is skipped, because the group lookup returns an empty name.
- `getSelectedOptions` is keyed by the translated group name, with a fallback to the untranslated `name`. If the component survives a language switch, `handleChange` writes the new translation as an additional key and the stale one stays — two options of the same group in the filter, and no match. Remount the selector with the product instead.
- `findVariantForSelectedOptions` catches its own errors, logs them, and returns `undefined`. A failed request and an unavailable combination are indistinguishable from the outside.
- It accepts no abort signal, and no timeout is armed unless you set `runtimeConfig.apiClientConfig.timeout` in milliseconds. Without one, a request that hangs never settles and nothing clears your pending flag.
- `router.push` resolves with a `NavigationFailure` instead of throwing when a guard aborts the navigation or the target is the current route. Check the resolved value; only a guard that throws reaches a `catch`.
- The variant search restricts the product to `id`, `translated`, `productNumber` and `seoUrls`. Passing that into `changeVariant` leaves price, stock, cover and every other field at the previous variant's values.
- The search filters on `parentId`, so it works only for a variant of a configurable product. A standalone product carries `parentId: null`, which serialises as `"value": null` and matches nothing: the Store API answers `200` with an empty result and the composable returns `undefined` without logging. Only a product whose response omits `parentId` entirely drops the key from the filter, and that is what earns a `400 FRAMEWORK__INVALID_FILTER_QUERY`.
- The selection is committed before your callback runs and is never rolled back. After a combination that resolves to nothing, `getSelectedOptions` still holds the option that failed, so every later pick in another group carries it into the filter and also matches nothing. Restore the previous value yourself if the customer needs a way back.
- `useProductConfigurator()` reads `product.value.options` during setup without a guard. An empty product context throws from `useProduct` first, so provide it before mounting the selector.
- `getOptionGroups` is empty for a product without a configurator, which is the correct signal not to render a selector at all.
- A combination the catalog does not stock returns no element. Handle `undefined` as "unavailable", not as an error.

## Common Mistakes

- Do not key the selection by group id. `handleChange` expects the translated group name.
- Do not expect `handleChange` to resolve the variant. Trigger the search yourself — from its `onChangeHandled` callback, or from an action of your own.
- Do not render the resolved variant directly. It has almost no fields.
- Do not use `changeVariant` with the search result unless you also refetch the full product.
- Do not rely on `isLoadingOptions` for the spinner.
- Do not call `useProductConfigurator()` without `useProduct(product, configurator)` in the same component or above it.
- Do not call `useProduct()` from an event handler. It injects, which only works during `setup`.
- Do not resolve the variant from the radio's `change` event when the outcome is a route change. Arrow keys check every option they pass over.
- Do not disable the option groups while resolving. A disabled control cannot hold focus, so a keyboard customer is thrown back to the top of the document mid-selection — use `aria-busy` and guard the handler.
- Do not push `getProductRoute(variant)` unprefixed. Wrap it in `buildUrlPrefix` with `useUrlResolver().getUrlPrefix()`, or a localised storefront silently drops its language prefix.
- Do not treat `undefined` from `findVariantForSelectedOptions` as a bug — it also means the request failed silently.
- Do not assert the POST route in tests or proxies without checking `cacheableReads`. With the flag on, the same search goes out as `GET /product`.
- Do not build the variant URL by hand. `getProductRoute` uses the `seoUrls` the search asked for.

## Testing Checklist

- A product without a configurator renders no option groups.
- The initial selection matches `product.optionIds`, one option per group, and drops ids that belong to no group.
- Choosing an option updates `getSelectedOptions` and issues no request.
- Submitting issues exactly one variant search — `POST /product`, or `GET /product` when `cacheableReads` is enabled.
- That request filters on `parentId` and on one `optionIds` value per selected option.
- A resolvable combination navigates to the variant's SEO URL, keeping the active language prefix.
- An unavailable combination renders a message, stays on the page, and can be submitted again.
- A failing request is reported the same way, because the composable swallows it.
- Arrowing through a group changes the selection without navigating.
- The option groups are `aria-busy` while a variant is being resolved and stay focusable.

## Related Links

- [Product Listing and Filters recipe](listing.html)
- [Search and Suggest recipe](search.html)
- [Product Reviews recipe](reviews.html)
- [Product detail page](../../guides/e-commerce/product-detail-page.html)
- [Product listing documentation](../../guides/e-commerce/product-listing.html)
- [Caching best practices](../../best-practices/caching.html)
- [Helpers package](../../packages/helpers.html)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
