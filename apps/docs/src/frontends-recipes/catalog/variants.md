---
nav:
  position: 30
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - useProductConfigurator
    - useProduct
  helpers:
    - getTranslatedProperty
    - getProductRoute
  operations:
    - readProduct post /product
    - readProductDetail post /product/{productId}
    - searchProductVariantIds post /product/{productId}/find-variant
  schemas:
    - Product
    - PropertyGroup
    - PropertyGroupOption
    - ProductDetailResponse
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Page",
    action: "Provide the product",
    detail:
      "useProduct(product, configurator) seeds the product and configurator context. useProductConfigurator has no arguments and throws a ContextError if that parent call is missing.",
    code: "useProduct(product, configurator)",
    state: "product, configurator",
    typeKeys: ['Schemas["ProductDetailResponse"]'],
  },
  {
    title: "Composable",
    action: "Derive the selection",
    detail:
      "On setup the composable walks product.optionIds and maps each one to its group. The map is keyed by the translated group name, not by the group id.",
    code: "selected[getTranslatedProperty(group, 'name')] = optionId",
    state: "getSelectedOptions",
    typeKeys: ['Schemas["PropertyGroup"]'],
  },
  {
    title: "UI",
    action: "Pick an option",
    detail:
      "handleChange writes the new option into the selection and then awaits the callback you passed. It issues no request of its own.",
    code: "handleChange(groupName, optionId, onChangeHandled)",
    state: "getSelectedOptions",
    typeKeys: ['Schemas["PropertyGroupOption"]'],
  },
  {
    title: "Store API",
    action: "Find the variant",
    detail:
      "findVariantForSelectedOptions builds an equals filter on parentId plus one per selected option and searches readProduct with limit 1. It does not use the find-variant operation.",
    code: 'apiClient.invoke("readProduct post /product", { body: { filter, limit: 1 } })',
    state: "sw-context-token",
    typeKeys: ['operations["readProduct post /product"]["body"]'],
  },
  {
    title: "Composable",
    action: "Return a trimmed product",
    detail:
      "The criteria includes only id, translated, productNumber and seoUrls. What comes back is enough to build a link and nothing more — no price, no stock, no cover.",
    code: "response.data.elements?.[0]",
    state: "none shared",
    typeKeys: ['operations["readProduct post /product"]["response"]'],
  },
  {
    title: "UI",
    action: "Navigate or merge",
    detail:
      "The default is a route change to the variant's URL, which loads the full variant. Merging with changeVariant instead keeps the previous product's fields for everything the criteria left out.",
    code: "router.push(getProductRoute(variant))",
    state: "route or product context",
    typeKeys: ['Schemas["Product"]'],
  },
];
</script>

# Product Variants

## Goal

Build a variant selector on a product detail page: render the option groups, track the selection, resolve the matching variant and show it. The important part is that resolving a variant is a filtered product search returning a deliberately trimmed product, which is why the default behaviour is to navigate to it rather than merge it into the page.

## Shopware Flow

The Store API has an operation built for this — `searchProductVariantIds post /product/{productId}/find-variant` — and Shopware Frontends does not use it. `findVariantForSelectedOptions` instead searches `readProduct post /product` with an `equals` filter on `parentId` and one `equals` filter per selected option id, limited to one result.

That search carries an `includes` clause restricting the product to `id`, `translated`, `productNumber` and `seoUrls`. The result is therefore a link target, not a product you can render. Which is exactly why the shipped configurator pushes the router to the variant's URL and lets the page reload the real product.

<RecipeFlowDiagram label="Product variants flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A parent component calls `useProduct(product, configurator)` to provide both contexts.
2. `useProductConfigurator()` builds the initial selection from `product.optionIds`, keyed by translated group name.
3. Clicking an option calls `handleChange(groupName, optionId, onChangeHandled)`, which updates the selection and awaits your callback.
4. Your callback calls `findVariantForSelectedOptions()`, which searches `readProduct post /product`.
5. The response is one product carrying only the fields the `includes` clause allowed.
6. The callback either navigates to that variant's URL or emits it into `changeVariant()`.

