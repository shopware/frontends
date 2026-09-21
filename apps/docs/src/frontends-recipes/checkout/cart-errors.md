---
nav:
  position: 20
recipe:
  area: checkout
  status: stable
  frameworks:
    - vue
  composables:
    - useCartNotification
    - useCartErrorParamsResolver
    - useCart
    - useNotifications
  helpers: []
  operations:
    - readCart get /checkout/cart
    - addLineItem post /checkout/cart/line-item
    - updateLineItem patch /checkout/cart/line-item
    - removeLineItem post /checkout/cart/line-item/delete
  schemas:
    - Cart
    - CartError
    - LineItem
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "Store API",
    action: "Succeed and complain",
    detail:
      "A cart write returns 200 with the recalculated cart and an errors field. The status code says the request worked, not that the customer got what they asked for.",
    code: "const cart = await addProduct({ id, quantity: 99 })",
    state: "sw-context-token",
    typeKeys: [
      'operations["addLineItem post /checkout/cart/line-item"]["response"]',
    ],
  },
  {
    title: "Composable",
    action: "Collect, do not render",
    detail:
      "useCart merges the errors map into swCartErrors after a write that carries one. It is deliberately separate from the cart, so the request that produced it does not have to render it.",
    code: "// internal: setCartErrors(cart)",
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
    title: "Composable",
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
      "The messageKey maps to a snippet under errors.*, and the params fill its placeholders. The message on the error is a backend string, not the one to show.",
    code: 't(`errors.${messageKey}`, params)',
    state: "translated string",
    typeKeys: [],
  },
  {
    title: "UI",
    action: "Notify the customer",
    detail:
      "pushError renders the translated string. The ready-made consumer skips this whole path: it pushes the untranslated message straight from the API.",
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

`useCart` therefore treats them as a second output. Every write merges the errors map into a shared `swCartErrors` value separate from the cart itself. That separation is what lets a notification layer consume them once, somewhere else on the page, without the component that issued the request having to know about them.

<RecipeFlowDiagram label="Cart errors flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A cart write returns `200` with the recalculated cart and an `errors` field.
2. `useCart` merges that field into `swCartErrors` with `Object.assign`.
3. `getErrorsCodes()` or `codeErrorsNotification()` consumes the map, clearing it in the process.
4. `resolveCartError(error)` produces a `messageKey` and a `params` object for one entry.
5. Your i18n layer translates `errors.<messageKey>` with those params.
6. The UI reads the notifications from `useNotifications` instead of keeping its own copy.

You do not need to check the HTTP status to find these. A rejected request is a different thing entirely: an HTTP error throws an `ApiClientError`, while timeouts and other transport failures can throw other error types; none reaches `swCartErrors`.

## Request Flow

| Step                      | Code                            | Store API                              | Type                                                                                                        |
| ------------------------- | ------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Read the cart             | `refreshCart()`                 | `GET /checkout/cart`                   | <SchemaTypeTooltip type-key='operations["readCart get /checkout/cart"]["response"]' />                       |
| Add and collect errors    | `addProduct({ id, quantity })`  | `POST /checkout/cart/line-item`        | <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["response"]' />         |
| Apply a promotion code    | `addPromotionCode(code)`        | `POST /checkout/cart/line-item`        | <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["response"]' />         |
| Update and collect errors | `changeProductQuantity(params)` | `PATCH /checkout/cart/line-item`       | <SchemaTypeTooltip type-key='operations["updateLineItem patch /checkout/cart/line-item"]["response"]' />     |
| Remove and collect errors | `removeItemById(id)`            | `POST /checkout/cart/line-item/delete` | <SchemaTypeTooltip type-key='operations["removeLineItem post /checkout/cart/line-item/delete"]["response"]' /> |
| Read the errors field     | `cart.errors`                   | any of the above                       | <SchemaTypeTooltip type-key='Schemas["Cart"]' />                                                             |
| Consume the collected map | `getErrorsCodes()`              | none                                   | <SchemaTypeTooltip type-key='Schemas["CartError"]' />                                                        |

Every row in the `Store API` column is a cart operation you already call for another reason. There is no request in this recipe that exists only for errors. A promotion code is not a special endpoint either — `addPromotionCode` posts to the line item route with `type: "promotion"`, which is why promotion feedback arrives as a cart error rather than as a response of its own.

## Composables

Pick by what you are holding — the collected map, one error, or the notification list:

| Composable                   | Scope                | Reach for it when                                                 |
| ---------------------------- | -------------------- | ----------------------------------------------------------------- |
| `useCart`                    | the whole cart       | writing line items, and reading the cart the resolver looks into   |
| `useCartNotification`        | the collected errors | consuming everything one write complained about                    |
| `useCartErrorParamsResolver` | one `CartError`      | turning that error into a translatable key and params              |
| `useNotifications`           | the toast list       | rendering the result, or pushing anything else the customer sees   |

`useCartNotification` is the one this recipe is really about. It has exactly two members, and they are alternatives, not a pipeline:

- **Consume and render** — `codeErrorsNotification()` consumes the map and pushes every entry itself, using `pushSuccess` for `promotion-discount-added` and `pushError` for everything else.
- **Consume and return** — `getErrorsCodes()` consumes the map and returns `Schemas["CartError"][]` with those same success codes **dropped**, leaving the rendering to you.

It borrows exactly three members of its own: `consumeCartErrors` from `useCart`, and `pushError` and `pushSuccess` from `useNotifications`. The wider surface this recipe touches lives elsewhere — `addProduct`, `addPromotionCode`, `changeProductQuantity`, `removeItemById`, `refreshCart`, `cart`, `cartItems`, `count` and `appliedPromotionCodes` on `useCart`; `resolveCartError` on `useCartErrorParamsResolver`; the remaining `push*` helpers and the `notifications` list on `useNotifications`.

Six things the generated reference will not tell you:

- `codeErrorsNotification()` pushes `error.message` — the raw, untranslated string from the backend. It never touches `resolveCartError` or your i18n layer. If your storefront is localised, this is the wrong consumer: use `getErrorsCodes()` and translate the `messageKey` yourself.
- `codeErrorsNotification()` also ignores `level`. A level `0` notice and a level `20` error both become `pushError`, with `promotion-discount-added` as the single exception.
- Both methods call `consumeCartErrors()`, so the first one you call clears the map for the other. Pick one per response.
- `setCartErrors` — the function that fills the map — is **internal to `useCart`** and not part of its public return. You cannot call it, and you cannot reset the map except by consuming it.
- `setCartErrors` also merges only when the response actually has errors. An error-free response leaves whatever was already collected in place, so the map is not a view of the last write.
- `resolveCartError(error)` calls `useCart()` inside the resolver function rather than at composable setup, so it needs a cart context to be available at call time, not just at setup time.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

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

`Schemas["CartError"]["level"]` is an enum of `0` (notice), `10` (warning) and `20` (error), but that union is only on the array-form type. The map form declares `level` as a plain `number`, and the composables reach map values through a cast — so do not lean on the union for exhaustiveness. None of the three values means success either: a positive outcome is signalled by the `messageKey`, not by the level.

## Minimal Vue Example

<CodeExample title="Add to cart with translated cart errors">

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

const { addProduct, appliedPromotionCodes, cartItems, count } = useCart();
const { getErrorsCodes } = useCartNotification();
const { resolveCartError } = useCartErrorParamsResolver();
const { pushError } = useNotifications();
const { t, te } = useI18n();

const isAdding = ref(false);
const writeError = ref("");

const consumeAndPushCartErrors = () => {
  for (const error of getErrorsCodes()) {
    const { messageKey, params } = resolveCartError(error);
    const snippet = `errors.${messageKey}`;

    pushError(
      te(snippet) ? t(snippet, params ?? {}) : t("errors.message-default"),
    );
  }
};

const addToCart = async (productId: string, quantity: number) => {
  if (isAdding.value) return;

  writeError.value = "";
  isAdding.value = true;

  try {
    await addProduct({ id: productId, quantity });
  } catch (error) {
    console.error(error);

    writeError.value =
      error instanceof ApiClientError
        ? t("errors.addToCartError")
        : t("errors.message-default");
  } finally {
    consumeAndPushCartErrors();
    isAdding.value = false;
  }
};
</script>

<template>
  <p v-if="writeError" role="alert">{{ writeError }}</p>

  <p role="status">{{ count }} items in your cart</p>

  <h2>Cart</h2>

  <ul>
    <li v-for="item in cartItems" :key="item.id">
      {{ item.label }} — quantity {{ item.quantity }}
    </li>
  </ul>

  <template v-if="appliedPromotionCodes.length">
    <h2>Applied promotions</h2>

    <ul>
      <li v-for="promotion in appliedPromotionCodes" :key="promotion.id">
        {{ promotion.label }}
      </li>
    </ul>
  </template>

  <button
    type="button"
    :aria-disabled="isAdding"
    :aria-busy="isAdding"
    @click="addToCart('a-product-id', 99)"
  >
    {{ isAdding ? "Adding…" : "Add 99 to the cart" }}
  </button>
</template>
```

</CodeExample>

The example consumes the shared map and never reads `cart.errors` off the write response. Both are views of the same data, so pick one: the response is per-request, the shared map is cumulative across writes and is what `useCartNotification` reads.

`getErrorsCodes()` consumes and clears that map, so exactly one place in your app may call it per write — a second consumer for the same response gets nothing. And because the map is cumulative, what it hands back is not necessarily this write's doing: an entry collected by the startup `refreshCart()`, or by an earlier write nobody consumed, arrives here too. If your app collects errors before the customer reaches this component, consume them there as well rather than letting them surface against an unrelated add.

The consume sits in `finally`, not in the `try`, for two reasons. A rejected write contributes no errors of its own — it never reaches `setCartErrors` — but it must not strand entries an earlier write left behind. And keeping it out of the `try` means a failure while rendering a message is never reported to the customer as a failed add.

The `catch` binds the error, logs it, and narrows on `ApiClientError`, because a rejected request and a bug in your own code are not the same event and should not reach the customer as the same message. A bare `catch {}` makes that distinction impossible and loses the stack with it. `te()` guards the snippet lookup: `resolveCartError` forwards every backend `messageKey` unchanged through its catch-all branch, and without the guard an unmapped key renders the literal string `errors.<messageKey>` into the customer's notification.

`aria-disabled` rather than `disabled` on the button: a disabled control cannot hold focus, so a keyboard customer pressing it would be thrown back to the top of the document mid-interaction. `aria-disabled` does not block activation, which is why the `if (isAdding.value) return;` guard at the top of the handler is load-bearing rather than decorative.

Finally, the example confirms an applied promotion from `appliedPromotionCodes` rather than from the errors map, because `getErrorsCodes()` drops `promotion-discount-added` on purpose. The line item is the durable fact; the error entry is a one-off notice you may never see.

## State And Session

`swCartErrors` is a shared context value alongside `swCart`, provided through `useContext`'s `provide`/`inject`. `createSharedComposable` dedupes `useCart` on top of that, but only on the client — on the server it is a passthrough, so SSR sharing rests on the provide chain alone. Either way the value lives in the Vue app instance, not on the server session, so a full page reload starts from an empty map even though the cart behind the `sw-context-token` is unchanged.

Within one page life it accumulates. Every write merges that response's errors into whatever is already there with `Object.assign`, keyed by error key, so two writes in a row produce one combined map. The merge is skipped when a response has no errors, which means a clean write does **not** clear a stale entry from an earlier one — only consuming does.

`consumeCartErrors()` is destructive: it deep-clones the value through `JSON.parse(JSON.stringify(...))`, sets the shared value to `null`, and returns the clone. Both `codeErrorsNotification()` and `getErrorsCodes()` call it, so they cannot be used together for the same response — the second one gets nothing.

Errors are app state, not component state. A mini cart, a cart page and a checkout step all read the same map — and whichever one consumes first wins.

## Edge Cases

- A cart error arrives with a `2xx` status. Checking `response.ok` finds none of them.
- A timed out write has an unknown outcome. `isTimeoutError` from `@shopware/api-client` identifies it, and the request may already have reached the API, so the line item may exist even though the customer saw an error. Call `refreshCart()` before letting them retry, rather than repeating the write blind.
- `consumeCartErrors()` clears the map. `codeErrorsNotification()` and `getErrorsCodes()` both consume, so calling both after one write shows the errors once and silently drops them for the second caller.
- A response without errors does not reset the map. An entry collected by an earlier write survives until something consumes it, so a stale stock warning can surface after an unrelated successful write.
- `refreshCart(newCart)` returns early when you pass a cart in, skipping error collection entirely. Only the argument-less `refreshCart()` issues the request and collects.
- `codeErrorsNotification()` ignores `level` entirely, and pushes the backend's `message` verbatim.
- The success list has exactly one entry: `promotion-discount-added` is pushed with `pushSuccess`. Every other key is an error.
- `getErrorsCodes()` filters that key out, so a successfully applied promotion is invisible to it. Read `appliedPromotionCodes` instead.
- Both consumers bail out when `errors` is an array — `codeErrorsNotification()` returns nothing, `getErrorsCodes()` returns `[]`. That guard only fires on a raw response you read yourself: through `useCart` the `Object.assign` merge turns `[error]` into `{ "0": error }` first, so the map form is the only shape the composables ever see.
- `resolveCartError` handles two keys specially and falls through to `params = { ...errorObject }` for everything else, which yields only `messageKey`, `key`, `message` and `level` on the type you are holding, plus `code` at runtime — `getErrorsCodes()` is declared to return `Schemas["CartError"]`, the array-form element, which has no `code`. The snippet `errors.promotion-not-found` expects a `{promotionCode}` placeholder that nothing in that object supplies, so it renders unfilled — the same trap applies to any snippet whose placeholder is not one of those names.
- For `product-stock-reached` the resolver strips the key prefix to get a product id, then looks that line item up in the cart. When the name or `quantityInformation.maxPurchase` is falsy it switches the key to `product-stock-reached-empty` and returns `null` params — so the snippet you render is not always the one you expected.
- For `shipping-method-blocked` the resolver reads `errorObject.message`, not `key`, and strips a `shipping-method-blocked-` prefix from it. Whatever remains becomes the `{name}` param.
- `pushError` only writes into `useNotifications` state; it renders nothing. `useNotifications` uses plain `provide`/`inject`, so a component whose ancestors never called it gets its own detached list and the notification reaches no one. Mount a notification outlet above the component, as `vue-starter-template` does with `<LayoutNotifications />` in its layouts.
- The `message` on an error is a backend string, not a customer-facing one. Translate `errors.<messageKey>` and treat `message` as a last resort.

## Common Mistakes

- Do not treat a `2xx` cart response as an unqualified success.
- Do not call both `codeErrorsNotification()` and `getErrorsCodes()` for the same write.
- Do not reach for `codeErrorsNotification()` in a localised storefront — it renders the untranslated backend `message`.
- Do not render the raw `message` from a cart error.
- Do not assume the map describes the last write. It also holds anything an earlier write left behind.
- Do not read `level` to decide whether something is good news. `0` is a notice, not a success.
- Do not detect an applied promotion through the errors map. Use `appliedPromotionCodes`.
- Do not handle the array form of `errors` behind `useCart`. The `Object.assign` merge normalises it to a map first, so nothing the composables hand you is ever an array.
- Do not translate a `messageKey` without checking the snippet exists. An unmapped key renders as the literal string `errors.<messageKey>` in the customer's notification.
- Do not expect `{name}` and `{quantity}` placeholders to be filled for keys the resolver does not special-case.
- Do not confuse a rejected request with a cart error. Catch `ApiClientError` separately, and do not assume it is the only thing a cart write can throw — a timeout is not an `ApiClientError`.
- Do not consume the errors in a component that may not be mounted. The map is cleared by whoever reads it first.

## Testing Checklist

- Adding more than the available stock returns `2xx` and produces a `product-stock-reached` entry.
- The stock error resolves to a message containing the product name and its maximum quantity.
- A stock error for a product that is not in the cart resolves to `product-stock-reached-empty` with no params.
- Applying a valid promotion code with `addPromotionCode` adds a line item to `appliedPromotionCodes`, and `getErrorsCodes()` returns nothing for it.
- Applying an unknown promotion code produces `promotion-not-found` and renders as an error.
- A second consumer after `getErrorsCodes()` receives no errors for the same write.
- Two writes in a row before any consumption produce one combined map.
- An error collected by one write is still present after a later error-free write, until it is consumed.
- `refreshCart(someCart)` collects no errors, while `refreshCart()` does.
- A rejected request shows a request-level error and adds nothing to the shared map.
- A timed out write is reported as a generic failure, not as `errors.addToCartError`, and a following `refreshCart()` shows whether the line item was added anyway.
- An `errors` payload in array form, handed to a consumer directly, is skipped without throwing — through `useCart` it is normalised to a map first, so that guard cannot be reached from a cart write.
- An unmapped `messageKey` falls back to a generic message instead of rendering the raw `errors.<messageKey>` string.

## Related Links

- [Cart recipe](cart.html)
- [Work with the cart](../../guides/e-commerce/cart.html)
- [Checkout documentation](../../guides/e-commerce/checkout.html)
- [Error handling in the API client](../../packages/api-client.html#error-handling)
- [Composables reference](../../packages/composables/)
