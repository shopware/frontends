import type { Cart } from "#shopware";
import { useCartFunction as swUseCart } from "@shopware-pwa/composables-next/composables";

const _useCart = (): UseCartReturn => {
  const useCartData: UseCartReturn = swUseCart();
  const _storeCart = useContext<undefined | Cart>("swCart");
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
