---
nav:
  position: 30
recipe:
  area: account
  status: stable
  frameworks:
    - vue
  composables:
    - useWishlist
    - useProductWishlist
    - useSyncWishlist
    - useUser
  helpers:
    - getTranslatedProperty
  operations:
    - readCustomerWishlist post /customer/wishlist
    - addProductOnWishlist post /customer/wishlist/add/{productId}
    - deleteProductOnWishlist delete /customer/wishlist/delete/{productId}
    - mergeProductOnWishlist post /customer/wishlist/merge
  schemas:
    - Product
    - Criteria
    - WishlistLoadRouteResponse
---

<script setup>
import RecipeFlowDiagram from "../../components/RecipeFlowDiagram.vue";
import SchemaTypeTooltip from "../../components/SchemaTypeTooltip.vue";

const steps = [
  {
    title: "UI",
    action: "Toggle a product",
    detail:
      "A product card calls useProductWishlist with the product id. The component owns the pending state of the button and nothing else.",
    code: "useProductWishlist(productId).addToWishlist()",
    state: "isInWishlist",
    typeKeys: ['Schemas["Product"]'],
  },
  {
    title: "Composable",
    action: "Write, then reload",
    detail:
      "useProductWishlist sends the add or remove request and then reloads the wishlist. The write operations return no wishlist data, so the reload is what refreshes the state.",
    code: "await addToWishlistSync(id); await getWishlistProducts()",
    state: "customer wishlist",
    typeKeys: [],
  },
  {
    title: "Store API",
    action: "Persist on the customer",
    detail:
      "The add operation takes the product id as a path parameter and no body. The Store API resolves the customer from the context token.",
    code: 'apiClient.invoke("addProductOnWishlist post /customer/wishlist/add/{productId}")',
    state: "sw-context-token",
    typeKeys: [
      'operations["addProductOnWishlist post /customer/wishlist/add/{productId}"]["response"]',
    ],
  },
  {
    title: "Store API",
    action: "Read one page",
    detail:
      "The wishlist route is a product search. useSyncWishlist posts your criteria with total-count-mode set to exact, so the response carries a real total next to the current page of products.",
    code: 'apiClient.invoke("readCustomerWishlist post /customer/wishlist")',
    state: "products.elements, total, page, limit",
    typeKeys: [
      'operations["readCustomerWishlist post /customer/wishlist"]["body"]',
      'operations["readCustomerWishlist post /customer/wishlist"]["response"]',
    ],
  },
  {
    title: "Shared state",
    action: "Fill the module refs",
    detail:
      "useSyncWishlist stores the response in refs declared at module level, so every component that reads the wishlist sees the same page of products.",
    code: "items + products + count + currentPage + limit",
    state: "one page of the wishlist",
    typeKeys: ['Schemas["WishlistLoadRouteResponse"]'],
  },
  {
    title: "UI",
    action: "Render the wishlist",
    detail:
      "The UI reads products, count, and the pagination values from useWishlist instead of keeping its own copy.",
    code: "products + count + currentPage + totalPagesCount",
    state: "reactive UI",
    typeKeys: ['Schemas["Product"]'],
  },
];
</script>

# Wishlist

## Goal

Build a wishlist for a logged-in customer: a toggle on a product and a paginated wishlist page. The important part is not the toggle, but that the wishlist route is a paginated product search, so `items` and `products` only ever describe the page you last loaded.

## Shopware Flow

The wishlist routes are customer routes. `addProductOnWishlist post /customer/wishlist/add/{productId}` and `deleteProductOnWishlist delete /customer/wishlist/delete/{productId}` take the product id as a path parameter, send no body, and return no wishlist data. They only write.

Everything you render comes from `readCustomerWishlist post /customer/wishlist`. That route behaves like a product listing: you post a `Criteria`, and the response contains one page of products together with `total`, `page`, and `limit`. `useSyncWishlist` always merges `"total-count-mode": "exact"` into your criteria, so the total is a real count and not an estimate.

Hover a type chip to inspect fields generated from the current Store API schema.

<RecipeFlowDiagram label="Wishlist flow diagram" :steps="steps" />

Read the diagram from left to right:

1. A customer toggles the wishlist button on a product.
2. `useProductWishlist` sends the add or remove request, then reloads the wishlist because the write returns nothing to render.
3. The Store API persists the product on the customer identified by `sw-context-token`.
4. `useSyncWishlist` posts a criteria to `readCustomerWishlist post /customer/wishlist` and receives one page of products.
5. The response fills refs declared at module level, so every component reading the wishlist sees the same page.
6. The UI reads `products`, `count`, and the pagination values from composables instead of keeping its own copy.

You do not call `useSyncWishlist` directly. `useWishlist` drives the wishlist page and `useProductWishlist` drives a single product toggle, and both delegate to it once the customer is logged in.

