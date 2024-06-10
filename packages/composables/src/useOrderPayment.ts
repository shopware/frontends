import { computed, ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

export type UseOrderPaymentReturn = {
  /**
   * If the payment can be done after the order is placed
   */
  isAsynchronous: ComputedRef<boolean | undefined>;
  /**
   * Active payment transaction
   */
  activeTransaction: ComputedRef<Schemas["OrderTransaction"] | undefined>;
  /**
   * Payment status
   */
  state: ComputedRef<Schemas["StateMachineState"] | null | undefined>;
  paymentUrl: Ref<null | string>;
  /**
   * Payment method set for the order
   */
  paymentMethod: ComputedRef<Schemas["PaymentMethod"] | undefined | null>;

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
  ): Promise<undefined | unknown>;
  /**
   * Change a payment method for the order
   */
  changePaymentMethod(
    paymentMethodId: string,
  ): Promise<Schemas["SuccessResponse"] | undefined>;
};

/**
 * Composable for managing an existing order.
 * @public
 * @category Customer & Account
 */
export function useOrderPayment(
  order: ComputedRef<Schemas["Order"] | null | undefined>,
): UseOrderPaymentReturn {
  const { apiClient } = useShopwareContext();
  const activeTransaction = computed(() =>
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
  ): Promise<undefined | unknown> {
    if (!order.value) {
      return;
    }
    const resp = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        body: {
          orderId: order.value.id,
          errorUrl,
          finishUrl,
        },
      },
    );

    paymentUrl.value = resp.data.redirectUrl;

    return resp;
  }

  async function changePaymentMethod(paymentMethodId: string) {
    if (!order.value) {
      return;
    }
    const response = await apiClient.invoke(
      "orderSetPayment post /order/payment",
      {
        body: {
          orderId: order.value.id,
          paymentMethodId,
        },
      },
    );
    return response.data;
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