You do not get a request from `handleChange` itself. The composable separates "the customer changed the selection" from "resolve what that selection means", and the second half is yours to trigger.

## Request Flow

| Step                     | Code                                                                       | Store API                                | Type                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Load the product page    | `useProductSearch().search(productId)`                                     | `POST /product/{productId}`              | <SchemaTypeTooltip type-key='operations["readProductDetail post /product/{productId}"]["response"]' />                |
| Read the option groups   | `getOptionGroups`                                                          | none                                     | <SchemaTypeTooltip type-key='Schemas["PropertyGroup"]' />                                                             |
| Change one option        | `handleChange(groupName, optionId, callback)`                              | none                                     | <SchemaTypeTooltip type-key='Schemas["PropertyGroupOption"]' />                                                       |
| Resolve the variant      | `findVariantForSelectedOptions()`                                          | `POST /product`                          | <SchemaTypeTooltip type-key='operations["readProduct post /product"]["body"]' />                                      |
| Read the trimmed variant | `response.data.elements?.[0]`                                              | `POST /product`                          | <SchemaTypeTooltip type-key='operations["readProduct post /product"]["response"]' />                                  |
| Merge without navigating | `changeVariant(variant)`                                                   | none                                     | <SchemaTypeTooltip type-key='Schemas["Product"]' />                                                                   |
| Use the dedicated route  | `invoke("searchProductVariantIds post /product/{productId}/find-variant")` | `POST /product/{productId}/find-variant` | <SchemaTypeTooltip type-key='operations["searchProductVariantIds post /product/{productId}/find-variant"]["body"]' /> |

The last row has no composable. It takes the selected options and returns variant ids, so a custom selector that only needs an id can avoid the product search entirely.

## Composables

- `useProductConfigurator`: the selector. Reads `getOptionGroups` (the configurator from the product context), `getSelectedOptions` (a group name to option id map) and `isLoadingOptions`. Acts with `handleChange(group, option, onChangeHandled)` and `findVariantForSelectedOptions(options?)`.
- `useProduct`: the product context both this recipe and the configurator depend on. `useProduct(product, configurator)` provides it, `useProduct()` injects it, and `changeVariant(partial)` merges a partial product into the current one.

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
```

`ProductDetailResponse` is where the configurator comes from: it is `{ product, configurator }`, and `configurator` is the `PropertyGroup[]` that `getOptionGroups` returns.

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const { product, configurator } = defineProps<{
  product: Schemas["Product"];
  configurator: Schemas["PropertyGroup"][];
}>();

// useProductConfigurator injects this context, so it has to be provided here
useProduct(
  toRef(() => product),
  toRef(() => configurator)
);

const {
  getOptionGroups,
  getSelectedOptions,
  handleChange,
  findVariantForSelectedOptions,
} = useProductConfigurator();

const router = useRouter();
const isResolving = ref(false);
const variantError = ref("");

const isSelected = (optionId: string) =>
  Object.values(getSelectedOptions.value).includes(optionId);

const resolveVariant = async () => {
  variantError.value = "";
  isResolving.value = true;

  try {
    const variant = await findVariantForSelectedOptions();

    if (!variant) {
      variantError.value = "This combination is not available.";
      return;
    }

    // the search only returns link fields, so navigate instead of merging
    await router.push(getProductRoute(variant));
  } finally {
    isResolving.value = false;
  }
};

const selectOption = (group: Schemas["PropertyGroup"], optionId: string) =>
  // the selection is keyed by the translated group name
  handleChange(getTranslatedProperty(group, "name"), optionId, resolveVariant);
</script>

<template>
  <p v-if="variantError">{{ variantError }}</p>

  <fieldset
    v-for="group in getOptionGroups"
    :key="group.id"
    :disabled="isResolving"
  >
    <legend>{{ getTranslatedProperty(group, "name") }}</legend>

    <label v-for="option in group.options ?? []" :key="option.id">
      <input
        type="radio"
        :name="group.id"
        :value="option.id"
        :checked="isSelected(option.id)"
        @change="selectOption(group, option.id)"
      />
      {{ getTranslatedProperty(option, "name") }}
    </label>
  </fieldset>

  <p v-if="isResolving">Loading the selected variant…</p>
</template>
```

