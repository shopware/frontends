import { computed, ComputedRef, Ref, ref, inject, provide } from "vue";
import {
  Order,
  BillingAddress,
  ShippingAddress,
  ShippingMethod,
  PaymentMethod,
  ShopwareSearchParams,
  OrderDocument,
  ShopwareAssociation
} from "@shopware-pwa/types";
import {
  cancelOrder,
  changeOrderPaymentMethod,
  getOrderDetails,
  handlePayment as apiHandlePayment,
  getOrderDownloads,
  getDocumentDownload,
} from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";
import deepMerge from "./helpers/deepMerge";

/**
 * Data for api requests to fetch all necessary data
 */
const orderAssociations: ShopwareSearchParams = {
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
   * {@link Order} object
   */
  order: ComputedRef<Order | undefined | null>;
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
  shippingAddress: ComputedRef<ShippingAddress | undefined>;
  /**
   * Billing address
   */
  billingAddress: ComputedRef<BillingAddress | undefined>;
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
  shippingMethod: ComputedRef<ShippingMethod | undefined | null>;
  /**
   * Selected payment method
   */
  paymentMethod: ComputedRef<PaymentMethod | undefined | null>;
  /**
   * Get order object including additional associations.
   * useDefaults describes what order object should look like.
   */
  loadOrderDetails(): void;
  /**
   * Handle payment for existing error.
   *
   * Pass custom success and error URLs (optionally).
   */
  handlePayment(
    successUrl?: string,
    errorUrl?: string,
    paymentDetails?: unknown
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
  getDocumentFile: (documentId: string, deepLinkCode: string) => Promise<Blob>;
  /**
   * Check if order has documents
   */
  hasDocuments: ComputedRef<boolean>;
  /**
   * Get order documents
   */
  documents: ComputedRef<OrderDocument[]>;
};

/**
 * Composable for managing an existing order.
 * @public
 * @category Customer & Account
 */
export function useOrderDetails(orderId: string, associations?: ShopwareAssociation): UseOrderDetailsReturn {
  const { apiInstance } = useShopwareContext();

  const _sharedOrder = inject("swOrderDetails", ref());
  provide("swOrderDetails", _sharedOrder);

  const paymentMethod = computed(
    () => _sharedOrder.value?.transactions?.[0]?.paymentMethod
  );
  const shippingMethod = computed(
    () => _sharedOrder.value?.deliveries?.[0]?.shippingMethod
  );
  const paymentUrl = ref();

  const personalDetails = computed(() => ({
    email: _sharedOrder.value?.orderCustomer?.email,
    firstName: _sharedOrder.value?.orderCustomer?.firstName,
    lastName: _sharedOrder.value?.orderCustomer?.lastName,
  }));
  const billingAddress = computed(() =>
    _sharedOrder.value?.addresses?.find(
      ({ id }: { id: string }) =>
        id === (_sharedOrder.value as Order).billingAddressId
    )
  );
  const shippingAddress = computed(
    () => _sharedOrder.value?.deliveries?.[0]?.shippingOrderAddress
  );

  const shippingCosts = computed(() => _sharedOrder.value?.shippingTotal);
  const subtotal = computed(() => _sharedOrder.value?.price?.positionPrice);
  const total = computed(() => _sharedOrder.value?.price?.totalPrice);
  const status = computed(() => _sharedOrder.value?.stateMachineState?.name);

  async function loadOrderDetails() {
    const orderDetailsResponse = await getOrderDetails(
      orderId,
      deepMerge(orderAssociations, associations? associations: {}),
      apiInstance
    );
    _sharedOrder.value = orderDetailsResponse ?? null;
  }

  async function handlePayment(
    finishUrl?: string,
    errorUrl?: string,
    paymentDetails?: unknown
  ) {
    const resp = await apiHandlePayment(
      {
        orderId,
        finishUrl,
        errorUrl,
        paymentDetails,
      },
      apiInstance
    );

    paymentUrl.value = resp?.redirectUrl;
  }

  async function cancel() {
    const response = await cancelOrder(orderId, apiInstance);
    await loadOrderDetails();
  }
  async function changePaymentMethod(paymentMethodId: string) {
    await changeOrderPaymentMethod(orderId, paymentMethodId, apiInstance);

    await loadOrderDetails();
  }

  async function getMediaFile(downloadId: string) {
    const response = await getOrderDownloads(
      {
        orderId,
        downloadId,
      },
      apiInstance
    );

    return response;
  }

  async function getDocumentFile(documentId: string, deepLinkCode: string) {
    const response = await getDocumentDownload(
      {
        documentId,
        deepLinkCode,
      },
      apiInstance
    );

    return response;
  }

  const hasDocuments = computed(() => !!_sharedOrder.value.documents.length);
  const documents = computed(() => _sharedOrder.value.documents);

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
