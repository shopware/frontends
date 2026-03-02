import { defu } from "defu";
import { computed, inject, provide, ref } from "vue";
import type { ComputedRef, Ref } from "vue";
import { useDefaultOrderAssociations, useShopwareContext } from "#imports";
import type { Schemas, operations } from "#shopware";

export type UseOrderDetailsOptions = {
  /**
   * When true, the first parameter is treated as a deep link code
   * instead of an order ID. This enables fetching orders for guest
   * users who are not logged in.
   */
  isGuestOrder?: boolean;
};

export type UseOrderDetailsReturn = {
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
   * Returns current selected shipping method for the order. Last element in delivery array.
   */
  shippingMethod: ComputedRef<Schemas["ShippingMethod"] | undefined | null>;
  /**
   * Returns current selected payment method for the order. Last element in transactions array.
   */
  paymentMethod: ComputedRef<Schemas["PaymentMethod"] | undefined | null>;
  /**
   * Get order object including additional associations.
   * useDefaults describes what order object should look like.
   */
  loadOrderDetails(): Promise<Schemas["OrderRouteResponse"]>;
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
   * Get media content
   *
   * @param {string} downloadId
   * @returns {Blob}
   */
  getMediaFile: (downloadId: string) => Promise<Blob>;
  /**
   * Get order documents
   * @param {string} documentId
   * @param {string} deepLinkCode
   * @returns Binary document content (PDF, HTML, or XML)
   */
  getDocumentFile: (
    documentId: string,
    deepLinkCode: string,
  ) => Promise<Blob | string>;
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

  paymentChangeable: ComputedRef<boolean>;
};

/**
 * Composable for managing an existing order.
 * @public
 * @category Customer & Account
 */
export function useOrderDetails(
  orderId: string,
  associations?: Schemas["Criteria"]["associations"],
  options?: UseOrderDetailsOptions,
): UseOrderDetailsReturn {
  const { apiClient } = useShopwareContext();

  const paymentChangeableList: Ref<{ [key: string]: boolean }> = ref({});
  const _sharedOrder = inject<Ref<Schemas["Order"] | undefined>>(
    "swOrderDetails",
    ref(),
  );
  provide("swOrderDetails", _sharedOrder);

  const orderAssociations = useDefaultOrderAssociations();

  const paymentMethod = computed(() => {
    const transactions = _sharedOrder.value?.transactions;
    if (!transactions?.length) return undefined;
    return transactions[transactions.length - 1]?.paymentMethod;
  });

  const shippingMethod = computed(() => {
    const deliveries = _sharedOrder.value?.deliveries;
    if (!deliveries?.length) return undefined;
    return deliveries[deliveries.length - 1]?.shippingMethod;
  });

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

  async function loadOrderDetails() {
    const mergedAssociations = defu(
      orderAssociations,
      associations ? associations : {},
    );

    const baseParams = {
      associations: mergedAssociations,
      checkPromotion: true,
    };

    const params: operations["readOrder post /order"]["body"] =
      options?.isGuestOrder
        ? {
            ...baseParams,
            filter: [
              {
                field: "deepLinkCode",
                type: "equals",
                value: orderId,
              },
            ],
          }
        : {
            ...baseParams,
            ids: [orderId],
          };

    const orderDetailsResponse = await apiClient.invoke(
      "readOrder post /order",
      {
        body: params,
      },
    );
    _sharedOrder.value =
      orderDetailsResponse.data.orders?.elements?.[0] ?? undefined;
    paymentChangeableList.value =
      orderDetailsResponse.data.paymentChangeable ?? {};
    return orderDetailsResponse.data;
  }

  async function handlePayment(finishUrl?: string, errorUrl?: string) {
    const resp = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        body: {
          orderId,
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
          orderId,
        },
      },
    );
    await loadOrderDetails();
    return resp.data;
  }
  async function changePaymentMethod(paymentMethodId: string) {
    const response = await apiClient.invoke(
      "orderSetPayment post /order/payment",
      {
        body: {
          orderId: orderId,
          paymentMethodId: paymentMethodId,
        },
      },
    );

    await loadOrderDetails();
    return response.data;
  }

  async function getMediaFile(downloadId: string) {
    const response = await apiClient.invoke(
      "orderDownloadFile get /order/download/{orderId}/{downloadId}",
      {
        accept: "application/octet-stream",
        pathParams: {
          orderId,
          downloadId,
        },
      },
    );

    return response.data;
  }

  async function getDocumentFile(
    documentId: string,
    deepLinkCode: string,
  ): Promise<Blob | string> {
    const response = await apiClient.invoke(
      "download post /document/download/{documentId}/{deepLinkCode}",
      {
        pathParams: {
          documentId,
          deepLinkCode,
        },
        accept: "application/pdf",
      },
    );

    return response.data;
  }

  const hasDocuments = computed(() => !!_sharedOrder.value?.documents.length);
  const documents = computed(() => _sharedOrder.value?.documents || []);

  const paymentChangeable = computed(() => {
    return paymentChangeableList.value?.[orderId as string] ?? false;
  });

  const getPaymentMethods = async () => {
    const response = await apiClient.invoke(
      "readPaymentMethod post /payment-method",
      {
        body: { onlyAvailable: true },
      },
    );
    return response.data.elements || [];
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
    loadOrderDetails,
    handlePayment,
    cancel,
    changePaymentMethod,
    getMediaFile,
    getDocumentFile,
    paymentChangeable,
    getPaymentMethods,
  };
}
