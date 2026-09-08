---
nav:
  position: 40
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - usePrice
    - useProductPrice
    - useSessionContext
  helpers:
    - getProductTierPrices
  operations:
    - readContext get /context
    - updateContext patch /context
  schemas:
    - CalculatedPrice
    - CartListPrice
    - CartPriceReference
    - Currency
    - Product
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Store API",
    action: "Calculate on the server",
    detail:
      "Prices arrive already calculated for the current context. taxState decides whether the numbers are gross or net, and nothing in the frontend converts between them.",
    code: "sessionContext.context.taxState",
    state: "swSessionContext",
    typeKeys: ['operations["readContext get /context"]["response"]'],
  },
  {
    title: "Root",
    action: "Seed the formatter",
    detail:
      "usePrice is a shared composable. The application root calls it once with the currency code from the context so every component below formats identically.",
    code: "usePrice({ currencyCode: context.currency.isoCode })",
    state: "currencyCode, currencyLocale",
    typeKeys: ['Schemas["Currency"]'],
  },
  {
    title: "Composable",
    action: "Follow the currency",
    detail:
      "usePrice watches sessionContext.currency and calls update with the new ISO code. It passes no locale, so the locale is whatever was resolved on the first call.",
    code: "watch(() => sessionContext.currency, (c) => update({ currencyCode: c.isoCode }))",
    state: "currencyCode",
    typeKeys: [
      'operations["updateContext patch /context"]["body"]',
    ],
  },
  {
    title: "Product",
    action: "Pick the right price",
    detail:
      "useProductPrice chooses between calculatedPrice and the first calculatedPrices entry, and switches to the cheapest tier once there is more than one tier.",
    code: "const { unitPrice, displayFrom } = useProductPrice(product)",
    state: "derived refs",
    typeKeys: ['Schemas["CalculatedPrice"]'],
  },
  {
    title: "Product",
    action: "Detect a reduction",
    detail:
      "hasListPrice reads listPrice.percentage on the chosen price. A list price with no percentage is treated as no discount, so no strikethrough is rendered.",
    code: "hasListPrice, price?.listPrice",
    state: "derived refs",
    typeKeys: ['Schemas["CartListPrice"]'],
  },
  {
    title: "UI",
    action: "Format one number",
    detail:
      "getFormattedPrice runs Intl.NumberFormat with the shared currency and locale. Given no currency code it silently returns the raw number as a string.",
    code: "getFormattedPrice(unitPrice)",
    state: "reactive UI",
    typeKeys: [],
  },
];
</script>

# Prices and Tax State

## Goal

Render product prices correctly: the right price for a product with tiers or variants, a strikethrough for a reduction, and a formatted string in the current currency. The important part is that no price arithmetic belongs in the frontend — the Store API sends numbers already calculated for the current tax state, and the frontend only picks one and formats it.

## Shopware Flow

Every price in a Store API response is a `CalculatedPrice` computed for the session's context. The context's `taxState` says whether those numbers include tax, so the same product returns different values for a gross and a net context. Changing the tax state means patching the context and refetching — never adding or removing a tax rate client-side.

On top of that, one product can carry several prices. `calculatedPrice` is the plain one, `calculatedPrices` is the tier list, and `calculatedCheapestPrice` is the cheapest across a variant range. `useProductPrice` exists to answer "which of these do I show", and `usePrice` exists to turn the chosen number into a string.

<RecipeFlowDiagram label="Pricing flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The Store API returns prices already calculated for the context, gross or net according to `taxState`.
2. The application root calls `usePrice({ currencyCode })` once, seeding the shared formatter.
3. `usePrice` watches `sessionContext.currency` and updates its currency code when the customer switches currency.
4. `useProductPrice(product)` picks the price to display from `calculatedPrice`, `calculatedPrices` and the tier list.
5. `hasListPrice` and `price.listPrice` tell you whether to render a reduction.
6. `getFormattedPrice(value)` formats that number with `Intl.NumberFormat`.

You do not need to compute a gross price from a net one, or a discount percentage from two prices. Both come from the server — `listPrice.percentage` is the reduction.

## Request Flow

