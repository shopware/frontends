---
nav:
  position: 10
recipe:
  area: checkout
  status: stable
  frameworks:
    - vue
  composables:
    - useCart
    - useCartItem
    - useAddToCart
    - useCartNotification
    - useCartErrorParamsResolver
  helpers: []
  operations:
    - readCart get /checkout/cart
    - addLineItem post /checkout/cart/line-item
    - updateLineItem patch /checkout/cart/line-item
    - removeLineItem post /checkout/cart/line-item/delete
    - deleteCart delete /checkout/cart
  schemas:
    - Cart
    - LineItem
    - CartError
    - CartDelivery
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";
import CodeExample from "../../components/CodeExample.vue";

const steps = [
  {
    title: "UI",
    action: "Add a product",
    detail:
      "A product card calls useAddToCart with a product ref. The component owns the quantity input and the pending flag, never a copy of the cart.",
    code: "useAddToCart(product).addToCart()",
    state: "quantity, isInCart",
    typeKeys: ['Schemas["Product"]'],
  },
  {
    title: "Composable",
    action: "Send one line item",
    detail:
      "useAddToCart delegates to useCart().addProduct(), which wraps the id and quantity into a single items array entry of type product.",
    code: "addProduct({ id, quantity })",
    state: "none",
    typeKeys: [
      'operations["addLineItem post /checkout/cart/line-item"]["body"]',
    ],
  },
  {
    title: "Store API",
    action: "Return the whole cart",
    detail:
      "Every write operation on the cart responds with the complete recalculated cart, not with the line item that changed. Prices, deliveries and errors come back together.",
    code: 'apiClient.invoke("addLineItem post /checkout/cart/line-item")',
    state: "sw-context-token",
    typeKeys: [
      'operations["addLineItem post /checkout/cart/line-item"]["response"]',
    ],
  },
  {
    title: "Shared state",
    action: "Replace swCart",
    detail:
      "useCart writes the response into the shared swCart context value. No extra GET is needed after a write, which is why refreshCart is only for the initial load.",
    code: "const cart = await addProduct({ id, quantity })",
    state: "swCart",
    typeKeys: ['Schemas["Cart"]'],
  },
  {
    title: "Errors",
    action: "Collect cart errors",
    detail:
      "The same response can carry an errors map. useCart merges it into swCartErrors, and getErrorsCodes or codeErrorsNotification consumes it once, separately from the request that produced it.",
    code: "useCartNotification().getErrorsCodes()",
    state: "swCartErrors",
    typeKeys: ['Schemas["CartError"]'],
  },
  {
    title: "UI",
    action: "Render from the cart",
    detail:
      "Because useCart is a shared composable, a mini cart, a line item row and a totals block all read the same reactive cart without passing props.",
    code: "const { cartItems, count, totalPrice } = useCart()",
    state: "reactive UI",
    typeKeys: ['Schemas["LineItem"]'],
  },
];
</script>

# Cart

## Goal

Build a cart that adds products, changes quantities, removes line items and shows totals. The important part is not the list rendering, but that every cart write returns the whole recalculated cart, and that `useCart` is a shared composable holding one cart for the entire application.

## Shopware Flow

A cart write is not a local mutation. `POST /checkout/cart/line-item`, `PATCH /checkout/cart/line-item` and `POST /checkout/cart/line-item/delete` all respond with the complete cart, recalculated in the current sales channel context. Line item prices, delivery costs, promotions and the `errors` map are part of that response.

What the Store API does _not_ do is tell you which line item changed. There is no partial update to merge, so `useCart` simply replaces the shared cart value with the response. That is also why an extra `readCart get /checkout/cart` after a write is wasted work.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Cart flow diagram" :steps="steps" />

Read the diagram from left to right:

1. **UI** — the customer adds a product, changes a quantity or removes a line item.
2. **Composable** — `useAddToCart` or `useCartItem` delegates to the matching `useCart` method, which calls one line item operation through `apiClient.invoke` with the current `sw-context-token`.
3. **Store API** — the cart is recalculated in the current sales channel context and returned in full.
4. **Shared state** — `useCart` replaces the shared `swCart` value with that response.
5. **Errors** — any `errors` from the same response are merged into `swCartErrors`, for a notification layer to consume once.
6. **UI** — components read `cartItems`, `count`, `subtotal` and `totalPrice` from composables instead of keeping their own copy.