## Request Flow

| Step                  | Code                            | Store API                                      | Type                                                                                                                            |
| --------------------- | ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Save a product        | `addToWishlist()`               | `POST /customer/wishlist/add/{productId}`      | <SchemaTypeTooltip type-key='operations["addProductOnWishlist post /customer/wishlist/add/{productId}"]["response"]' />         |
| Remove a product      | `removeFromWishlist()`          | `DELETE /customer/wishlist/delete/{productId}` | <SchemaTypeTooltip type-key='operations["deleteProductOnWishlist delete /customer/wishlist/delete/{productId}"]["response"]' /> |
| Load a wishlist page  | `getWishlistProducts(criteria)` | `POST /customer/wishlist`                      | <SchemaTypeTooltip type-key='operations["readCustomerWishlist post /customer/wishlist"]["body"]' />                             |
| Read the loaded page  | `products`, `count`, `limit`    | `POST /customer/wishlist`                      | <SchemaTypeTooltip type-key='operations["readCustomerWishlist post /customer/wishlist"]["response"]' />                         |
| Empty the loaded page | `clearWishlist()`               | `DELETE /customer/wishlist/delete/{productId}` | <SchemaTypeTooltip type-key='operations["deleteProductOnWishlist delete /customer/wishlist/delete/{productId}"]["response"]' /> |
| Merge the guest wishlist at login | `mergeWishlistProducts()` | `POST /customer/wishlist/merge`                | <SchemaTypeTooltip type-key='operations["mergeProductOnWishlist post /customer/wishlist/merge"]["response"]' />                 |

## Composables

- `useWishlist`: the wishlist page. Exposes `getWishlistProducts`, `clearWishlist`, `mergeWishlistProducts`, `items`, `products`, `count`, `currentPage`, `totalPagesCount`, `limit`, and `canSyncWishlist`. Call `mergeWishlistProducts` right after a successful login, as both starter templates do: it pushes the ids saved in localStorage during the guest session to the customer wishlist and reloads. Without that call the products saved before sign-in are lost.
- `useProductWishlist`: the wishlist state of one product. Takes a product id and exposes `addToWishlist`, `removeFromWishlist`, and `isInWishlist`.
- `useSyncWishlist`: the customer wishlist behind the Store API, and the shared state both composables above read from. Exposes `getWishlistProducts`, `addToWishlistSync`, `removeFromWishlistSync`, `mergeWishlistProducts`, `items`, `products`, `count`, `currentPage`, and `limit`.
- `useUser`: provides `isLoggedIn` and `isGuestSession`, which decide whether the customer wishlist is used at all.

## Types

Use generated Store API types when you type a wishlist criteria, the response, or the products you render:

<div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 18px;">
  <SchemaTypeTooltip type-key='operations["readCustomerWishlist post /customer/wishlist"]["body"]' />
  <SchemaTypeTooltip type-key='operations["readCustomerWishlist post /customer/wishlist"]["response"]' />
  <SchemaTypeTooltip type-key='operations["addProductOnWishlist post /customer/wishlist/add/{productId}"]["response"]' />
  <SchemaTypeTooltip type-key='Schemas["WishlistLoadRouteResponse"]' />
  <SchemaTypeTooltip type-key='Schemas["Criteria"]' />
  <SchemaTypeTooltip type-key='Schemas["Product"]' />
</div>

```ts
import type { Schemas, operations } from "#shopware";

type WishlistCriteria =
  operations["readCustomerWishlist post /customer/wishlist"]["body"];
type WishlistResponse =
  operations["readCustomerWishlist post /customer/wishlist"]["response"];
type Criteria = Schemas["Criteria"];
type Product = Schemas["Product"];
```

## Minimal Vue Example

