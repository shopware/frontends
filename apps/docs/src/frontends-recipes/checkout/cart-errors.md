---
nav:
  position: 20
recipe:
  area: checkout
  status: stable
  frameworks:
    - vue
  composables:
    - useCartErrorParamsResolver
    - useCartNotification
    - useCart
    - useNotifications
  helpers: []
  operations:
    - readCart get /checkout/cart
    - addLineItem post /checkout/cart/line-item
    - updateLineItem patch /checkout/cart/line-item
  schemas:
    - Cart
    - CartError
    - LineItem
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "Store API",
    action: "Succeed and complain",
    detail:
      "A cart write returns 200 with the recalculated cart and an errors field. The status code says the request worked, not that the customer got what they asked for.",
    code: "const { data } = await addProduct({ id, quantity: 99 })",
    state: "sw-context-token",
    typeKeys: [
      'operations["addLineItem post /checkout/cart/line-item"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Collect, do not render",
    detail:
      "useCart merges the errors map into swCartErrors on every write. It is deliberately separate from the cart, so the request that produced it does not have to render it.",
    code: "setCartErrors(data)",
    state: "swCartErrors",
    typeKeys: ['Schemas["Cart"]'],
  },
  {
    title: "UI",
    action: "Consume once",
    detail:
      "getErrorsCodes and codeErrorsNotification both call consumeCartErrors, which deep-clones the map and then clears it. The second caller for the same response sees nothing.",
    code: "const errors = getErrorsCodes()",
    state: "swCartErrors cleared",
    typeKeys: ['Schemas["CartError"]'],
  },
  {
    title: "Resolver",
    action: "Build the params",
    detail:
      "resolveCartError turns one error into a messageKey and a params object. For a stock error it looks the product up in the cart to get its name and maximum quantity.",
    code: "const { messageKey, params } = resolveCartError(error)",
    state: "none",
    typeKeys: ['Schemas["LineItem"]'],
  },
  {
    title: "i18n",
    action: "Translate the key",
    detail:
      "The messageKey maps to a snippet under errors.*, and the params fill its placeholders. The message on the error is a fallback, not the string to show.",
    code: 't(`errors.${messageKey}`, params)',
    state: "translated string",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Notify the customer",
    detail:
      "pushError renders it. One messageKey is special-cased as a success, and the error level from the API is not consulted at all.",
    code: "pushError(t(`errors.${messageKey}`, params))",
    state: "swNotifications",
    typeKeys: [],
  },
];
</script>

# Cart Errors

## Goal

Turn the `errors` a cart response carries into messages a customer can act on. The important part is that these are not failed requests: a cart write returns `200`, the recalculated cart, _and_ a list of things that did not go the way the customer asked.

## Shopware Flow

Cart errors have no operation of their own. They arrive as the `errors` field on the response of `readCart get /checkout/cart` and every line item write. A stock limit, a blocked shipping method, an invalid promotion code — all of them come back with a success status.

`useCart` therefore treats them as a second output. Every write calls `setCartErrors(data)`, which merges the errors map into a shared `swCartErrors` value separate from the cart itself. That separation is what lets a notification layer consume them once, somewhere else on the page, without the component that issued the request having to know about them.

<RecipeFlowDiagram label="Cart errors flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A cart write returns `200` with the recalculated cart and an `errors` field.
2. `useCart` merges that field into `swCartErrors` with `Object.assign`.
3. `getErrorsCodes()` or `codeErrorsNotification()` consumes the map, clearing it in the process.
4. `resolveCartError(error)` produces a `messageKey` and a `params` object for one entry.
5. Your i18n layer translates `errors.<messageKey>` with those params.
6. `pushError` shows it — except for one key that is treated as a success.

You do not need to check the HTTP status to find these. A rejected request is a different thing entirely: that throws an `ApiClientError` and never reaches `swCartErrors`.

## Request Flow