You do not need to call `refreshCart()` after a write. Use it on the initial page load, or after the customer session changes. `useUser().login()` and `logout()` do fire `refreshCart()` themselves, but they do not await it — only `register()` does — so code that renders prices straight after a session change should `await refreshCart()` itself.

## Request Flow

| Step                 | Code                                                   | Store API                              | Type                                                                                                       |
| -------------------- | ------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Load the cart        | `refreshCart()`                                        | `GET /checkout/cart`                   | <SchemaTypeTooltip type-key='operations["readCart get /checkout/cart"]["response"]' />                     |
| Add a product        | `addProduct({ id, quantity })`                         | `POST /checkout/cart/line-item`        | <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["body"]' />           |
| Add a promotion code | `addPromotionCode(code)`                               | `POST /checkout/cart/line-item`        | <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["body"]' />           |
| Change a quantity    | `changeProductQuantity({ id, quantity })`              | `PATCH /checkout/cart/line-item`       | <SchemaTypeTooltip type-key='operations["updateLineItem patch /checkout/cart/line-item"]["body"]' />       |
| Remove a line item   | `removeItem(lineItem)`                                 | `POST /checkout/cart/line-item/delete` | <SchemaTypeTooltip type-key='operations["removeLineItem post /checkout/cart/line-item/delete"]["body"]' /> |
| Discard the cart     | `apiClient.invoke("deleteCart delete /checkout/cart")` | `DELETE /checkout/cart`                | <SchemaTypeTooltip type-key='operations["deleteCart delete /checkout/cart"]["response"]' />                |

`deleteCart delete /checkout/cart` has no composable wrapper. Call it through `apiClient.invoke` and then `await refreshCart()`, because nothing updates the shared cart for you. Await it and handle a rejection: if the delete succeeds and the refresh fails, the shared cart still holds the discarded cart, which is the stale state described under [Edge Cases](#edge-cases).

If you drop down to `apiClient.invoke` for a bulk quantity update, note that `updateLineItem`'s `items` is a non-empty tuple (`[{ id, quantity }, ...{ id, quantity }[]]`), not a plain array — a mapped `LineItem[]` does not satisfy it. Build it as `[first, ...rest]` or assert the type.

## Composables

Pick by scope — how much of the cart the composable is about:

| Composable                   | Scope                | Reach for it when                                           |
| ---------------------------- | -------------------- | ----------------------------------------------------------- |
| `useCart`                    | the whole cart       | reading totals or writing any line item                     |
| `useCartItem`                | one line item        | building a row component                                    |
| `useAddToCart`               | one product          | building a product card or detail page                      |
| `useCartNotification`        | the collected errors | showing the customer what a `2xx` response complained about |
| `useCartErrorParamsResolver` | one `CartError`      | translating that error instead of printing it raw           |

`useCart` is the one you reach for most:

- **Read** — `cart`, `cartItems`, `count`, `isEmpty`, `subtotal`, `totalPrice`, `shippingCosts`, `appliedPromotionCodes`, `isVirtualCart`.
- **Write** — `addProduct`, `addProducts`, `addPromotionCode`, `changeProductQuantity`, `removeItem`, `removeItemById`, `refreshCart`.
- **Errors** — `consumeCartErrors()` returns the collected cart errors and clears them.

Four things the generated reference will not tell you:

- `useCartItem` takes a `Ref<LineItem>` and derives the whole row from it — `itemTotalPrice`, `itemStock`, `itemImageThumbnailUrl`, `isStackable`, `isRemovable` and the rest — so a row component needs no props beyond that one ref.
- `useAddToCart` takes a `Ref<Product | undefined>`. The `undefined` is deliberate: it lets you call the composable at the top level of setup while the product is still loading.
- `useCartNotification` gives you two ways to handle the same errors — `codeErrorsNotification()` pushes them as notifications, `getErrorsCodes()` returns them as `CartError[]`. Both call `consumeCartErrors()`, so the first one you call clears them for the other. Pick one per response.
- `useCartErrorParamsResolver` returns `resolveCartError(error)`, which maps a `CartError` to a `messageKey` and `params` for your translation layer.

The [composables reference](../../packages/composables/) is generated from source and lists every member.

## Types

Use generated Store API types when you need to type line item payloads, cart responses, or lower-level API client calls:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readCart get /checkout/cart"]["response"]' />
  <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["body"]' />
  <SchemaTypeTooltip type-key='operations["removeLineItem post /checkout/cart/line-item/delete"]["body"]' />
  <SchemaTypeTooltip type-key='Schemas["Cart"]' />
  <SchemaTypeTooltip type-key='Schemas["LineItem"]' />
  <SchemaTypeTooltip type-key='Schemas["CartError"]' />
  <SchemaTypeTooltip type-key='Schemas["CartDelivery"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type CartResponse = operations["readCart get /checkout/cart"]["response"];
type AddLineItemBody =
  operations["addLineItem post /checkout/cart/line-item"]["body"];
type CartItems = AddLineItemBody["items"];
type Cart = Schemas["Cart"];
type LineItem = Schemas["LineItem"];
type CartError = Schemas["CartError"];
type CartDelivery = Schemas["CartDelivery"];

// Cart["errors"] is a union: either a CartError[] or a keyed map whose values
// carry an extra `code` and a widened `level`. Narrow before use, or take the
// already-narrowed CartError[] from useCartNotification().getErrorsCodes().
type CartErrors = NonNullable<Schemas["Cart"]["errors"]>;
```

`addProducts()` is typed with `AddLineItemBody["items"]`, so one array carries products, custom bundles and promotions together — but `items` is a union discriminated on `type`. A `"promotion"` entry takes `referencedId` (the code) and leaves `id` and `quantity` optional; every other `type` requires `id` and `quantity`.

## Minimal Vue Example

<CodeExample title="Minimal cart page">

```vue
<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Schemas } from "#shopware";

