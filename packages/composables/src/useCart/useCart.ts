import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useContext, useShopwareContext } from "#imports";
import { createSharedComposable } from "@vueuse/core";
import type { Schemas, operations } from "#shopware";

/**
 * Composable to manage cart
 *
 * @public
 * @category Cart & Checkout
 */
export type UseCartReturn = {
  /**
   * Add product by id and quantity
   */
  addProduct(params: {
    id: string;
    quantity?: number;
  }): Promise<Schemas["Cart"]>;
  /**
   * Add products by array of items
   */
  addProducts(
    items: operations["addLineItem post /checkout/cart/line-item"]["body"]["items"],
  ): Promise<Schemas["Cart"]>;
  /**
   * Adds a promotion code to the cart
   */
  addPromotionCode(promotionCode: string): Promise<Schemas["Cart"]>;
  /**
   * Lists all applied and active promotion codes
   */
  appliedPromotionCodes: ComputedRef<Schemas["LineItem"][]>;
  /**
   * Current Cart object
   */
  cart: ComputedRef<Schemas["Cart"] | undefined>;
  /**
   * All items in the cart
   */
  cartItems: ComputedRef<Schemas["LineItem"][]>;
  /**
   * Changes the quantity of a product in the cart
   */
  changeProductQuantity(params: {
    id: string;
    quantity: number;
  }): Promise<Schemas["Cart"]>;
  /**
   * The number of items in the cart
   */
  count: ComputedRef<number>;
  /**
   * Refreshes the cart object and related data
   * If @param newCart is provided, it will be used as a new cart object
   */
  refreshCart(newCart?: Schemas["Cart"]): Promise<Schemas["Cart"]>;
  /**
   * Removes the provided LineItem from the cart
   */
  removeItem(lineItem: Schemas["LineItem"]): Promise<Schemas["Cart"]>;
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
   * `true` if the cart contains no items
   */
  isEmpty: ComputedRef<boolean>;
  /**
   * `true` if cart contains only digital items
   */
  isVirtualCart: ComputedRef<boolean>;
  /**
   * Get cart errors
   */
  consumeCartErrors(): Schemas["Cart"]["errors"];
};

/**
 * Cart management logic.
 *
 * Used as [Shared](https://frontends.shopware.com/framework/composables/shared-composables.html) Composable `useCart`
 *
 * @category Cart & Checkout
 */
export function useCartFunction(): UseCartReturn {
  const { apiClient } = useShopwareContext();

  const _storeCart = useContext<Schemas["Cart"]>("swCart");
  const _storeCartErrors = useContext<Schemas["Cart"]["errors"] | null>(
    "swCartErrors",
  );

  async function refreshCart(
    newCart?: Schemas["Cart"],
  ): Promise<Schemas["Cart"]> {
    if (newCart) {
      _storeCart.value = newCart;
      return newCart;
    }

    const { data } = await apiClient.invoke("readCart get /checkout/cart");
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }

  async function addProduct(params: {
    id: string;
    quantity?: number;
  }): Promise<Schemas["Cart"]> {
    return addProducts([
      {
        id: params.id,
        quantity: params.quantity ?? 0,
        type: "product",
      },
    ]);
  }

  /**
   * Add multiple products to the cart
   *
   * @param {operations["addLineItem post /checkout/cart/line-item"]["body"]["items"]} items
   * @returns
   */
  async function addProducts(
    items: operations["addLineItem post /checkout/cart/line-item"]["body"]["items"],
  ): Promise<Schemas["Cart"]> {
    const { data: addToCartResult } = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        body: {
          items,
        },
      },
    );
    _storeCart.value = addToCartResult;
    setCartErrors(addToCartResult);
    return addToCartResult;
  }

  async function removeItem(lineItem: Schemas["LineItem"]) {
    const { data } = await apiClient.invoke(
      "removeLineItem post /checkout/cart/line-item/delete",
      {
        body: { ids: [lineItem.id] },
      },
    );
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }

  async function changeProductQuantity(params: {
    id: string;
    quantity: number;
  }) {
    const { data } = await apiClient.invoke(
      "updateLineItem patch /checkout/cart/line-item",
      {
        body: {
          items: [
            {
              id: params.id,
              quantity: +params.quantity,
            },
          ],
        },
      },
    );
    _storeCart.value = data;
    setCartErrors(data);

    return data;
  }

  async function submitPromotionCode(promotionCode: string) {
    const { data } = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        body: {
          items: [
            {
              referencedId: promotionCode,
              type: "promotion",
            },
          ],
        },
      },
    );
    _storeCart.value = data;
    setCartErrors(data);
    return data;
  }

  const appliedPromotionCodes = computed(() => {
    return cartItems.value.filter(
      (cartItem: Schemas["LineItem"]) => cartItem.type === "promotion",
    );
  });

  const cart: ComputedRef<Schemas["Cart"] | undefined> = computed(
    () => _storeCart.value,
  );

  const cartItems = computed<Schemas["LineItem"][]>(() => {
    return cart.value?.lineItems || [];
  });

  const count = computed(() => {
    return cartItems.value.reduce(
      (accumulator: number, lineItem: Schemas["LineItem"]) =>
        lineItem.good === true ? lineItem.quantity + accumulator : accumulator,
      0,
    );
  });

  const isEmpty = computed(() => count.value <= 0);

  const totalPrice = computed(() => {
    const cartPrice = cart.value?.price?.totalPrice;
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

  const isVirtualCart = computed(() => {
    return (
      cartItems.value.length > 0 &&
      cartItems.value
        .filter((element) => element.type !== "promotion")
        .every((item) => item.states.includes("is-download"))
    );
  });

  /**
   * Add cart errors to the sharable variable
   *
   * @param {Cart} cart
   */
  const setCartErrors = (cart: Schemas["Cart"]) => {
    if (Object.keys(cart.errors || {}).length) {
      _storeCartErrors.value = Object.assign(
        _storeCartErrors.value ? _storeCartErrors.value : {},
        cart.errors,
      );
    }
  };

  /**
   * Get cart errors and clear variable
   *
   * @returns {CartErrors}
   */
  const consumeCartErrors = () => {
    const errors = _storeCartErrors.value
      ? JSON.parse(JSON.stringify(_storeCartErrors.value))
      : null;
    _storeCartErrors.value = null;
    return errors;
  };

  return {
    addProduct,
    addProducts,
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
    isEmpty,
    isVirtualCart,
    consumeCartErrors,
  };
}

export const useCart = createSharedComposable(useCartFunction);