| Step                | Code                                 | Store API        | Type                                                                                |
| ------------------- | ------------------------------------ | ---------------- | ----------------------------------------------------------------------------------- |
| Read the tax state  | `taxState`                           | `GET /context`   | <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' /> |
| Read the currency   | `currency`                           | `GET /context`   | <SchemaTypeTooltip type-key='Schemas["Currency"]' />                                |
| Switch the currency | `setCurrency({ id })`                | `PATCH /context` | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' /> |
| Pick the price      | `useProductPrice(product).unitPrice` | none             | <SchemaTypeTooltip type-key='Schemas["CalculatedPrice"]' />                         |
| Read the reduction  | `price?.listPrice`                   | none             | <SchemaTypeTooltip type-key='Schemas["CartListPrice"]' />                           |
| Read the reference  | `referencePrice`                     | none             | <SchemaTypeTooltip type-key='Schemas["CartPriceReference"]' />                      |
| Format for display  | `getFormattedPrice(unitPrice)`       | none             | none — `Intl.NumberFormat` output                                                   |

Only the first three rows are requests. Everything else reads data the product response already carried, which is why a price does not need a request of its own.

## Composables

- `usePrice`: the shared formatter. Exposes `getFormattedPrice(value)`, `currencyCode`, `currencyLocale` and `update({ currencyCode, localeCode })`. Wrapped in `createSharedComposable`, so the root's initialisation applies application-wide.
- `useProductPrice`: takes a `Ref<Product>` and answers which price to show. Exposes `price`, `unitPrice`, `totalPrice`, `referencePrice`, `tierPrices`, `displayFrom`, `displayFromVariants`, `hasListPrice` and `regulationPrice`.
- `useSessionContext`: the source of truth for `taxState` and `currency`, and the only way to change either.

## Types

Use generated Store API types when you need to type prices, currencies, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='Schemas["CalculatedPrice"]' />
  <SchemaTypeTooltip type-key='Schemas["CartListPrice"]' />
  <SchemaTypeTooltip type-key='Schemas["CartPriceReference"]' />
  <SchemaTypeTooltip type-key='Schemas["Currency"]' />
  <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type CalculatedPrice = Schemas["CalculatedPrice"];
type ListPrice = Schemas["CartListPrice"];
type ReferencePrice = Schemas["CartPriceReference"];
type Currency = Schemas["Currency"];
type SessionContext = operations["readContext get /context"]["response"];
```

`CalculatedPrice` is worth opening in the tooltip: alongside `unitPrice` and `totalPrice` it carries `netPrice`, `calculatedTaxes`, `listPrice`, `referencePrice`, `regulationPrice` and a `taxStatus` whose enum is `net` or `tax-free`.

## Minimal Vue Example

```vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { getFormattedPrice, currencyCode } = usePrice();
const { taxState } = useSessionContext();
const {
  price,
  unitPrice,
  displayFrom,
  displayFromVariants,
  tierPrices,
  referencePrice,
  hasListPrice,
  regulationPrice,
} = useProductPrice(toRef(() => product));

// "from" applies either across tiers or across a variant range
const showFrom = computed(
  () => displayFrom.value || !!displayFromVariants.value
);

const displayedPrice = computed(() =>
  displayFromVariants.value ? displayFromVariants.value : unitPrice.value
);

const taxNote = computed(() => {
  if (taxState.value === "tax-free") return "tax free";
  return taxState.value === "gross" ? "incl. tax" : "excl. tax";
});
</script>

