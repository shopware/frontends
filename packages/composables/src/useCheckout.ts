import {
  computed,
  UnwrapRef,
  reactive,
  ComputedRef,
  ref,
  inject,
  provide,
} from "vue";
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
  getShippingMethods: (options?: {
    forceReload: boolean;
  }) => Promise<ComputedRef<ShippingMethod[]>>;
  shippingMethods: ComputedRef<ShippingMethod[]>;
  getPaymentMethods: (options?: {
    forceReload: boolean;
  }) => Promise<ComputedRef<PaymentMethod[]>>;
  paymentMethods: ComputedRef<PaymentMethod[]>;
  createOrder: (params?: CreateOrderParams) => Promise<Order>;
  shippingAddress: ComputedRef<ShippingAddress | undefined>;
  billingAddress: ComputedRef<Partial<BillingAddress> | undefined>;
};

export function useCheckout(): UseCheckoutReturn {
  const { apiInstance } = useShopwareContext();
  const { refreshCart } = useCart();
  const { sessionContext } = useSessionContext();

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
  };
}