const {
  cartItems,
  count,
  subtotal,
  totalPrice,
  isEmpty,
  refreshCart,
  changeProductQuantity,
  removeItemById,
} = useCart();
const { getErrorsCodes } = useCartNotification();

// Start as loading so the first render shows the loading state instead of
// flashing "Your cart is empty." before the cart has arrived.
const isLoading = ref(true);
const pendingItemId = ref("");
const writeError = ref("");
const cartErrors = ref<Schemas["CartError"][]>([]);

// Only one write may be in flight: every write returns the whole recalculated
// cart, so two in parallel race and the slower response overwrites the faster.
const isWriting = computed(() => pendingItemId.value !== "");

// Client-side only. useCart is a shared composable whose state is module-scoped
// on the server, so fetching the cart during SSR would leak it between requests.
onMounted(async () => {
  try {
    await refreshCart();
  } catch (error) {
    console.error(error);
    writeError.value = "Your cart could not be loaded. Please try again.";
  } finally {
    // Errors that arrived with the initial cart belong to the load, not to the
    // customer's next action.
    cartErrors.value = getErrorsCodes();
    isLoading.value = false;
  }
});

const runCartWrite = async (
  item: Schemas["LineItem"],
  write: () => Promise<Schemas["Cart"]>,
  fallbackMessage: string
) => {
  if (isWriting.value) return;

  writeError.value = "";
  pendingItemId.value = item.id;

  try {
    await write();
  } catch (error) {
    // Keep the real error for the developer, show the customer a mapped one.
    console.error(error);
    writeError.value =
      error instanceof ApiClientError && error.status === 403
        ? "Your session has expired. Please sign in again."
        : fallbackMessage;
  } finally {
    // Consume on both paths: a 2xx response can carry errors, and a rejected
    // write must not strand earlier ones in the shared state.
    cartErrors.value = getErrorsCodes();
    pendingItemId.value = "";
  }
};