<template>
  <p v-if="!currencyCode">Loading prices…</p>

  <div v-else>
    <p>
      <span v-if="showFrom">from </span>
      <strong>{{ getFormattedPrice(displayedPrice) }}</strong>
      <small> {{ taxNote }}</small>
    </p>

    <p v-if="hasListPrice && price?.listPrice">
      <del>{{ getFormattedPrice(price.listPrice.price) }}</del>
      <span> −{{ price.listPrice.percentage }}%</span>
    </p>

    <p v-if="regulationPrice">
      Lowest price in the last 30 days
      {{ getFormattedPrice(regulationPrice) }}
    </p>

    <p v-if="referencePrice">
      {{ getFormattedPrice(referencePrice.price) }} per
      {{ referencePrice.referenceUnit }} {{ referencePrice.unitName }}
    </p>

    <table v-if="tierPrices.length > 1">
      <tbody>
        <tr v-for="tier in tierPrices" :key="tier.quantity">
          <th scope="row">{{ tier.label }}</th>
          <td>{{ getFormattedPrice(tier.unitPrice) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

`usePrice()` is called without arguments here on purpose. The root already seeded it, and passing a currency code in a child would change the formatter for the whole application.

## State And Session

`usePrice` is shared, and its state is exactly two refs: `currencyCode` and `currencyLocale`. The currency code follows the context — the composable watches `sessionContext.currency` with `immediate: true` and calls `update()` whenever it changes.

The locale does not follow. That `update()` call passes only `currencyCode`, and `update` keeps the previous locale when none is given. The initial locale is whatever the root passed, falling back to `browserLocale` from the Shopware context, which itself defaults to `"en-US"`. A language switch therefore changes translations and prices but not the number formatting.

`taxState` lives on the context under `context.taxState` and is typed as a plain `string` in the schema. It is not something the frontend sets directly: it follows the customer group and the context, and a change to it invalidates every price currently rendered.

## Edge Cases

- `getFormattedPrice(undefined)` returns an empty string, and with no `currencyCode` or `currencyLocale` set it returns the raw value as a string. A missing root initialisation shows unformatted numbers rather than an error.
- Calling `usePrice({ currencyCode })` in a child component overwrites the shared formatter for the entire application, because the composable is shared.
- `useProductPrice` reads `calculatedPrices[0]` when that array is non-empty and falls back to `calculatedPrice`. A tiered product's "normal" price is the first tier, not `calculatedPrice`.
- `displayFrom` is `true` when there is more than one entry in `calculatedPrices`. The displayed price then switches to the **cheapest** tier — but only when `getProductTierPrices` also reports more than one tier.
- `displayFromVariants` returns `number | false | undefined`, not a boolean. It is the cheapest variant unit price when the product has a `parentId`, the cheapest price `hasRange`, and that price differs from the current one.
- `hasListPrice` reads `listPrice.percentage`. A list price present with a zero or missing percentage counts as no reduction, so no strikethrough is rendered even though `listPrice` exists.
- `isListPrice` is a deprecated alias of `hasListPrice`. Both point at the same computed.
- `regulationPrice` always reads `calculatedPrice.regulationPrice.price`, never the tier price that `price` resolved to. For a tiered product the two describe different prices.
- `tierPrices` labels the last entry `from {quantity}` and every earlier one `to {quantity}`, in English, from the helper. Translate the labels yourself if the storefront is localised.
- `CalculatedPrice.taxStatus` is enumerated as `net` or `tax-free` only. Do not branch on it expecting a `gross` member.
- A currency switch changes the formatter immediately but leaves already-fetched prices as they were. Refetch listings and carts after `setCurrency()`.

## Common Mistakes

- Do not add or subtract tax in the frontend. Patch the context and refetch.
- Do not compute a discount percentage from two prices. Use `listPrice.percentage`.
- Do not read `product.calculatedPrice.unitPrice` directly on a tiered product. Use `useProductPrice`.
- Do not call `usePrice({ currencyCode })` anywhere but the application root.
- Do not treat `displayFromVariants` as a boolean.
- Do not expect the number format to change with the language. Only the currency follows the context.
- Do not render a strikethrough whenever `listPrice` exists. Check `hasListPrice`.
- Do not show `tierPrices` labels untranslated in a localised storefront.
- Do not keep formatted price strings in state across a currency switch.

## Testing Checklist

- The root initialises `usePrice` before any price is rendered, and `currencyCode` is non-empty.
- `getFormattedPrice(undefined)` renders nothing rather than `NaN` or `undefined`.
- A product with a single price shows `calculatedPrice.unitPrice`, formatted in the context currency.
- A product with tiers shows the cheapest tier and a "from" prefix.
- A variant with a cheapest-price range shows the cheapest variant price and a "from" prefix.
- A reduced product renders the list price struck through with `listPrice.percentage`.
- A product with a `listPrice` but no percentage renders no strikethrough.
- Switching the currency reformats every rendered price without a reload.
- Switching the currency and refetching a listing returns different price values.
- A gross and a net context produce different numbers for the same product.

## Related Links

- [Prices documentation](../../getting-started/e-commerce/prices.html)
- [Product detail page](../../getting-started/e-commerce/product-detail-page.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
