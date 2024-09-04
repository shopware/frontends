/**
 * Commerce composable
 */
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

type UseB2bQuoteManagement = {
  getQuoteList: () => Promise<Schemas["Quote"][]>;
  getQuote: (quoteId: string) => Promise<Schemas["Quote"]>;
  declineQuote: (quoteId: string, comment: string) => Promise<void>;
  requestChangeQuote: (quoteId: string, comment: string) => Promise<void>;
  requestQuote: (comment: string) => Promise<Schemas["Quote"]>;
  createOrderFromQuote: (
    quoteId: string,
    comment: string,
  ) => Promise<Schemas["Order"]>;
  changeShippingMethod: (
    quoteId: string,
    shippingMethodId: string,
  ) => Promise<void>;
  changePaymentMethod: (
    quoteId: string,
    paymentMethodId: string,
  ) => Promise<void>;
};

export type ChangePaymentShippingMethodParams = {
  quoteId: string;
  paymentMethodId?: string;
  shippingMethodId?: string;
};

/**
 * Composable to manage quotes in the B2BQuote module.
 *
 * With this composable you can:
 * - Get list of quotes
 * - Get quote details
 * - Decline quote
 * - Request change of the quote
 * - Change shipping method
 * - Change payment method
 * - Create order from quote
 * - Request quote
 *
 * @category B2B
 * @returns {UseB2bQuoteManagement}
 */
export function useB2bQuoteManagement(): UseB2bQuoteManagement {
  const { apiClient } = useShopwareContext();

  /**
   * Get list of quotes
   *
   * @returns {Promise<Schemas["Quote"][]>}
   */
  const getQuoteList = async () => {
    const response = await apiClient.invoke("readQuotes post /quotes");
    return response.data.elements ?? [];
  };

  /**
   * Get quote details
   *
   * @param {string} quoteId
   * @returns {Promise<Schemas["Quote"]>}
   */
  const getQuote = async (quoteId: string) => {
    const response = await apiClient.invoke(
      "readQuote post /quote/detail/{id}",
      {
        pathParams: {
          id: quoteId,
        },
        body: {
          associations: {
            lineItems: {},
            comments: {},
            stateMachineState: {},
          },
        },
      },
    );
    return response.data;
  };

  /**
   * Decline quote
   *
   * @param {string} quoteId
   * @param {string} comment
   * @returns {Promise<void>}
   */
  async function declineQuote(quoteId: string, comment: string) {
    await apiClient.invoke("declineQuote post /quote/{id}/decline", {
      pathParams: {
        id: quoteId,
      },
      body: {
        comment,
      },
    });
  }

  /**
   * Request change of the quote
   *
   * @param {string} quoteId
   * @param {string} comment
   * @returns {Promise<void>}
   */
  async function requestChangeQuote(quoteId: string, comment: string) {
    await apiClient.invoke(
      "requestChangeQuote post /quote/{id}/request-change",
      {
        pathParams: {
          id: quoteId,
        },
        body: { comment },
      },
    );
  }

  /**
   * Quote is built from the cart.
   * If Cart is empty, the request will returns 400 Bad Request
   *
   * @param {string} comment
   * @returns {Promise<Schemas["Quote"]>}
   */
  const requestQuote = async (comment: string) => {
    const response = await apiClient.invoke(
      "requestQuote post /quote/request",
      { body: { comment } },
    );
    return response.data;
  };

  /**
   * Change payment or shipping method
   *
   * @param {ChangePaymentShippingMethodParams} params
   *
   * @returns {Promise<void>}
   */
  const changePaymentShippingMethod = async (params: {
    quoteId: string;
    paymentMethodId?: string;
    shippingMethodId?: string;
  }) => {
    const body: {
      paymentMethodId?: string;
      shippingMethodId?: string;
    } = {};

    if (params.paymentMethodId) body.paymentMethodId = params.paymentMethodId;

    if (params.shippingMethodId)
      body.shippingMethodId = params.shippingMethodId;

    await apiClient.invoke(
      "switchPaymentOrShippingMethod post /quote/{id}/configure",
      {
        pathParams: { id: params.quoteId },
        body,
      },
    );
  };

  /**
   * Proxy method to change shipping method
   *
   * @param quoteId
   * @param shippingMethodId
   * @returns {Promise<void>}
   */
  async function changeShippingMethod(
    quoteId: string,
    shippingMethodId: string,
  ) {
    await changePaymentShippingMethod({ quoteId, shippingMethodId });
  }

  /**
   * Proxy method that changes payment method
   *
   * @param quoteId
   * @param paymentMethodId
   * @returns {Promise<void>}
   */
  async function changePaymentMethod(quoteId: string, paymentMethodId: string) {
    await changePaymentShippingMethod({ quoteId, paymentMethodId });
  }

  /**
   * Create order from quote
   *
   * @param quoteId
   * @param comment
   *
   * @returns {Promise<Schemas["Order"]>}
   */
  const createOrderFromQuote = async (quoteId: string, comment: string) => {
    const response = await apiClient.invoke(
      "createOrderFromQuote post /quote/order/{id}",
      {
        pathParams: { id: quoteId },
        body: { customerComment: comment },
      },
    );

    return response.data;
  };

  return {
    getQuoteList,
    getQuote,
    declineQuote,
    requestChangeQuote,
    changeShippingMethod,
    changePaymentMethod,
    requestQuote,
    createOrderFromQuote,
  };
}
