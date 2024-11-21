import { computed, ref, inject, provide } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";
import { useOrderDataProvider } from "../useOrderDataProvider/useOrderDataProvider";

export type UseOrderReturn = {
  /**
   * {@link Schemas['Order']} object
   */
  order: ComputedRef<Schemas["Order"] | undefined | null>;
  /**
   * Order status (e.g. 'Open', 'Cancelled')
   */
  status: ComputedRef<string | undefined>;
  /**
   * Order status technical name (e.g. 'open', 'cancelled')
   */
  statusTechnicalName: ComputedRef<string | undefined>;
  /**
   * Order total price
   */
  total: ComputedRef<number | undefined>;
  /**
   * Order subtotal price for all items
   */
  subtotal: ComputedRef<number | undefined>;
  /**
   * Order shipping costs
   */
  shippingCosts: ComputedRef<number | undefined>;
  /**
   * Shipping address
   */
  shippingAddress: ComputedRef<Schemas["OrderAddress"] | undefined>;
  /**
   * Billing address
   */
  billingAddress: ComputedRef<Schemas["OrderAddress"] | undefined>;
  /**
   * Basic personal details
   */
  personalDetails: ComputedRef<{
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
  }>;
  /**
   * Payment URL for external payment methods (e.g. async payment in external payment gateway)
   */
  paymentUrl: Ref<null | string>;
  /**
   * Selected shipping method
   */
  shippingMethod: ComputedRef<Schemas["ShippingMethod"] | undefined | null>;
  /**
   * Selected payment method
   */
  paymentMethod: ComputedRef<Schemas["PaymentMethod"] | undefined | null>;

  /**
   * Handle payment for existing error.
   *
   * Pass custom success and error URLs (optionally).
   */
  handlePayment(
    successUrl?: string,
    errorUrl?: string,
    paymentDetails?: unknown,
  ): void;
  /**
   * Cancel an order.
   *
   * Action cannot be reverted.
   */
  cancel(): Promise<Schemas["StateMachineState"]>;
  /**
   * Changes the payment method for current cart.
   * @param paymentMethodId - ID of the payment method to be set
   * @returns
   */
  changePaymentMethod(
    paymentMethodId: string,
  ): Promise<Schemas["SuccessResponse"]>;
  /**
   * Check if order has documents
   */
  hasDocuments: ComputedRef<boolean>;
  /**
   * Get order documents
   */
  documents: ComputedRef<Schemas["Document"][]>;
  /**
   * Fetches all available payment methods
   */
  getPaymentMethods(): Promise<Schemas["PaymentMethod"][]>;

  //   paymentChangeable: ComputedRef<boolean>;
  asyncSetData(order: Schemas["Order"]): void;
};

/**
 * Composable for managing an existing order.
 * @public
 * @category Customer & Account
 */
export function useOrder(order?: Schemas["Order"]): UseOrderReturn {
  const { apiClient } = useShopwareContext();
  const { loadOrderDetails } = useOrderDataProvider();

  //   const paymentChangeableList: Ref<{ [key: string]: boolean }> = ref({});
  const _sharedOrder = inject<Ref<Schemas["Order"] | null>>(
    "swOrderDetails",
    ref(order ?? null),
  );
  provide("swOrderDetails", _sharedOrder);

  const asyncSetData = (order: Schemas["Order"]) => {
    _sharedOrder.value = order;
  };
  const orderId = computed(() => _sharedOrder.value?.id ?? "");
  const paymentMethod = computed(
    () => _sharedOrder.value?.transactions?.[0]?.paymentMethod,
  );
  const shippingMethod = computed(
    () => _sharedOrder.value?.deliveries?.[0]?.shippingMethod,
  );
  const paymentUrl = ref();

  const personalDetails = computed(() => ({
    email: _sharedOrder.value?.orderCustomer?.email,
    firstName: _sharedOrder.value?.orderCustomer?.firstName,
    lastName: _sharedOrder.value?.orderCustomer?.lastName,
  }));

  const billingAddress = computed(() =>
    _sharedOrder.value?.addresses?.find(
      ({ id }: { id: string }) => id === _sharedOrder.value?.billingAddressId,
    ),
  );

  const shippingAddress = computed(
    () => _sharedOrder.value?.deliveries?.[0]?.shippingOrderAddress,
  );

  const shippingCosts = computed(() => _sharedOrder.value?.shippingTotal);
  const subtotal = computed(() => _sharedOrder.value?.price?.positionPrice);
  const total = computed(() => _sharedOrder.value?.price?.totalPrice);
  const status = computed(
    () => _sharedOrder.value?.stateMachineState?.translated.name,
  );
  const statusTechnicalName = computed(
    () => _sharedOrder.value?.stateMachineState?.technicalName,
  );

  async function handlePayment(finishUrl?: string, errorUrl?: string) {
    const resp = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        body: {
          orderId: orderId.value,
          finishUrl,
          errorUrl,
        },
      },
    );

    paymentUrl.value = resp.data.redirectUrl;
  }

  async function cancel() {
    const resp = await apiClient.invoke(
      "cancelOrder post /order/state/cancel",
      {
        body: {
          orderId: orderId.value,
        },
      },
    );

    await updateOrder();

    return resp.data;
  }

  async function changePaymentMethod(paymentMethodId: string) {
    const response = await apiClient.invoke(
      "orderSetPayment post /order/payment",
      {
        body: {
          orderId: orderId.value,
          paymentMethodId: paymentMethodId,
        },
      },
    );

    await updateOrder();
    return response.data;
  }

  const hasDocuments = computed(() => !!_sharedOrder.value?.documents.length);
  const documents = computed(() => _sharedOrder.value?.documents || []);

  const getPaymentMethods = async () => {
    const response = await apiClient.invoke(
      "readPaymentMethod post /payment-method",
      {
        body: { onlyAvailable: true },
      },
    );
    return response.data.elements || [];
  };

  const updateOrder = async () => {
    const order = await loadOrderDetails({
      keyValue: orderId.value,
    });

    if (order) {
      _sharedOrder.value = order;
    }
  };

  return {
    order: computed(() => _sharedOrder.value),
    status,
    statusTechnicalName,
    total,
    subtotal,
    shippingCosts,
    shippingAddress,
    billingAddress,
    personalDetails,
    paymentUrl,
    shippingMethod,
    paymentMethod,
    hasDocuments,
    documents,
    handlePayment,
    cancel,
    changePaymentMethod,
    getPaymentMethods,
    asyncSetData,
  };
}