const changeLineItemQuantity = (item: Schemas["LineItem"], value: string) => {
  // min="1" constrains the stepper and validation, not the value you read here:
  // a cleared field yields "" and Number("") is 0.
  const quantity = Number.parseInt(value, 10);
  if (!Number.isInteger(quantity) || quantity < 1) return;
  if (quantity === item.quantity) return;

  return runCartWrite(
    item,
    () => changeProductQuantity({ id: item.id, quantity }),
    "The quantity could not be updated."
  );
};

const removeLineItem = (item: Schemas["LineItem"]) =>
  runCartWrite(
    item,
    () => removeItemById(item.id),
    "The item could not be removed."
  );
</script>

<template>
  <section>
    <h1>Cart</h1>

    <!-- role="alert" so a failed write is announced: the control the customer
         used has just been re-enabled, so focus is nowhere near this message. -->
    <p v-if="writeError" role="alert">{{ writeError }}</p>

    <ul v-if="cartErrors.length" role="alert">
      <li v-for="error in cartErrors" :key="error.key">{{ error.message }}</li>
    </ul>

    <p v-if="isLoading">Loading your cart…</p>

    <p v-else-if="isEmpty">Your cart is empty.</p>

    <div v-else>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          <h2>{{ item.label }}</h2>

          <!-- aria-disabled rather than disabled: a disabled control cannot
               hold focus, so a keyboard user is thrown back to the top of the
               document mid-interaction. The handler enforces the guard. -->
          <label v-if="item.stackable">
            <span>Quantity for {{ item.label }}</span>
            <input
              type="number"
              min="1"
              :value="item.quantity"
              :aria-disabled="isWriting"
              :aria-busy="pendingItemId === item.id"
              @change="
                changeLineItemQuantity(
                  item,
                  ($event.target as HTMLInputElement).value
                )
              "
            />
          </label>
          <span v-else>Quantity: {{ item.quantity }}</span>

          <span>Total: {{ item.price?.totalPrice }}</span>

          <button
            v-if="item.removable"
            type="button"
            :aria-label="`Remove ${item.label} from cart`"
            :aria-disabled="isWriting"
            :aria-busy="pendingItemId === item.id"
            @click="removeLineItem(item)"
          >
            Remove
          </button>
        </li>
      </ul>

      <dl aria-live="polite">
        <dt>Items</dt>
        <dd>{{ count }}</dd>
        <dt>Subtotal</dt>
        <dd>{{ subtotal }}</dd>
        <dt>Total</dt>
        <dd>{{ totalPrice }}</dd>
      </dl>
    </div>
  </section>
