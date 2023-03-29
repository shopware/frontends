import { computed, ComputedRef, ref, inject, provide } from "vue";
import {
  ShippingAddress,
  ShippingMethod,
  PaymentMethod,
  ClientApiError,
  CreateOrderParams,
  Order,
  BillingAddress,
} from "@shopware-pwa/types";
import {
  getAvailableShippingMethods,
  getAvailablePaymentMethods,
  createOrder as createApiOrder,
} from "@shopware-pwa/api-client";
import { useShopwareContext, useCart, useSessionContext } from ".";

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

  async function getShippingMethods({ forceReload } = { forceReload: false }) {
    if (shippingMethods.value.length && !forceReload) return shippingMethods;
    const response = await getAvailableShippingMethods(apiInstance, {
      onlyAvailable: true, // depending on the context, some of them can be hidden due to applied rules describing whether a method can be available
    });
    storeShippingMethods.value = response?.elements || [];
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
    } finally {
      refreshCart();
    }
  }

  const shippingAddress = computed(
    () => sessionContext.value?.shippingLocation?.address
  );
  const billingAddress = computed(
    () => sessionContext.value?.customer?.activeBillingAddress
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
