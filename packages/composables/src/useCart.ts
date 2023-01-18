import { computed, ComputedRef } from "vue";
import {
  getCart,
  addProductToCart,
  addPromotionCode,
  removeCartItem,
  changeCartItemQuantity,
  getProducts,
} from "@shopware-pwa/api-client";
import { Cart, EntityError, Product, LineItem } from "@shopware-pwa/types";
import { useShopwareContext } from "./useShopwareContext";
import { _useContext } from "./internal/_useContext";
import { createSharedComposable } from "@vueuse/core";

export type UseCartReturn = {
  /**
   * Adds a product with an optional quantity to the cart
   */
  addProduct: (params: { id: string; quantity?: number }) => Promise<Cart>;
  /**
   * Adds a promotion code to the cart
   */
  addPromotionCode: (promotionCode: string) => Promise<void>;
  /**
   * Lists all applied and active promotion codes
   */
  appliedPromotionCodes: ComputedRef<LineItem[]>;
  /**
   * Current Cart object
   */
  cart: ComputedRef<Cart | undefined>;
  /**
   * All items in the cart
   */
  cartItems: ComputedRef<LineItem[]>;
  /**
   * Changes the quantity of a product in the cart
   */
  changeProductQuantity: (params: { id: string; quantity: number }) => void;
  /**
   * The number of items in the cart
   */
  count: ComputedRef<number>;
  /**
   * Refreshes the cart object and related data
   */
  refreshCart: () => Promise<Cart>;
  /**
   * Removes the provided LineItem from the cart
   */
  removeItem: (lineItem: LineItem) => Promise<void>;
  /**
   * The total price of the cart (including calculated costs like shipping)
   */
  totalPrice: ComputedRef<number>;
  /**
   * Shipping price
   */
  shippingTotal: ComputedRef<number>;
  /**
   * The total price of all cart items
   */
  subtotal: ComputedRef<number>;
  /**
   * @deprecated - handle errors in your application by checking {cart.errors} object
   */
  cartErrors: ComputedRef<EntityError[]>;
  /**
   * @deprecated - use product related methods to fetch an item's URL instead
   */
  getProductItemsSeoUrlsData(): Promise<Partial<Product>[]>;
  /**
   * `true` if the cart contains no items
   */
  isEmpty: ComputedRef<boolean>;
};

/**
 * Cart management logic.
 *
 * Used as [Shared](https://shopware-frontends-docs.vercel.app/framework/shared-composables.html) Composable `useCart`
 */
export function useCartFunction(): UseCartReturn {
  const { apiInstance } = useShopwareContext();

  const _storeCart = _useContext<Cart | undefined>("swCart");

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

export const useCart = createSharedComposable(useCartFunction);