</template>
```

</CodeExample>

`useCartItem` is not used here on purpose. It takes a `Ref<LineItem>` and must be called at the top level of a row component's setup, not inside a click handler in the list component. Extracting each `<li>` into its own row component is the natural next step, and it is what lets a row own its pending state.

The errors are rendered inline rather than pushed through `codeErrorsNotification()`, so the example stands on its own. `codeErrorsNotification()` only writes into `useNotifications()` state — it renders nothing by itself, so it needs a notification outlet mounted somewhere above it, as `vue-starter-template` does with `<LayoutNotifications />` in its layouts.

The example owns its initial load. `vue-starter-template` already calls `refreshCart()` once in `app.vue`, so inside that template you should drop the `onMounted` block here rather than fetching the cart twice on hydration.

## State And Session

The cart belongs to the sales channel session identified by the `sw-context-token` header, not to the customer. A guest has a cart, and logging in does not merge two carts in the frontend — the Store API resolves the cart for the token it receives.

`useCart` is wrapped in `createSharedComposable`, so every call in the application returns the same instance. The cart itself lives in the `swCart` context value and the collected errors in `swCartErrors`, which is what makes a mini cart in the header and a cart page stay in sync without any prop passing or store of your own.

That shared instance is module-scoped, and on the server nothing tears it down between requests — component scopes are never stopped after a render. **Never fetch the cart during SSR.** Load it from `onMounted` (or behind `import.meta.client`), as the example does; a `useAsyncData` wrapper around `refreshCart()` would write one customer's cart into process-global state, and under a template's `isr` route rules that HTML is then cached and served to everyone.

Customer-specific prices, promotions and rules change with the customer context, so the cart has to be re-read when the session changes. `useUser().login()` and `logout()` call `refreshCart()` internally — but neither awaits it, and only `register()` does. Right after `await login()` resolves, the shared cart is still the pre-login guest cart for one more round trip, so `await refreshCart()` yourself if you render prices immediately after a session change.

## Edge Cases

- `count` only sums line items where `good` is `true`, so a promotion line item is visible in `cartItems` but does not raise the item count.
- `subtotal` reads `cart.price.positionPrice` and `totalPrice` reads `cart.price.totalPrice`. They differ once shipping costs or promotions apply — do not compute either from the line items yourself.
- A line item with `stackable: false` must not render a quantity input, and one with `removable: false` must not render a remove button. Both flags come from the cart response.
- Adding a product that is already in the cart increases the existing line item instead of creating a second one, so `addProduct` can change `count` by more than the quantity you sent.
- `consumeCartErrors()` clears `swCartErrors`. If two components call it for the same response, only the first one sees the errors — and `codeErrorsNotification()` and `getErrorsCodes()` both call it, so calling one after the other for the same response leaves the second empty.
- `Cart["errors"]` is a union of `CartError[]` and a keyed map. `codeErrorsNotification()` returns early on the array branch and pushes nothing, so do not rely on it as your only path — `getErrorsCodes()` normalises both.
- Cart errors are merged into `swCartErrors` and never cleared by a later clean response. Consume them after the initial `refreshCart()` too, or the first write will surface load-time errors as if they belonged to that write.
- `isVirtualCart` is `false` for an empty cart and ignores promotion line items, so use it to decide whether a shipping step is needed, not whether the cart has content.
- `DELETE /checkout/cart` leaves the shared cart value untouched. Without a following `refreshCart()` the UI keeps rendering a cart the Store API has already discarded — and the same stale state appears if the delete succeeds but the refresh rejects, so await the refresh and handle its failure.

## Common Mistakes

- Do not keep a local copy of the cart or of the item count. Read them from `useCart()`.
- Do not call `refreshCart()` after every write. The write response already is the new cart.
- Do not treat a `2xx` response as success for the customer. Check the `errors` map, which reports stock limits, blocked shipping methods and invalid promotion codes with a `2xx` status.
- Do not use `deleteCart delete /checkout/cart` without refreshing afterwards.
- Do not compute totals in the template from `unitPrice * quantity`. Tax handling and promotions make that wrong in most configurations.
- Do not let two cart writes run in parallel. Each one returns the whole cart, so the slower response overwrites the faster one and the UI settles on a cart that is missing a change.
- Do not trust `min="1"` on a quantity input. It constrains the stepper and validation, not the value you read — a cleared field gives you `Number("") === 0`.
- Do not render the raw `message` of an API exception. Map cart errors through `useCartNotification` or `useCartErrorParamsResolver` instead.

## Testing Checklist

- Adding a product calls `addLineItem post /checkout/cart/line-item` once and updates `count` and `totalPrice`.
- Adding the same product twice results in one line item with the summed quantity.
- Changing a quantity calls `updateLineItem patch /checkout/cart/line-item` and recalculates `subtotal`.
- Removing a line item calls `removeLineItem post /checkout/cart/line-item/delete` and empties the cart when it was the last item.
- A promotion code adds a line item of type `promotion` that appears in `appliedPromotionCodes` but not in `count`.
- A response carrying an `errors` entry surfaces those errors to the customer and still renders the returned cart.
- A failing request shows a UI-level error and leaves the previously rendered cart intact.
- The first render shows a loading state, not the empty-cart message: `isEmpty` is `true` before the first `refreshCart()` resolves.
- A rejected initial `refreshCart()` shows an error instead of an empty cart.
- Starting a second write while one is in flight is refused rather than queued.

## Related Links

- [Work with the cart](../../guides/e-commerce/cart.html)
- [Checkout documentation](../../guides/e-commerce/checkout.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
