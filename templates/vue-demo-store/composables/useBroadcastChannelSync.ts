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