Replacing the `router.push` with `useProduct().changeVariant(variant)` keeps the customer on the page, at the cost described below: the merged product only carries the fields the variant search asked for.

## State And Session

The product and the configurator live in the `product` and `configurator` injections that `useProduct` provides. `useProductConfigurator` takes no arguments and reads both from there, so it only works below a component that called `useProduct(product, configurator)` — otherwise `useProduct()` throws a `ContextError`.

The selection itself is local to the `useProductConfigurator()` instance, not shared. Two selectors on one page each keep their own map, but both read the same product context.

`changeVariant(variant)` writes into the shared product context with `Object.assign({}, current, variant)`. Because it merges rather than replaces, every field absent from the partial keeps the previous variant's value — which is the whole reason the shipped configurator prefers a route change.

## Edge Cases

- `getSelectedOptions` is keyed by the **translated** group name. A language switch changes the keys, and a group whose name is missing in the active language is silently skipped when the initial map is built.
- `handleChange` sends no request. Without an `onChangeHandled` callback the selection changes and nothing else happens.
- `findVariantForSelectedOptions` catches its own errors, logs them, and returns `undefined`. A failed request and an unavailable combination are indistinguishable from the outside.
- The variant search restricts the product to `id`, `translated`, `productNumber` and `seoUrls`. Passing that into `changeVariant` leaves price, stock, cover and every other field at the previous variant's values.
- The search filters on `parentId`, so it works only for a variant of a configurable product. A standalone product has no `parentId` and the filter matches nothing.
- `findVariantForSelectedOptions` accepts an options map to override the current selection. It reads `Object.values()` of it, so the keys are irrelevant — only the option ids are used.
- `isLoadingOptions` is initialised from `product.options?.length` and is never changed by the composable. Own the loading flag in your component instead.
- `useProductConfigurator()` reads `product.value.options` during setup without a guard. An empty product context throws from `useProduct` first, so provide it before mounting the selector.
- `getOptionGroups` is empty for a product without a configurator, which is the correct signal not to render a selector at all.
- A combination the catalogue does not stock returns no element. Handle `undefined` as "unavailable", not as an error.

## Common Mistakes

- Do not key the selection by group id. `handleChange` expects the translated group name.
- Do not expect `handleChange` to resolve the variant. Pass the callback that does.
- Do not render the resolved variant directly. It has almost no fields.
- Do not use `changeVariant` with the search result unless you also refetch the full product.
- Do not rely on `isLoadingOptions` for the spinner.
- Do not call `useProductConfigurator()` without a parent `useProduct(product, configurator)`.
- Do not treat `undefined` from `findVariantForSelectedOptions` as a bug — it also means the request failed silently.
- Do not build the variant URL by hand. `getProductRoute` uses the `seoUrls` the search asked for.

## Testing Checklist

- A product without a configurator renders no option groups.
- The initial selection matches `product.optionIds`, one option per group.
- Clicking an option updates `getSelectedOptions` and issues exactly one `readProduct post /product` request.
- That request filters on `parentId` and on one `optionIds` value per selected option.
- A resolvable combination navigates to the variant's SEO URL.
- An unavailable combination renders an unavailable message and stays on the page.
- The option groups are disabled while a variant is being resolved.
- Switching the language changes the keys of `getSelectedOptions` without losing the selected option ids.

## Related Links

- [Product detail page](../../getting-started/e-commerce/product-detail-page.html)
- [Product listing documentation](../../getting-started/e-commerce/product-listing.html)
- [Helpers package](../../packages/helpers.html)
- [CMS base layer package](../../packages/cms-base-layer.html)
- [Composables reference](../../packages/composables/)
