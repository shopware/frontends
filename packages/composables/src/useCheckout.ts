import { computed, ref, inject, provide } from "vue";
import type { ComputedRef } from "vue";
import type {
  ShippingAddress,
  ShippingMethod,
  PaymentMethod,
  ClientApiError,
  CreateOrderParams,
  Order,
  BillingAddress,
  ShopwareSearchParams,
} from "@shopware-pwa/types";
import {
  getAvailableShippingMethods,
  getAvailablePaymentMethods,
  createOrder as createApiOrder,
} from "@shopware-pwa/api-client";
import { useShopwareContext, useCart, useSessionContext } from "#imports";
import deepMerge from "./helpers/deepMerge";

export type UseCheckoutReturn = {
  /**
   * Fetches all available shipping methods
   */
  getShippingMethods(options?: {
    forceReload: boolean;
  }): Promise<ComputedRef<ShippingMethod[]>>;
  /**
   * List of available shipping methods
   */
  shippingMethods: ComputedRef<ShippingMethod[]>;
  /**
   * Fetches all available payment methods
   */
  getPaymentMethods(options?: {
    forceReload: boolean;
  }): Promise<ComputedRef<PaymentMethod[]>>;
  /**
   * List of available payment methods
   */
  paymentMethods: ComputedRef<PaymentMethod[]>;
  /**
   * Creates order based on the current cart
   */
  createOrder(params?: CreateOrderParams): Promise<Order>;
  /**
   * Shipping address for the current session
   */
  shippingAddress: ComputedRef<ShippingAddress | undefined>;
  /**
   * Billing address for the current session
   */
  billingAddress: ComputedRef<Partial<BillingAddress> | undefined>;
  /**
   * Selected shipping method for the current session
   * Sugar for {@link useSessionContext.selectedShippingMethod}
   */
  selectedShippingMethod: ComputedRef<ShippingMethod | null>;
  /**
   * Sets shipping method for the current session
   * Sugar for {@link useSessionContext.setShippingMethod}
   */
  setShippingMethod(shippingMethod: Partial<ShippingMethod>): Promise<void>;
  /**
   * Selected payment method for the current session
   * Sugar for {@link useSessionContext.selectedPaymentMethod}
   */
  selectedPaymentMethod: ComputedRef<PaymentMethod | null>;
  /**
   * Sets payment method for the current session
   * Sugar for {@link useSessionContext.setPaymentMethod}
   */
  setPaymentMethod(paymentMethod: Partial<PaymentMethod>): Promise<void>;
};

const shippingMethodsAssociations: ShopwareSearchParams = {
  associations: {
    prices: {},
  },
};

/**
 * Composable to manage checkout process
 * @public
 * @category Cart & Checkout
 */
export function useCheckout(): UseCheckoutReturn {
  const { apiInstance } = useShopwareContext();
  const { refreshCart } = useCart();
  const {
    sessionContext,
    selectedPaymentMethod,
    selectedShippingMethod,
    setShippingMethod,
    setPaymentMethod,
  } = useSessionContext();

  const storeShippingMethods = inject("swShippingMethods", ref());
  provide("swShippingMethods", storeShippingMethods);

  const storePaymentMethods = inject("swPaymentMethods", ref());
  provide("swPaymentMethods", storePaymentMethods);

  const shippingMethods = computed(() => storeShippingMethods.value || []);
  const paymentMethods = computed(() => storePaymentMethods.value || []);

  async function getShippingMethods(
    { forceReload } = { forceReload: false },
    associations: ShopwareSearchParams = {},
  ) {
    if (shippingMethods.value.length && !forceReload) return shippingMethods;
    const mergedAssociations: ShopwareSearchParams = deepMerge(
      shippingMethodsAssociations,
      associations,
    );
    const response = await getAvailableShippingMethods(apiInstance, {
      ...mergedAssociations,
    });
    storeShippingMethods.value =
      response?.elements.sort(
        (a: ShippingMethod, b: ShippingMethod) =>
          (a.position ?? 0) - (b.position ?? 0),
      ) || [];
    return shippingMethods;
  }

  async function getPaymentMethods({ forceReload } = { forceReload: false }) {
    if (paymentMethods.value.length && !forceReload) return paymentMethods;
    const response = await getAvailablePaymentMethods(apiInstance, {
      onlyAvailable: true, // depending on the context, some of them can be hidden due to applied rules describing whether a method can be available
    });
    storePaymentMethods.value = response?.elements || [];
    return paymentMethods;
  }

  async function createOrder(params?: CreateOrderParams) {
    try {
      const order = await createApiOrder(params, apiInstance);
      return order;
    } catch (e) {
      const err = e as ClientApiError;
      throw err;
    }
  }

  const shippingAddress = computed(
    () => sessionContext.value?.shippingLocation?.address,
  );
  const billingAddress = computed(
    () => sessionContext.value?.customer?.activeBillingAddress,
  );

  return {
    getPaymentMethods,
    paymentMethods,
    getShippingMethods,
    shippingMethods,
    createOrder,
    shippingAddress,
    billingAddress,
    selectedShippingMethod,
    setShippingMethod,
    selectedPaymentMethod,
    setPaymentMethod,
  };
}
