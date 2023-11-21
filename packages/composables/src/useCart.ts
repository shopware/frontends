import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useContext, useShopwareContext } from "#imports";
import { createSharedComposable } from "@vueuse/core";
import type { Cart, Product, Schemas } from "#shopware";

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
  addProduct(params: { id: string; quantity?: number }): Promise<Cart>;
  /**
   * Adds a promotion code to the cart
   */
  addPromotionCode(promotionCode: string): Promise<Cart>;
  /**
   * Lists all applied and active promotion codes
   */
  appliedPromotionCodes: ComputedRef<Schemas["LineItem"][]>;
  /**
   * Current Cart object
   */
  cart: ComputedRef<Cart | undefined>;
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
  }): Promise<Cart>;
  /**
   * The number of items in the cart
   */
  count: ComputedRef<number>;
  /**
   * Refreshes the cart object and related data
   * If @param newCart is provided, it will be used as a new cart object
   */
  refreshCart(newCart?: Cart): Promise<Cart>;
  /**
   * Removes the provided LineItem from the cart
   */
  removeItem(lineItem: Schemas["LineItem"]): Promise<void>;
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
   * @deprecated - use product related methods to fetch an item's URL instead
   */
  getProductItemsSeoUrlsData(): Promise<Partial<Product>[]>;
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
  consumeCartErrors(): Cart["errors"];
};

/**
 * Cart management logic.
 *
 * Used as [Shared](https://frontends.shopware.com/framework/shared-composables.html) Composable `useCart`
 */
export function useCartFunction(): UseCartReturn {
  const { apiClient } = useShopwareContext();

  const _storeCart = useContext<Cart>("swCart");
  const _storeCartErrors = useContext<Cart["errors"] | null>("swCartErrors");

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
    setCartErrors(result);
    return result;
  }

  async function addProduct(params: {
    id: string;
    quantity?: number;
  }): Promise<Cart> {
    const addToCartResult = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        items: [
          {
            id: params.id,
            referencedId: params.id,
            quantity: params.quantity,
            type: "product",
          },
        ],
      },
    );
    _storeCart.value = addToCartResult;
    setCartErrors(addToCartResult);
    return addToCartResult;
  }

  async function removeItem(lineItem: Schemas["LineItem"]) {
    const result = await apiClient.invoke(
      "removeLineItem delete /checkout/cart/line-item?ids",
      {
        ids: [lineItem.id as string], // TODO: [OpenAPI] - change lineitem id to mandatory
      },
    );
    _storeCart.value = result;
    setCartErrors(result);
  }

  async function changeProductQuantity(params: {
    id: string;
    quantity: number;
  }) {
    const result = await apiClient.invoke(
      "updateLineItem patch /checkout/cart/line-item",
      {
        items: [
          {
            id: params.id,
            quantity: +params.quantity,
          },
        ],
      },
    );
    _storeCart.value = result;
    setCartErrors(result);

    return result;
  }

  async function submitPromotionCode(promotionCode: string) {
    const result = await apiClient.invoke(
      "addLineItem post /checkout/cart/line-item",
      {
        items: [
          {
            referencedId: promotionCode,
            type: "promotion",
          },
        ],
      },
    );
    _storeCart.value = result;
    setCartErrors(result);
    return result;
  }

  async function getProductItemsSeoUrlsData() {
    if (!cartItems.value.length) {
      return [];
    }

    const result = await apiClient.invoke(
      "readProduct post /product",
      {
        ids: cartItems.value
          .map(({ referencedId }) => referencedId)
          .filter(String) as string[],
      } as any, // TODO: [OpenAPI] - `ids` is missing in schema
    );
    return result?.elements || [];
  }

  const appliedPromotionCodes = computed(() => {
    return cartItems.value.filter(
      (cartItem: Schemas["LineItem"]) => cartItem.type === "promotion",
    );
  });

  const cart: ComputedRef<Cart | undefined> = computed(() => _storeCart.value);

  const cartItems = computed<Schemas["LineItem"][]>(() => {
    return cart.value?.lineItems || [];
  });

  const count = computed(() => {
    return cartItems.value.reduce(
      (accumulator: number, lineItem: Schemas["LineItem"]) =>
        lineItem.type === "product" // TODO: [OpenAPI][Cart] - LineItem `type` should be defined as union type not string -> "product" | "promotion" | "custom" | "credit";
          ? (lineItem.quantity as number) + accumulator // TODO: [OpenAPI][Cart] - LineItem `quantity` should be defined
          : accumulator,
      0,
    );
  });

  const isEmpty = computed(() => count.value <= 0);

  const totalPrice = computed(() => {
    const cartPrice =
      cart.value && cart.value.price && cart.value.price.totalPrice;
    return cartPrice || 0;
  });

  const shippingTotal = computed(() => {
    // TODO: [OpenAPI][Cart] - `deliveries` is missing in schema
    const shippingTotal = (cart.value as any)?.deliveries?.[0]?.shippingCosts
      ?.totalPrice as number;
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
        .every((item) => (item as any).states.includes("is-download")) // TODO: [OpenAPI][Cart] - LineItem `states` should be defined
    );
  });

  /**
   * Add cart errors to the sharable variable
   *
   * @param {Cart} cart
   */
  const setCartErrors = (cart: Cart) => {
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
    getProductItemsSeoUrlsData,
    isEmpty,
    isVirtualCart,
    consumeCartErrors,
  };
}

export const useCart = createSharedComposable(useCartFunction);
