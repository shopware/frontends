import type { Cart } from "#shopware";
import { useCartFunction as swUseCart } from "@shopware-pwa/composables-next/composables";

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

const _useCart = (): UseCartReturn => {
  const useCartData: UseCartReturn = swUseCart();
  const _storeCart = _useContext<undefined | Cart>("swCart");
  const { apiClient } = useShopwareContext();

  async function refreshCart(newCart?: Cart): Promise<Cart> {
    if (newCart) {
      _storeCart.value = newCart;
      return newCart;
    }

    const result = await apiClient.invoke(
      "readCart get /checkout/cart?name",
      {},
    );
    _storeCart.value = result;
    useCartData.refreshCart(_storeCart.value);
    return result;
  }

  return {
    ...useCartData,
    refreshCart,
  };
};

export const useCart = createSharedComposable(_useCart);
