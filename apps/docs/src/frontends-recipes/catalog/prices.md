---
nav:
  position: 10
recipe:
  area: catalog
  status: stable
  frameworks:
    - vue
  composables:
    - usePrice
    - useProductPrice
    - useSessionContext
    - useShopwareContext
  helpers:
    - getProductTierPrices
  operations:
    - readContext get /context
    - updateContext patch /context
  schemas:
    - CalculatedPrice
    - CartListPrice
    - CartPrice
    - CartPriceReference
    - Currency
    - Product
---

<script setup>
import CodeExample from "../../components/CodeExample.vue";
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Store API",
    action: "Calculate on the server",
    detail:
      "Prices arrive already calculated for the current context. taxState decides whether the numbers are gross or net, and nothing in the frontend converts between them.",
    code: "GET /store-api/context",
    state: "sw-context-token",
    typeKeys: ['operations["readContext get /context"]["response"]'],
  },
  {
    title: "Shared state",
    action: "Seed the formatter",
    detail:
      "On the client usePrice is wrapped in createSharedComposable, so the first caller creates the instance every other component reuses. During SSR that wrapper bails out and every call site gets its own instance, so no root initialization is required on either side.",
    code: "usePrice()",
    state: "currencyCode, currencyLocale",
    typeKeys: ['Schemas["Currency"]'],
  },
  {
    title: "Composable",
    action: "Follow the currency",
    detail:
      "usePrice watches sessionContext.currency and calls update with the new ISO code. It passes no locale, so the locale is whatever was resolved on the first call.",
    code: "watch(() => sessionContext.value?.currency, (c) => c && update({ currencyCode: c.isoCode }), { immediate: true })",
    state: "currencyCode",
    typeKeys: ['Schemas["Currency"]'],
  },
  {
    title: "Composable",
    action: "Pick the right price",
    detail:
      "useProductPrice chooses between calculatedPrice and the first calculatedPrices entry, and switches to the cheapest tier once calculatedPrices holds more than one entry.",
    code: "const { unitPrice, displayFrom } = useProductPrice(toRef(() => product))",
    state: "derived refs",
    typeKeys: ['Schemas["CalculatedPrice"]'],
  },
  {
    title: "Composable",
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

Every product price in a Store API response is a `CalculatedPrice` computed for the session's context. The context's `taxState` says whether those numbers include tax, so the same product returns different values for a gross and a net context. The frontend never adds or removes a tax rate itself: `taxState` follows the customer group and the context, so it changes as a side effect of patching something else — a country, a customer — and every price then has to be refetched.

On top of that, one product can carry several prices. `calculatedPrice` is the plain one, `calculatedPrices` is the tier list, and `calculatedCheapestPrice` is the cheapest across a variant range. `useProductPrice` exists to answer "which of these do I show", and `usePrice` exists to turn the chosen number into a string.

<RecipeFlowDiagram label="Pricing flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The Store API returns prices already calculated for the context, gross or net according to `taxState`.
2. `usePrice` is shared on the client: the first component to call it creates the one instance the browser session reuses. On the server there is no sharing, and each call site formats from its own state.
3. That instance watches `sessionContext.currency` with `immediate: true`, so it seeds and updates its own currency code from the context.
4. `useProductPrice(toRef(() => product))` picks the price to display from `calculatedPrice`, `calculatedPrices` and the tier list.
5. `hasListPrice` and `price.listPrice` tell you whether to render a reduction.
6. `getFormattedPrice(value)` formats that number with `Intl.NumberFormat`.

You do not need to compute a gross price from a net one, or a discount percentage from two prices. Both come from the server — `listPrice.percentage` is the reduction. The UI reads every one of these from composables instead of keeping its own copy.

## Request Flow

| Step                | Code                             | Store API                            | Type                                                                                |
| ------------------- | -------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| Read the tax state  | `taxState`                       | `GET /context`                       | <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' /> |
| Read the currency   | `currency`                       | `GET /context`                       | <SchemaTypeTooltip type-key='Schemas["Currency"]' />                                |
| Switch the currency | `setCurrency({ id })`            | `PATCH /context` then `GET /context` | <SchemaTypeTooltip type-key='operations["updateContext patch /context"]["body"]' /> |
| Pick the price      | `useProductPrice(product).price` | none                                 | <SchemaTypeTooltip type-key='Schemas["CalculatedPrice"]' />                         |
| Read the reduction  | `price?.listPrice`               | none                                 | <SchemaTypeTooltip type-key='Schemas["CartListPrice"]' />                           |
| Read the reference  | `referencePrice`                 | none                                 | <SchemaTypeTooltip type-key='Schemas["CartPriceReference"]' />                      |
| Format for display  | `getFormattedPrice(unitPrice)`   | none                                 | <SchemaTypeTooltip type-key='Schemas["CalculatedPrice"]' />                         |

Only `setCurrency` issues requests, and it issues two: the `PATCH` and the `refreshSessionContext()` that follows it. The first two rows read the context that `GET /context` already populated, and every row below reads data the product response already carried — which is why displaying a price needs no request of its own.

## Composables

Pick by scope — how much of the price problem the composable is about:

| Composable           | Scope             | Reach for it when                                       |
| -------------------- | ----------------- | ------------------------------------------------------- |
| `useSessionContext`  | the whole session | reading `taxState` or `currency`, or switching currency  |
| `useProductPrice`    | one product       | deciding which of a product's prices to show             |
| `usePrice`           | one number        | turning any value into a formatted string                |
| `useShopwareContext` | the application   | reading `browserLocale`, the seed for the number format  |

`useProductPrice` is the one you reach for most. It takes a `Ref<Product | undefined>` and derives everything else from it:

- **The price** — `price` (the whole chosen `CalculatedPrice`), `unitPrice`, `totalPrice`.
- **Ranges** — `displayFrom`, `displayFromVariants`, `tierPrices`.
- **Extras** — `referencePrice`, `regulationPrice`, `hasListPrice`, and its deprecated alias `isListPrice`.

Four things the generated reference will not tell you:

- `usePrice` is wrapped in `createSharedComposable` from `@vueuse/core`, and that wrapper is **client-only** — its source begins `if (!isClient) return composable`. During SSR every call site gets its own instance and reads its own arguments; only in the browser is there a single instance to share.
- That shared instance is reference-counted, not permanent. When the last component holding it unmounts, its effect scope is stopped and the next call builds a fresh one — so nothing you pass it survives a navigation through a page that renders no prices.
- `usePrice`'s parameter object requires `currencyCode` whenever it is passed at all, so `localeCode` cannot be supplied on its own. `update()` has the same shape.
- `useProductPrice` takes a `Ref`, not a product. It reads `product.value` in every computed, so passing the object directly yields empty strings rather than an error.

`useSessionContext` is the source of truth for `taxState` and `currency`. `setCurrency({ id })` changes the currency and calls `refreshSessionContext()` itself; `taxState` is read-only here — the `PATCH /context` body accepts no tax field, so it only ever moves as a consequence of another context change.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type prices, currencies, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='Schemas["CalculatedPrice"]' />
  <SchemaTypeTooltip type-key='Schemas["CartListPrice"]' />
  <SchemaTypeTooltip type-key='Schemas["CartPrice"]' />
  <SchemaTypeTooltip type-key='Schemas["CartPriceReference"]' />
  <SchemaTypeTooltip type-key='Schemas["Currency"]' />
  <SchemaTypeTooltip type-key='operations["readContext get /context"]["response"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type CalculatedPrice = Schemas["CalculatedPrice"];
type ListPrice = Schemas["CartListPrice"];
type CartPrice = Schemas["CartPrice"];
type ReferencePrice = Schemas["CartPriceReference"];
type Currency = Schemas["Currency"];
type SessionContext = operations["readContext get /context"]["response"];
```

`CalculatedPrice` is the type to open first. Alongside `unitPrice` and `totalPrice` it carries `quantity`, `calculatedTaxes`, `listPrice`, `referencePrice` and `regulationPrice`, plus `taxRules` just past the tooltip's field limit.

Two fields people expect to find there are **not** on `CalculatedPrice`. `netPrice` and `taxStatus` belong to `CartPrice` — the cart's total, not a product's price — where `taxStatus` is enumerated `gross | net | tax-free`. A product price carries its tax breakdown in `calculatedTaxes` and `taxRules` instead, and the gross-or-net question is answered by the context's `taxState`, not by the price object.

## Minimal Vue Example

<CodeExample title="Minimal product price">

```vue
<script setup lang="ts">
import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { getFormattedPrice } = usePrice();
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

const showFrom = computed(
  () => displayFrom.value || !!displayFromVariants.value,
);

const displayedPrice = computed(() =>
  displayFromVariants.value ? displayFromVariants.value : unitPrice.value,
);

const taxNote = computed(() => {
  if (taxState.value === "tax-free") return "tax free";
  if (taxState.value === "gross") return "incl. tax";
  return taxState.value === "net" ? "excl. tax" : "";
});
</script>

<template>
  <div aria-live="polite">
    <p>
      <span v-if="showFrom">from </span>
      <span class="sr-only">Current price</span>
      <strong>{{ getFormattedPrice(displayedPrice) }}</strong>
      <small> {{ taxNote }}</small>
    </p>

    <p v-if="hasListPrice && price?.listPrice">
      <span class="sr-only">Previous price</span>
      <del>{{ getFormattedPrice(price.listPrice.price) }}</del>
      <span> Save {{ price.listPrice.percentage }}%</span>
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
      <caption>
        Quantity discounts
      </caption>
      <thead>
        <tr>
          <th scope="col">Quantity</th>
          <th scope="col">Unit price</th>
        </tr>
      </thead>
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

</CodeExample>

`usePrice()` is called without arguments here on purpose, and the example carries no loading branch. `vue-starter-template` awaits `GET /context` in `app.vue` before any page component's setup runs, and `usePrice`'s watcher is `immediate`, so `currencyCode` already holds the ISO code by the time this component renders. The `aria-live="polite"` wrapper is what covers the case the guard looks like it covers: a price that reformats in place after a currency switch is otherwise never announced.

The English strings here are literals to keep the example short. Route them through your translation layer in a localized storefront, or a German page will have a German screen reader pronouncing "incl. tax".

## State And Session

`usePrice` is shared on the client, and its state is exactly two refs: `currencyCode` and `currencyLocale`. The currency code follows the context — the composable watches `sessionContext.currency` with `immediate: true` and calls `update()` whenever it changes. Because that watcher is immediate, the formatter seeds itself from the session context; `vue-starter-template` never calls `usePrice` with arguments anywhere, and prices still format correctly.

The sharing is narrower than it looks, in two directions. `createSharedComposable` starts with `if (!isClient) return composable`, so during SSR `usePrice` is the plain composable: every call site builds its own refs and honours its own arguments. And on the client the shared instance is reference-counted — when the last component holding it unmounts, its scope is stopped and the next caller creates a new one. Neither of those matters while every call is argument-free, which is why the starter never trips over them.

The locale does not follow the context. That `update()` call passes only `currencyCode`, and `update` keeps the previous locale when none is given. The initial locale is `localeCode` if the caller that created the instance passed one, and otherwise `browserLocale` from `useShopwareContext()` — `navigator.language` on the client, the first `accept-language` entry on the server, and `"en-US"` only when neither is available. It is read once when the Nuxt plugin runs, so a language switch changes translations but not the number formatting.

`taxState` lives on the context under `context.taxState` and is typed as a plain, optional `string` in the schema. It is not something the frontend sets directly: it follows the customer group and the context, and a change to it invalidates every price currently rendered.

## Edge Cases

- `getFormattedPrice(undefined)` returns an empty string, and with no `currencyCode` or `currencyLocale` set it returns the raw value as a string. In practice `currencyLocale` is never empty, so the unformatted case only happens before the session context has a currency.
- `createSharedComposable` is client-only. On the server `usePrice` is the unwrapped composable, so a `usePrice({ currencyCode, localeCode })` that looks inert because "only the first call counts" does take effect in that component's SSR output — and is then dropped at hydration, producing exactly the format mismatch described below.
- On the client the shared instance is destroyed once its last subscriber unmounts. A `localeCode` set on a product page does not survive a visit to a page that renders no prices; the next instance falls back to `browserLocale`. If you need a session-wide locale, subscribe from somewhere that never unmounts.
- `usePrice`'s parameter object types `currencyCode` as required, so `usePrice({ localeCode })` does not compile. You have to pass a `currencyCode` too, and the immediate watcher overwrites it from the context on the next tick.
- `useProductPrice` reads `calculatedPrices[0]` when that array is non-empty and falls back to `calculatedPrice`. A tiered product's "normal" price is the first tier, not `calculatedPrice`.
- `displayFrom` is `true` when there is more than one entry in `calculatedPrices`, and the displayed price then switches to the **cheapest** tier rather than the first one. The second guard in the source, `getProductTierPrices(product).length > 1`, is redundant: the helper from `@shopware/helpers` maps `calculatedPrices` one-to-one, so it can never disagree with `displayFrom`.
- `displayFromVariants` returns `number | false | undefined`, not a boolean. It is the cheapest variant unit price when the product has a `parentId`, `calculatedCheapestPrice.hasRange` is true, and that unit price differs from `calculatedPrices[0]` (or `calculatedPrice`) — note the comparison is against that price, not against the possibly-cheaper tier `price` resolved to.
- `hasListPrice` reads `listPrice.percentage`. A list price present with a zero or missing percentage counts as no reduction, so no strikethrough is rendered even though `listPrice` exists.
- `isListPrice` is a deprecated alias of `hasListPrice`. Both point at the same computed.
- `regulationPrice` always reads `calculatedPrice.regulationPrice.price`, never the tier price that `price` resolved to. For a tiered product the two describe different prices.
- `referencePrice` has the same mismatch: it is read from `calculatedPrices[0]` (or `calculatedPrice`), not from the cheapest tier that `price` resolved to. On a tiered product the "per unit" figure therefore belongs to a different tier than the price next to it.
- `tierPrices` labels the last entry `from {quantity}` and every earlier one `to {quantity}`, in English, from the helper. Translate the labels yourself if the storefront is localized.
- `CalculatedPrice` has no `taxStatus` and no `netPrice`. Both live on `CartPrice`, where `taxStatus` is `gross | net | tax-free` — all three, `gross` included. For a product price, read the context's `taxState` instead.
- `browserLocale` is resolved from the `accept-language` header on the server and from `navigator.language` on the client, so SSR output and hydration can format the same price differently. The starter makes this the common case rather than a rare one: its `routeRules` put `isr` on `/**`, so one visitor's `accept-language` produces HTML replayed to everyone for 24 hours. Derive the formatting locale from the URL — the i18n prefix — or keep priced routes out of `isr`.
- A currency switch changes the formatter immediately but leaves already-fetched prices as they were. Refetch listings and carts after `setCurrency()`.

## Common Mistakes

- Do not add or subtract tax in the frontend. Patch the context and refetch.
- Do not reach for `calculatedPrice.taxStatus` or `calculatedPrice.netPrice`. Neither field exists on `CalculatedPrice`.
- Do not compute a discount percentage from two prices. Use `listPrice.percentage`.
- Do not read `product.calculatedPrice.unitPrice` directly on a tiered product. Use `useProductPrice`.
- Do not pass a product to `useProductPrice`. It wants a `Ref`, and a plain object renders empty strings instead of raising.
- Do not assume `usePrice` arguments are inert. They are ignored only on the client, and only after an instance already exists.
- Do not treat `displayFromVariants` as a boolean.
- Do not expect the number format to change with the language. Only the currency follows the context.
- Do not render a strikethrough whenever `listPrice` exists. Check `hasListPrice`.
- Do not show `tierPrices` labels untranslated in a localized storefront.
- Do not keep formatted price strings in state across a currency switch.

## Testing Checklist

- `currencyCode` is non-empty by the time the first price renders, with no explicit initialization anywhere.
- `getFormattedPrice(undefined)` renders nothing rather than `NaN` or `undefined`.
- A product with a single price shows `calculatedPrice.unitPrice`, formatted in the context currency.
- A product with tiers shows the cheapest tier and a "from" prefix.
- A variant with a cheapest-price range shows the cheapest variant price and a "from" prefix.
- A reduced product renders the list price struck through with `listPrice.percentage`, and a screen reader announces which of the two figures is current.
- A product with a `listPrice` but no percentage renders no strikethrough.
- Switching the currency reformats every rendered price without a reload.
- Switching the currency and refetching a listing returns different price values.
- A gross and a net context produce different numbers for the same product.
- The SSR output and the hydrated DOM format the same price identically on an `isr` route.

## Related Links

- [Work with prices](../../guides/e-commerce/prices.html)
- [Product detail page](../../guides/e-commerce/product-detail-page.html)
- [Helpers package](../../packages/helpers.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
