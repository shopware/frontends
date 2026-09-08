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
    code: "_storeCart.value = data",
    state: "swCart",
    typeKeys: ['Schemas["Cart"]'],
  },
  {
    title: "Errors",
    action: "Collect cart errors",
    detail:
      "The same response can carry an errors map. useCart merges it into swCartErrors so a notification layer can consume it once, separately from the request that produced it.",
    code: "setCartErrors(data)",
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

<RecipeFlowDiagram label="Cart flow diagram" :steps="steps" />

Read the diagram from left to right:

1. The customer adds a product, changes a quantity or removes a line item in the UI.
2. `useAddToCart` or `useCartItem` delegates to the matching `useCart` method.
3. `useCart` calls one line item operation through `apiClient.invoke`, keeping the current `sw-context-token`.
4. The Store API recalculates the cart and returns it in full.
5. `useCart` replaces the shared `swCart` value and merges any `errors` into `swCartErrors`.
6. The UI reads `cartItems`, `count`, `subtotal` and `totalPrice` from composables instead of keeping its own copy.

You do not need to call `refreshCart()` after a write. Use it on the initial page load, or after the customer session changes, because `useUser().login()` and `logout()` already trigger it for you.

## Request Flow

| Step                 | Code                                                   | Store API                              | Type                                                                                                       |
| -------------------- | ------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Load the cart        | `refreshCart()`                                        | `GET /checkout/cart`                   | <SchemaTypeTooltip type-key='operations["readCart get /checkout/cart"]["response"]' />                     |
| Add a product        | `addProduct({ id, quantity })`                         | `POST /checkout/cart/line-item`        | <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["body"]' />           |
| Add a promotion code | `addPromotionCode(code)`                               | `POST /checkout/cart/line-item`        | <SchemaTypeTooltip type-key='operations["addLineItem post /checkout/cart/line-item"]["response"]' />       |
| Change a quantity    | `changeProductQuantity({ id, quantity })`              | `PATCH /checkout/cart/line-item`       | <SchemaTypeTooltip type-key='operations["updateLineItem patch /checkout/cart/line-item"]["body"]' />       |
| Remove a line item   | `removeItem(lineItem)`                                 | `POST /checkout/cart/line-item/delete` | <SchemaTypeTooltip type-key='operations["removeLineItem post /checkout/cart/line-item/delete"]["body"]' /> |
| Discard the cart     | `apiClient.invoke("deleteCart delete /checkout/cart")` | `DELETE /checkout/cart`                | <SchemaTypeTooltip type-key='operations["deleteCart delete /checkout/cart"]["response"]' />                |

`deleteCart delete /checkout/cart` has no composable wrapper. Call it through `apiClient.invoke` and then `refreshCart()`, because nothing updates the shared cart for you.

## Composables

- `useCart`: the shared cart. Exposes `cart`, `cartItems`, `count`, `isEmpty`, `subtotal`, `totalPrice`, `shippingCosts`, `appliedPromotionCodes`, `isVirtualCart`, and the write methods `addProduct`, `addProducts`, `addPromotionCode`, `changeProductQuantity`, `removeItem`, `removeItemById`, `refreshCart`.
- `useCartItem`: takes a `Ref<LineItem>` and derives everything one row needs — `itemQuantity`, `itemRegularPrice`, `itemSpecialPrice`, `itemTotalPrice`, `itemOptions`, `itemStock`, `isProduct`, `isPromotion`, `isRemovable`, `isStackable`, `isDigital` — plus `changeItemQuantity` and `removeItem` scoped to that row.
- `useAddToCart`: takes a `Ref<Product>` and owns the add-to-cart interaction: `quantity`, `addToCart`, `isInCart`, `count`, `getStock`, `getAvailableStock`.
- `useCartNotification`: consumes the collected cart errors once and pushes them as notifications via `codeErrorsNotification()`, or returns them with `getErrorsCodes()`.

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
```

`addProducts()` is typed with `AddLineItemBody["items"]`, so a custom bundle or a promotion entry uses the same generated shape as a plain product.

## Minimal Vue Example

```vue
<script setup lang="ts">
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
const { codeErrorsNotification } = useCartNotification();

const pendingItemId = ref("");
const cartError = ref("");

onMounted(() => {
  refreshCart();
});

const runCartAction = async (
  item: Schemas["LineItem"],
  action: () => Promise<Schemas["Cart"]>,
  message: string
) => {
  cartError.value = "";
  pendingItemId.value = item.id;

  try {
    await action();
    codeErrorsNotification();
  } catch {
    cartError.value = message;
  } finally {
    pendingItemId.value = "";
  }
};

const changeQuantity = (item: Schemas["LineItem"], quantity: number) =>
  runCartAction(
    item,
    () => changeProductQuantity({ id: item.id, quantity }),
    "The quantity could not be updated."
  );

const remove = (item: Schemas["LineItem"]) =>
  runCartAction(
    item,
    () => removeItemById(item.id),
    "The item could not be removed."
  );
</script>

<template>
  <p v-if="cartError">{{ cartError }}</p>

  <p v-if="isEmpty">Your cart is empty.</p>

  <div v-else>
    <ul>
      <li v-for="item in cartItems" :key="item.id">
        <span>{{ item.label }}</span>

        <input
          v-if="item.stackable"
          type="number"
          min="1"
          :value="item.quantity"
          :disabled="pendingItemId === item.id"
          @change="
            changeQuantity(
              item,
              Number(($event.target as HTMLInputElement).value)
            )
          "
        />
        <span v-else>{{ item.quantity }}</span>

        <span>{{ item.price?.totalPrice }}</span>

        <button
          v-if="item.removable"
          type="button"
          :disabled="pendingItemId === item.id"
          @click="remove(item)"
        >
          Remove
        </button>
      </li>
    </ul>

    <dl>
      <dt>Items</dt>
      <dd>{{ count }}</dd>
      <dt>Subtotal</dt>
      <dd>{{ subtotal }}</dd>
      <dt>Total</dt>
      <dd>{{ totalPrice }}</dd>
    </dl>
  </div>
</template>
```

`useCartItem` is not used here on purpose. It takes a `Ref<LineItem>` and must be called at the top level of a row component's setup, not inside a click handler in the list component.

## State And Session

The cart belongs to the sales channel session identified by the `sw-context-token` header, not to the customer. A guest has a cart, and logging in does not merge two carts in the frontend — the Store API resolves the cart for the token it receives.

`useCart` is wrapped in `createSharedComposable`, so every call in the application returns the same instance. The cart itself lives in the `swCart` context value and the collected errors in `swCartErrors`, which is what makes a mini cart in the header and a cart page stay in sync without any prop passing or store of your own.

Two values become correct only after a refresh you did not trigger from the cart: `useUser().login()` and `logout()` call `refreshCart()` internally, because customer-specific prices, promotions and rules change with the customer context.

## Edge Cases

- `count` only sums line items where `good` is `true`, so a promotion line item is visible in `cartItems` but does not raise the item count.
- `subtotal` reads `cart.price.positionPrice` and `totalPrice` reads `cart.price.totalPrice`. They differ once shipping costs or promotions apply — do not compute either from the line items yourself.
- A line item with `stackable: false` must not render a quantity input, and one with `removable: false` must not render a remove button. Both flags come from the cart response.
- Adding a product that is already in the cart increases the existing line item instead of creating a second row, so `addProduct` can change `count` by more than the quantity you sent.
- `consumeCartErrors()` clears `swCartErrors`. If two components call it for the same response, only the first one sees the errors.
- `isVirtualCart` is `false` for an empty cart and ignores promotion line items, so use it to decide whether a shipping step is needed, not whether the cart has content.
- `DELETE /checkout/cart` leaves the shared cart value untouched. Without a following `refreshCart()` the UI keeps rendering a cart the Store API has already discarded.

## Common Mistakes

- Do not keep a local copy of the cart or of the item count. Read them from `useCart()`.
- Do not call `refreshCart()` after every write. The write response already is the new cart.
- Do not treat a `2xx` response as success for the customer. Check the `errors` map, which reports stock limits, blocked shipping methods and invalid promotion codes with a `2xx` status.
- Do not use `deleteCart delete /checkout/cart` without refreshing afterwards.
- Do not compute totals in the template from `unitPrice * quantity`. Tax handling and promotions make that wrong in most configurations.
- Do not render the raw `message` of an API exception. Map cart errors through `useCartNotification` or `useCartErrorParamsResolver` instead.

## Testing Checklist

- Adding a product calls `addLineItem post /checkout/cart/line-item` once and updates `count` and `totalPrice`.
- Adding the same product twice results in one line item with the summed quantity.
- Changing a quantity calls `updateLineItem patch /checkout/cart/line-item` and recalculates `subtotal`.
- Removing a line item calls `removeLineItem post /checkout/cart/line-item/delete` and empties the cart when it was the last item.
- A promotion code adds a line item of type `promotion` that appears in `appliedPromotionCodes` but not in `count`.
- A response carrying an `errors` entry surfaces a notification and still renders the returned cart.
- A failing request shows a UI-level error and leaves the previously rendered cart intact.
- `isEmpty` is `true` before the first `refreshCart()` resolves.

## Related Links

- [Cart documentation](../../getting-started/e-commerce/cart.html)
- [Checkout documentation](../../getting-started/e-commerce/checkout.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