| Step                      | Code                            | Store API                        | Type                                                                                                     |
| ------------------------- | ------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Read the cart             | `refreshCart()`                 | `GET /checkout/cart`             | <SchemaTypeTooltip type-key='operations["readCart get /checkout/cart"]["response"]' />                   |
| Add and collect errors    | `addProduct({ id, quantity })`  | `POST /checkout/cart/line-item`  | <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["response"]' />     |
| Update and collect errors | `changeProductQuantity(params)` | `PATCH /checkout/cart/line-item` | <SchemaTypeTooltip type-key='operations["updateLineItem patch /checkout/cart/line-item"]["response"]' /> |
| Read the errors field     | `cart.errors`                   | any of the above                 | <SchemaTypeTooltip type-key='Schemas["Cart"]' />                                                         |
| Read one error            | `errors[key]`                   | none                             | <SchemaTypeTooltip type-key='Schemas["CartError"]' />                                                    |
| Consume the collected map | `getErrorsCodes()`              | none                             | <SchemaTypeTooltip type-key='Schemas["CartError"]' />                                                    |

Every row in the `Store API` column is a cart operation you already call for another reason. There is no request in this recipe that exists only for errors.

## Composables

- `useCart`: the source. `consumeCartErrors()` returns the collected map and clears it; the write methods fill it.
- `useCartNotification`: the ready-made consumer. `codeErrorsNotification()` consumes and pushes notifications; `getErrorsCodes()` consumes and returns the non-success errors as an array.
- `useCartErrorParamsResolver`: `resolveCartError(error)` maps one error to a `{ messageKey, params }` pair suited to an i18n snippet.
- `useNotifications`: `pushError`, `pushWarning`, `pushInfo` and `pushSuccess`, plus the `notifications` list a toast component renders.

## Types

Use generated Store API types when you need to type the errors field, one error, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readCart get /checkout/cart"]["response"]' />
  <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["Cart"]' />
  <SchemaTypeTooltip type-key='Schemas["CartError"]' />
  <SchemaTypeTooltip type-key='Schemas["LineItem"]' />
</div>

```ts
import type { Schemas } from "#shopware";

type Cart = Schemas["Cart"];
type CartErrors = Cart["errors"];
type CartError = Schemas["CartError"];
```

`CartErrors` is the type to read carefully. The schema declares it as `anyOf` a `CartError[]` **and** a map of error key to error object, and the two shapes differ: the map form requires a numeric `code` that the array form does not have. Everything in Shopware Frontends handles the map form only.

## Minimal Vue Example

```vue
<script setup lang="ts">
const { addProduct, cartItems, count } = useCart();
const { getErrorsCodes } = useCartNotification();
const { resolveCartError } = useCartErrorParamsResolver();
const { pushError, pushSuccess } = useNotifications();
const { t } = useI18n();

const SUCCESS_KEYS = ["promotion-discount-added"];

const isAdding = ref(false);
const requestError = ref("");

const reportCartErrors = () => {
  // consumes and clears the shared map, so call it exactly once per write
  for (const error of getErrorsCodes() ?? []) {
    const { messageKey, params } = resolveCartError(error);
    const message = t(
      `errors.${messageKey}`,
      (params ?? {}) as Record<string, unknown>
    );

    // the level from the API is not consulted by codeErrorsNotification
    if (error.level === 0) {
      pushSuccess(message);
    } else {
      pushError(message);
    }
  }
};

const add = async (productId: string, quantity: number) => {
  requestError.value = "";
  isAdding.value = true;

  try {
    const cart = await addProduct({ id: productId, quantity });

    // a 2xx response can still carry errors
    reportCartErrors();

    if (
      Object.values(cart.errors ?? {}).some((error) =>
        SUCCESS_KEYS.includes(error.messageKey)
      )
    ) {
      pushSuccess(t("cart.promotionApplied"));
    }
  } catch {
    // a rejected request never reaches the shared error map
    requestError.value = "The product could not be added to your cart.";
  } finally {
    isAdding.value = false;
  }
};
</script>

<template>
  <p v-if="requestError">{{ requestError }}</p>

  <p>{{ count }} items in your cart</p>

  <ul>
    <li v-for="item in cartItems" :key="item.id">
      {{ item.label }} × {{ item.quantity }}
    </li>
  </ul>

  <button type="button" :disabled="isAdding" @click="add('a-product-id', 99)">
    {{ isAdding ? "Adding…" : "Add 99 to the cart" }}
  </button>
</template>
```

