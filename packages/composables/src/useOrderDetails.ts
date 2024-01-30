import { computed, ref, inject, provide } from "vue";
import type { ComputedRef, Ref } from "vue";
import { defu } from "defu";
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

/**
 * Data for api requests to fetch all necessary data
 */
const orderAssociations: Schemas["Criteria"] = {
  associations: {
    lineItems: {
      associations: {
        cover: {},
        downloads: {
          associations: {
            media: {},
          },
        },
      },
    },
    addresses: {},
    deliveries: {
      associations: {
        shippingMethod: {},
      },
    },
    transactions: {
      associations: {
        paymentMethod: {},
      },
      sort: "-createdAt",
    },
  },
};

export type UseOrderDetailsReturn = {
  /**
   * {@link Schemas['Order']} object
   */
  order: ComputedRef<Schemas["Order"] | undefined | null>;
  /**
   * Order status (e.g. 'open', 'cancelled')
   */
  status: ComputedRef<string | undefined>;
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
   * Get order object including additional associations.
   * useDefaults describes what order object should look like.
   */
  loadOrderDetails(): Promise<void>;
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
  cancel(): Promise<void>;
  /**
   * Changes the payment method for current cart.
   * @param paymentMethodId - ID of the payment method to be set
   * @returns
   */
  changePaymentMethod(paymentMethodId: string): Promise<void>;
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
   * @returns
   */
  getDocumentFile: (
    documentId: string,
    deepLinkCode: string,
  ) => Promise<Schemas["Document"]>;
  /**
   * Check if order has documents
   */
  hasDocuments: ComputedRef<boolean>;
  /**
   * Get order documents
   */
  documents: ComputedRef<Schemas["Document"][]>;
};

/**
 * Composable for managing an existing order.
 * @public
 * @category Customer & Account
 */
export function useOrderDetails(
  orderId: string,
  associations?: Schemas["Criteria"]["associations"],
): UseOrderDetailsReturn {
  const { apiClient } = useShopwareContext();

  const _sharedOrder = inject<Ref<Schemas["Order"] | undefined>>(
    "swOrderDetails",
    ref(),
  );
  provide("swOrderDetails", _sharedOrder);

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
  const status = computed(() => _sharedOrder.value?.stateMachineState?.name);

  async function loadOrderDetails() {
    const mergedAssociations = defu(
      orderAssociations,
      associations ? associations : {},
    );
    const params = defu(mergedAssociations, {
      filter: [
        {
          type: "equals",
          field: "id",
          value: orderId,
        },
      ],
    }) as Schemas["Criteria"];

    const orderDetailsResponse = await apiClient.invoke(
      "readOrder post /order",
      params,
    );
    _sharedOrder.value = orderDetailsResponse.orders.elements?.[0] ?? null;
  }

  async function handlePayment(
    finishUrl?: string,
    errorUrl?: string,
    paymentDetails?: unknown,
  ) {
    const resp = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        orderId,
        finishUrl,
        errorUrl,
        // paymentDetails?: unknown, TODO: is this necessary? If yes - add to schema, if no - remove
      },
    );

    paymentUrl.value = resp.redirectUrl;
  }

  async function cancel() {
    await apiClient.invoke("cancelOrder post /order/state/cancel", {
      orderId: orderId,
    });
    await loadOrderDetails();
  }
  async function changePaymentMethod(paymentMethodId: string) {
    await apiClient.invoke("orderSetPayment post /order/payment", {
      orderId: orderId,
      paymentMethodId: paymentMethodId,
    });

    await loadOrderDetails();
  }

  async function getMediaFile(downloadId: string) {
    const response = await apiClient.invoke(
      "orderDownloadFile get /order/download/{orderId}/{downloadId}",
      {
        orderId,
        downloadId,
      },
    );

    return response;
  }

  async function getDocumentFile(documentId: string, deepLinkCode: string) {
    const response = await apiClient.invoke(
      "download post /document/download/{documentId}/{deepLinkCode}",
      {
        documentId,
        deepLinkCode,
      },
    );

    return response;
  }

  const hasDocuments = computed(() => !!_sharedOrder.value?.documents.length);
  const documents = computed(() => _sharedOrder.value?.documents || []);

  return {
    order: computed(() => _sharedOrder.value),
    status,
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
  };
}