```vue
<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";

const {
  getWishlistProducts,
  clearWishlist,
  products,
  count,
  currentPage,
  totalPagesCount,
  canSyncWishlist,
} = useWishlist();

// Start as loading so the first render shows the loading state instead of
// flashing "You have not saved any products yet." before the wishlist arrives.
const isLoading = ref(true);
const clearError = ref("");

const loadWishlist = async (page = 1) => {
  isLoading.value = true;

  try {
    // The composable logs and swallows load errors, so there is nothing to catch.
    await getWishlistProducts({ page, limit: 15 });
  } finally {
    isLoading.value = false;
  }
};

const clear = async () => {
  clearError.value = "";
  isLoading.value = true;

  try {
    await clearWishlist();
  } catch {
    clearError.value = "The wishlist could not be emptied.";
  } finally {
    isLoading.value = false;
  }
};

// Immediate watcher instead of onMounted: it loads on mount and again when
// the customer signs in without a page change, e.g. through the login modal.
watch(
  canSyncWishlist,
  (canSync) => {
    if (canSync) {
      loadWishlist();
    }
  },
  { immediate: true },
);
</script>

<template>
  <section>
    <h1>Wishlist</h1>

    <p v-if="!canSyncWishlist">Sign in to see the products you saved.</p>

    <template v-else>
      <p v-if="isLoading">Loading wishlist...</p>
      <p v-else-if="!count">You have not saved any products yet.</p>

      <template v-else>
        <p>{{ count }} saved products</p>
        <p v-if="clearError">{{ clearError }}</p>

        <ul>
          <li v-for="product in products" :key="product.id">
            {{ getTranslatedProperty(product, "name") }}
          </li>
        </ul>

        <p>Page {{ currentPage }} of {{ totalPagesCount }}</p>

        <button
          v-if="currentPage > 1"
          type="button"
          @click="loadWishlist(currentPage - 1)"
        >
          Previous page
        </button>

        <button
          v-if="currentPage < totalPagesCount"
          type="button"
          @click="loadWishlist(currentPage + 1)"
        >
          Next page
        </button>

        <button type="button" @click="clear()">Clear this page</button>
      </template>
    </template>
  </section>
</template>
```

## State And Session

The Store API resolves the customer from the `sw-context-token` header. Nothing about the wishlist is passed as a parameter, so `POST /customer/wishlist` returns the wishlist of whoever is authenticated in the current sales channel session.

`useSyncWishlist` keeps `items`, `products`, `count`, `currentPage`, and `limit` in refs declared at module level, outside the composable function. They are shared by every component in the app. A toggle in a product card and the wishlist page read and write the same refs, which is why `useProductWishlist` reloads the wishlist after each add and remove instead of patching a local array.

That shared state holds exactly one page. `items` contains the ids of the products in the last response, not every product on the wishlist, and `count` is the only value that describes the whole wishlist.

## Edge Cases

- `useSyncWishlist().getWishlistProducts()` catches its own errors, logs them, and resets `items`, `products`, and `count` to empty. A failed load is indistinguishable from an empty wishlist, and a `try/catch` around the call never fires.
- `useProductWishlist().isInWishlist` checks `items`, which holds only the loaded page. On a product listing, a saved product that is not in that page reads as not saved until you load a page large enough to contain it.
- `useProductWishlist` reloads with no criteria after every add and remove, which resets the wishlist to page 1 with the Store API's default limit, since no `limit` is sent. Toggling a product while the customer is on page 3 of the wishlist moves them back to the first page.
- `clearWishlist()` sends one `deleteProductOnWishlist delete /customer/wishlist/delete/{productId}` request per id in `items`, so it empties the loaded page and not the whole wishlist.
- `useWishlist().canSyncWishlist` checks `isLoggedIn && !isGuestSession`, while `useProductWishlist` branches on `isLoggedIn` alone. The two checks are equivalent, because `isLoggedIn` is already false for guest sessions, so both the toggle and the wishlist page use the localStorage wishlist for a guest.
- `useSyncWishlist` returns an `isLoading` ref that the composable never updates. Track loading state in your component.
- The add and remove operations resolve with no wishlist data. Until the reload finishes, `count` and `products` still describe the state before the write.

## Common Mistakes

- Do not treat `items` as the full wishlist. It is the ids of the loaded page, and `count` is the total.
- Do not rely on a `try/catch` around `getWishlistProducts` to detect a failed load. The composable swallows the error and empties the state.
- Do not keep a local `isInWishlist` flag next to `useProductWishlist().isInWishlist`.
- Do not call `useSyncWishlist` directly from a component. Use `useWishlist` or `useProductWishlist` so the session is taken into account.
- Do not present `clearWishlist()` as "delete everything" when the wishlist spans more than one page.
- Do not expose raw API error details from the wishlist routes in the UI.

## Testing Checklist

- Saving a product calls `addProductOnWishlist post /customer/wishlist/add/{productId}` and then `readCustomerWishlist post /customer/wishlist`.
- Removing a product calls `deleteProductOnWishlist delete /customer/wishlist/delete/{productId}` and flips `isInWishlist` to false.
- Loading the wishlist posts a criteria with `total-count-mode` set to `exact` and fills `products`, `count`, `currentPage`, and `limit`.
- Paging forward and back requests the matching `page` and keeps `count` stable.
- `clearWishlist()` sends one delete request per id in the loaded page and reloads the wishlist.
- A failing load renders the empty state rather than a broken list.
- `canSyncWishlist` is false in a guest session, and the wishlist page renders the signed-out state.

## Related Links

- [Login recipe](login.html)
- [Composables reference](../../packages/composables/)
- [API client package](../../packages/api-client.html)
- [Product listing](../../getting-started/e-commerce/product-listing.html)