The example reads `cart.errors` off the write response _and_ consumes the shared map, which are two views of the same data. Pick one: the response is per-request, the shared map is cumulative across writes.

## State And Session

`swCartErrors` is a shared context value alongside `swCart`, and it accumulates. `setCartErrors` merges each response's errors into whatever is already there with `Object.assign`, keyed by error key, so two writes in a row produce one combined map.

`consumeCartErrors()` is destructive: it deep-clones the value through `JSON.parse(JSON.stringify(...))`, sets the shared value to `null`, and returns the clone. Both `codeErrorsNotification()` and `getErrorsCodes()` call it, so they cannot be used together for the same response — the second one gets nothing.

Errors are session state, not component state. They belong to the cart behind the `sw-context-token`, which means a mini cart, a cart page and a checkout step all read the same map — and whichever one consumes first wins.

## Edge Cases

- A cart error arrives with a `2xx` status. Checking `response.ok` finds none of them.
- `consumeCartErrors()` clears the map. `codeErrorsNotification()` and `getErrorsCodes()` both consume, so calling both after one write shows the errors once and silently drops them for the second caller.
- `codeErrorsNotification()` ignores `level` entirely. A level `0` notice and a level `20` error both become `pushError`, except for the one key in the success list.
- That success list has exactly one entry: `promotion-discount-added` is pushed with `pushSuccess`. Every other key is an error.
- `getErrorsCodes()` filters the success keys out, so a successfully applied promotion is invisible to it.
- Both consumers bail out when `errors` is an array: `if (!errors || Array.isArray(errors)) return`. The schema allows that shape, and nothing in Shopware Frontends handles it.
- `resolveCartError` handles two keys specially and falls through to `params = { ...errorObject }` for everything else. A snippet expecting a `{name}` placeholder gets it only if the error object itself carried one.
- For `product-stock-reached` the resolver strips the key prefix to get a product id, then looks that line item up in the cart. When the name or `quantityInformation.maxPurchase` is missing it switches the key to `product-stock-reached-empty` and returns `null` params — so the snippet you render is not always the one you expected.
- For `shipping-method-blocked` the resolver reads `errorObject.message`, not `key`, and strips a `shipping-method-blocked-` prefix from it. Whatever remains becomes the `{name}` param.
- `resolveCartError` calls `useCart()` inside the resolver function rather than at composable setup. It works, but it means the resolver depends on a cart context being available at call time.
- The `message` on an error is a backend string, not a customer-facing one. Translate `errors.<messageKey>` and treat `message` as a last resort.

## Common Mistakes

- Do not treat a `2xx` cart response as an unqualified success.
- Do not call both `codeErrorsNotification()` and `getErrorsCodes()` for the same write.
- Do not render the raw `message` from a cart error.
- Do not assume every collected error is an error. Check for `promotion-discount-added`.
- Do not rely on `level` if you use `codeErrorsNotification()` — it does not read it.
- Do not handle the array form of `errors`. Nothing in the stack produces it, and both consumers skip it.
- Do not expect `{name}` and `{quantity}` placeholders to be filled for keys the resolver does not special-case.
- Do not confuse a rejected request with a cart error. Catch `ApiClientError` separately.
- Do not consume the errors in a component that may not be mounted. The map is cleared by whoever reads it first.

## Testing Checklist

- Adding more than the available stock returns `2xx` and produces a `product-stock-reached` entry.
- The stock error resolves to a message containing the product name and its maximum quantity.
- A stock error for a product that is not in the cart resolves to `product-stock-reached-empty` with no params.
- Applying a valid promotion code produces `promotion-discount-added` and renders as a success, not an error.
- Applying an unknown promotion code produces `promotion-not-found` and renders as an error.
- A second consumer after `getErrorsCodes()` receives no errors for the same write.
- Two writes in a row before any consumption produce one combined map.
- A rejected request shows a request-level error and adds nothing to the shared map.
- An `errors` payload in array form is skipped without throwing.

## Related Links

- [Cart documentation](../../getting-started/e-commerce/cart.html)
- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Error handling in the API client](../../packages/api-client.html#error-handling)
- [Composables reference](../../packages/composables/)
