import { computed, ref, inject, provide } from "vue";
import type { ComputedRef } from "vue";
import type { Schemas } from "#shopware";
import { useShopwareContext, useCart, useSessionContext } from "#imports";
import deepMerge from "./helpers/deepMerge";
import type { RequestParameters } from "@shopware/api-client";

export type UseCheckoutReturn = {
  /**
   * Fetches all available shipping methods
   */
  getShippingMethods(options?: {
    forceReload: boolean;
  }): Promise<ComputedRef<Schemas["ShippingMethod"][]>>;
  /**
   * List of available shipping methods
   */
  shippingMethods: ComputedRef<Schemas["ShippingMethod"][]>;
  /**
   * Fetches all available payment methods
   */
  getPaymentMethods(options?: {
    forceReload: boolean;
  }): Promise<ComputedRef<Schemas["PaymentMethod"][]>>;
  /**
   * List of available payment methods
   */
  paymentMethods: ComputedRef<Schemas["PaymentMethod"][]>;
  /**
   * Creates order based on the current cart
   */
  createOrder(
    params?: RequestParameters<"createOrder">,
  ): Promise<Schemas["Order"]>;
  /**
   * Shipping address for the current session
   */
  shippingAddress: ComputedRef<Schemas["CustomerAddress"] | undefined>;
  /**
   * Billing address for the current session
   */
  billingAddress: ComputedRef<Partial<Schemas["CustomerAddress"]> | undefined>;
  /**
   * Selected shipping method for the current session
   * Sugar for {@link useSessionContext.selectedShippingMethod}
   */
  selectedShippingMethod: ComputedRef<Schemas["ShippingMethod"] | null>;
  /**
   * Sets shipping method for the current session
   * Sugar for {@link useSessionContext.setShippingMethod}
   */
  setShippingMethod(
    shippingMethod: Partial<Schemas["ShippingMethod"]>,
  ): Promise<void>;
  /**
   * Selected payment method for the current session
   * Sugar for {@link useSessionContext.selectedPaymentMethod}
   */
  selectedPaymentMethod: ComputedRef<Schemas["PaymentMethod"] | null>;
  /**
   * Sets payment method for the current session
   * Sugar for {@link useSessionContext.setPaymentMethod}
   */
  setPaymentMethod(
    paymentMethod: Partial<Schemas["PaymentMethod"]>,
  ): Promise<void>;
};

const shippingMethodsAssociations: Schemas["Criteria"] = {
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
  const { apiClient } = useShopwareContext();
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
    associations: Schemas["Criteria"] = {},
  ) {
    if (shippingMethods.value.length && !forceReload) return shippingMethods;
    const mergedAssociations: Schemas["Criteria"] = deepMerge(
      shippingMethodsAssociations,
      associations,
    );
    const response = await apiClient.invoke(
      "readShippingMethod post /shipping-method?onlyAvailable",
      {
        ...mergedAssociations,
      },
    );
    storeShippingMethods.value =
      response.elements.sort(
        (a: Schemas["ShippingMethod"], b: Schemas["ShippingMethod"]) =>
          (a.position ?? 0) - (b.position ?? 0),
      ) || [];
    return shippingMethods;
  }

  async function getPaymentMethods({ forceReload } = { forceReload: false }) {
    if (paymentMethods.value.length && !forceReload) return paymentMethods;
    const response = await apiClient.invoke(
      "readPaymentMethod post /payment-method",
      {
        onlyAvailable: true,
      },
    );
    storePaymentMethods.value = response?.elements || [];
    return paymentMethods;
  }

  async function createOrder(params: RequestParameters<"createOrder"> = {}) {
    const order = apiClient.invoke("createOrder post /checkout/order", params);
    return order;
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
