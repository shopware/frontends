import { useCart as swUseCart } from "@shopware-pwa/composables-next/composables";
import type { Cart } from "@shopware-pwa/types";
// import type { RequestReturnType } from "@shopware/api-client";

// TODO: copied temporarly from composables package, make it public
function _useContext<T>(
  injectionName: string,
  params?: {
    context?: Ref<T> | T;
    replace?: T;
  },
) {
  const isNewContext = !!params?.context;

  const _context: Ref<T> = isNewContext
    ? (ref(unref(params?.context)) as Ref<T>)
    : (inject(injectionName, ref()) as Ref<T>);
  provide(injectionName, _context);

  /**
   * Used for global context to replace it with new Value. Used mainly for session context
   */
  if (!!params?.replace) {
    _context.value = unref(params.replace);
  }

  return _context;
}

// TODO: this type should be used
// type ShopwareCart = RequestReturnType<"readCart">;
// temporary to avoid lint error
type ShopwareCart = Cart;

const _useCart = () => {
  const useCartData = swUseCart();
  const _storeCart = _useContext<undefined | ShopwareCart>("swCart");
  const { apiClient } = useShopwareContext();

  async function refreshCart(newCart?: ShopwareCart): Promise<ShopwareCart> {
    if (newCart) {
      _storeCart.value = newCart;
      return newCart;
    }

    const result = await apiClient.invoke(
      "readCart get /checkout/cart?name",
      {},
    );
    _storeCart.value = result as unknown as ShopwareCart;
    // TODO: `deliveries` definition missing
    useCartData.refreshCart(_storeCart.value as unknown as Cart);
    return result as unknown as ShopwareCart;
  }

  return {
    ...useCartData,
    refreshCart,
  };
};

export const useCart = createSharedComposable(_useCart);
