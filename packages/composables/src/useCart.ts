import { ref, Ref, computed, ComputedRef, provide, inject } from "vue";
import {
  getCart,
  addProductToCart,
  addPromotionCode,
  removeCartItem,
  changeCartItemQuantity,
  getProducts,
} from "@shopware-pwa/api-client";
import {
  ClientApiError,
  Cart,
  EntityError,
  Product,
  LineItem,
} from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";

export type UseCartReturn = {
  addProduct: (params: { id: string; quantity?: number }) => Promise<Cart>;
  addPromotionCode: (promotionCode: string) => Promise<void>;
  appliedPromotionCodes: ComputedRef<LineItem[]>;
  cart: ComputedRef<Cart | undefined>;
  cartItems: ComputedRef<LineItem[]>;
  changeProductQuantity: (params: { id: string; quantity: number }) => void;
  count: ComputedRef<number>;
  refreshCart: () => Promise<Cart>;
  removeItem: (lineItem: LineItem) => Promise<void>;
  totalPrice: ComputedRef<number>;
  shippingTotal: ComputedRef<number>;
  subtotal: ComputedRef<number>;
  cartErrors: ComputedRef<EntityError[]>;
  getProductItemsSeoUrlsData(): Promise<Partial<Product>[]>;
  isEmpty: ComputedRef<boolean>;
};

export function useCart(): UseCartReturn {
  const { apiInstance } = useShopwareContext();

  const _storeCart: Ref<Cart | undefined> = inject("swCart", ref());
  provide("swCart", _storeCart);

  async function refreshCart(): Promise<Cart> {
    const result = await getCart(apiInstance);
    _storeCart.value = result;
    return result;
  }

  async function addProduct(params: {
    id: string;
    quantity?: number;
  }): Promise<Cart> {
    const addToCartResult = await addProductToCart(
      params.id,
      params.quantity,
      apiInstance
    );
    _storeCart.value = addToCartResult;
    return addToCartResult;
  }

  async function removeItem(lineItem: LineItem) {
    const result = await removeCartItem(lineItem.id, apiInstance);
    _storeCart.value = result;
  }

  async function changeProductQuantity(params: {
    id: string;
    quantity: number;
  }) {
    const result = await changeCartItemQuantity(
      params.id,
      params.quantity,
      apiInstance
    );
    _storeCart.value = result;
  }

  async function submitPromotionCode(promotionCode: string) {
    if (promotionCode) {
      const result = await addPromotionCode(promotionCode, apiInstance);
      _storeCart.value = result;
    }
  }

  // TODO: move to separate composable recognizing cart error changes
  // function broadcastUpcomingErrors(cartResult: Cart): void {
  //   if (!cartResult) {
  //     return;
  //   }

  //   try {
  //     const cartErrorsKeys = Object.keys(_storeCart.value?.errors || {});
  //     const cartResultErrorKeys = Object.keys(cartResult.errors || {});
  //     const upcomingErrorsKeys = cartResultErrorKeys.filter(
  //       (resultErrorKey) => !cartErrorsKeys.includes(resultErrorKey)
  //     );
  //     const entityErrors: EntityError[] = Object.values(
  //       cartResult.errors || {}
  //     ).filter(
  //       // don't ignore ERROR level of incoming errors or if they are new
  //       (entityError) =>
  //         entityError.level === 20 ||
  //         upcomingErrorsKeys.includes(entityError.key)
  //     );

  //     // broadcastErrors(entityErrors, `[${contextName}][cartError]`, broadcast);
  //   } catch (error) {
  //     console.error("[useCart][broadcastUpcomingErrors]", error);
  //   }
  // }

  async function getProductItemsSeoUrlsData(): Promise<Partial<Product>[]> {
    if (!cartItems.value.length) {
      return [];
    }

    const result = await getProducts(
      {
        ids: cartItems.value
          .map(({ referencedId }) => referencedId)
          .filter(String) as string[],
        // includes: (getDefaults() as any).getProductItemsSeoUrlsData.includes,
        // associations: (getDefaults() as any).getProductItemsSeoUrlsData
        //   .associations,
      },
      apiInstance
    );
    return result?.elements || [];
  }

  const appliedPromotionCodes = computed(() => {
    return cartItems.value.filter(
      (cartItem: LineItem) => cartItem.type === "promotion"
    );
  });

  const cart: ComputedRef<Cart | undefined> = computed(() => _storeCart.value);

  const cartItems = computed(() => {
    return cart.value ? cart.value.lineItems || [] : [];
  });

  const count = computed(() => {
    return cartItems.value.reduce(
      (accumulator: number, lineItem: LineItem) =>
        lineItem.type === "product"
          ? lineItem.quantity + accumulator
          : accumulator,
      0
    );
  });

  const isEmpty = computed(() => count.value <= 0);

  const totalPrice = computed(() => {
    const cartPrice =
      cart.value && cart.value.price && cart.value.price.totalPrice;
    return cartPrice || 0;
  });

  const shippingTotal = computed(() => {
    const shippingTotal =
      cart.value?.deliveries?.[0]?.shippingCosts?.totalPrice;
    return shippingTotal || 0;
  });

  const subtotal = computed(() => {
    const cartPrice = cart.value?.price?.positionPrice;
    return cartPrice || 0;
  });

  const cartErrors: ComputedRef<EntityError[]> = computed(
    () => (cart.value?.errors && Object.values(cart.value.errors)) || []
  );

  return {
    addProduct,
    addPromotionCode: submitPromotionCode,
    appliedPromotionCodes,
    cart,
    cartItems,
    changeProductQuantity,
    count,
    refreshCart,
    removeItem,
    totalPrice,
    shippingTotal,
    subtotal,
    cartErrors,
    getProductItemsSeoUrlsData,
    isEmpty,
  };
}
