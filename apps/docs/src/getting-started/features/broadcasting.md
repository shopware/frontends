---
head:
  - - meta
    - name: og:title
      content: "Integrations: Broadcasting - Shopware Frontends"
  - - meta
    - name: og:description
      content: "Example of usage broadcasting"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Integration:%20**Broadcasting**?fontSize=100px"
---

# Broadcasting

The Broadcast Channel API allows simple communication between browsing contexts (e.g., different tabs, iframes, or workers) on the same origin.

For Vue app we are recommending to use `useBroadcastChannel` from `VueUse` [package](https://vueuse.org/core/useBroadcastChannel/)

## Synchronizing changes between tabs

In our demo store template we provide example of usage broadcasting for synchronizing changes between tabs.
We rely on the data fetched by the API client and send them to broadcast channel for synchronization.
This way:

- session data
- cart data
  are synchronized between tabs.

<!-- automd:file src="../../../../../templates/vue-demo-store/composables/useBroadcastChannelSync.ts" code -->

```ts [useBroadcastChannelSync.ts]
import type { Schemas } from "#shopware";

export function useSyncChannel<Entity>(
  name: string,
): [Ref<Entity | undefined>, (data: Entity) => void] {
  const { data, post } = useBroadcastChannel<Entity, Entity>({
    name,
  });

  return [data, post];
}

function isEntity<T extends { apiAlias: string }>(
  data: T,
  apiAlias: T["apiAlias"],
): data is T {
  return data?.apiAlias === apiAlias;
}

/**
 * Sync basic state like session/cart data between tabs
 */
export const useBroadcastChannelSync = createSharedComposable(() => {
  const { apiClient } = useShopwareContext();

  // Synchronize CART data
  const { refreshCart } = useCart();
  const [cartData, notifyCartDataChanged] =
    useSyncChannel<Schemas["Cart"]>("shopware-cart");
  watch([cartData], () => {
    refreshCart(cartData.value);
  });

  // Synchronize SESSION data
  const { setContext } = useSessionContext();
  const [sessionData, notifySessionDataChanged] = useSyncChannel<
    Schemas["SalesChannelContext"]
  >("shopware-session-data");
  watch([sessionData], () => {
    setContext(sessionData.value!);
  });

  // Listen for API responses and update the shared state
  apiClient.hook("onSuccessResponse", (response) => {
    // for cart
    if (isEntity<Schemas["Cart"]>(<Schemas["Cart"]>response._data, "cart")) {
      notifyCartDataChanged(<Schemas["Cart"]>response._data);
    }
    // for session data
    else if (
      isEntity<Schemas["SalesChannelContext"]>(
        <Schemas["SalesChannelContext"]>response._data,
        "sales_channel_context",
      )
    ) {
      notifySessionDataChanged(<Schemas["SalesChannelContext"]>response._data);
    }
  });
});
```

<!-- /automd -->
