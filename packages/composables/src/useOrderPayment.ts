import { computed, ref, inject, provide } from "vue";
import type { ComputedRef, Ref } from "vue";

import type {
  Order,
  OrderTransaction,
  PaymentMethod,
  StateMachineState,
} from "@shopware-pwa/types";
import {
  changeOrderPaymentMethod,
  handlePayment as apiHandlePayment,
} from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";

export type UseOrderPaymentReturn = {
  /**
   * If the payment can be done after the order is placed
   */
  isAsynchronous: ComputedRef<boolean | undefined>;
  /**
   * Active payment transaction
   */
  activeTransaction: ComputedRef<OrderTransaction | undefined>;
  /**
   * Payment status
   */
  state: ComputedRef<StateMachineState | null | undefined>;
  paymentUrl: Ref<null | string>;
  /**
   * Payment method set for the order
   */
  paymentMethod: ComputedRef<PaymentMethod | undefined | null>;

  /**
   * Invokes the payment process for the order in the backend
   */
  handlePayment(
    /**
     * URL to redirect after successful payment
     */
    successUrl?: string,
    /**
     * URL to redirect after failed payment
     */
    errorUrl?: string,
    /**
     * additional payment details to provide
     */
    paymentDetails?: unknown,
  ): Promise<void | unknown>;
  /**
   * Change a payment method for the order
   */
  changePaymentMethod(paymentMethodId: string): Promise<void>;
};

/**
 * Composable for managing an existing order.
 * @public
 * @category Customer & Account
 */
export function useOrderPayment(
  order: ComputedRef<Order | null | undefined>,
): UseOrderPaymentReturn {
  const { apiInstance } = useShopwareContext();
  const activeTransaction = computed(
    () =>
      order.value?.transactions?.find((t) => t.paymentMethod?.active === true),
  );
  const paymentMethod = computed(() => activeTransaction.value?.paymentMethod);
  const paymentUrl = ref();
  const state = computed(() => activeTransaction.value?.stateMachineState);
  const isAsynchronous = computed(
    () =>
      activeTransaction.value?.paymentMethod?.asynchronous &&
      activeTransaction.value?.paymentMethod?.afterOrderEnabled,
  );

  async function handlePayment(
    finishUrl?: string,
    errorUrl?: string,
    paymentDetails?: unknown,
  ): Promise<void | unknown> {
    if (!order.value) {
      return;
    }
    const resp = await apiHandlePayment(
      {
        orderId: order.value?.id,
        finishUrl,
        errorUrl,
        paymentDetails,
      },
      apiInstance,
    );

    paymentUrl.value = resp?.redirectUrl;

    return resp;
  }

  async function changePaymentMethod(paymentMethodId: string) {
    if (!order.value) {
      return;
    }
    changeOrderPaymentMethod(order.value?.id, paymentMethodId, apiInstance);
  }

  return {
    isAsynchronous,
    activeTransaction,
    state,
    paymentUrl,
    paymentMethod,
    handlePayment,
    changePaymentMethod,
  };
}
