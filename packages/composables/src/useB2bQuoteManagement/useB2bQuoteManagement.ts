/**
 * Commerce composable
 */
import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

type UseB2bQuoteManagement = {
  getQuoteList: () => Promise<Schemas["Quote"][]>;
  getQuote: (quoteId: string) => Promise<Schemas["Quote"]>;
  /**
   * @deprecated use `declineQuoteWithComment` instead — it sends the
   * `lineItemId` and `versionId` that `POST /quote/{id}/decline` expects.
   * A `comment`-only body is still accepted at runtime on 6.7.12+: the API
   * schema marks `lineItemId` and `versionId` as required, but the endpoint
   * does not validate the request body, so existing callers keep working.
   * Removed in v2.
   */
  declineQuote: (quoteId: string, comment: string) => Promise<void>;
  declineQuoteWithComment: (
    quoteId: string,
    params: DeclineQuoteParams,
  ) => Promise<void>;
  createDraftQuoteVersion: (quoteId: string) => Promise<string>;
  deleteDraftQuoteVersion: (
    quoteId: string,
    versionId: string,
  ) => Promise<void>;
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

export type DeclineQuoteParams = {
  /** Message content */
  comment: string;
  /** Identifier of the quote line item that owns the new comment */
  lineItemId: string;
  /**
   * Draft version identifier of the quote currently shown in storefront,
   * as returned by `createDraftQuoteVersion`. This is not the `versionId`
   * property of the quote entity.
   */
  versionId: string;
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
 * - Create and delete a storefront draft version of the quote
 * - Decline quote, with or without a line item comment
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
    const response = await apiClient.invoke("readQuote post /quote/{id}", {
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
    });
    return response.data;
  };

  /**
   * Create a temporary draft version of the quote for storefront editing.
   *
   * The returned identifier is the `versionId` that quote write operations
   * expect, for example {@link declineQuoteWithComment}. It is not the
   * `versionId` property of the quote entity.
   *
   * @param {string} quoteId
   * @returns {Promise<string>} draft version identifier
   */
  async function createDraftQuoteVersion(quoteId: string) {
    const response = await apiClient.invoke(
      "createDraftQuoteVersion post /quote/{id}/draft-version",
      {
        pathParams: {
          id: quoteId,
        },
      },
    );

    if (!response.data.versionId) {
      throw new Error(
        `Could not create a draft version for quote "${quoteId}": the API returned no versionId.`,
      );
    }

    return response.data.versionId;
  }

  /**
   * Delete the temporary draft version of the quote.
   *
   * @param {string} quoteId
   * @param {string} versionId draft version identifier returned by {@link createDraftQuoteVersion}
   * @returns {Promise<void>}
   */
  async function deleteDraftQuoteVersion(quoteId: string, versionId: string) {
    await apiClient.invoke(
      "deleteDraftQuoteVersion delete /quote/{id}/draft-version",
      {
        pathParams: {
          id: quoteId,
        },
        body: { versionId },
      },
    );
  }

  /**
   * Decline quote with a comment only.
   *
   * @deprecated use {@link declineQuoteWithComment} instead — it sends the
   * `lineItemId` and `versionId` that `POST /quote/{id}/decline` expects.
   * A `comment`-only body is still accepted at runtime on 6.7.12+: the API
   * schema marks `lineItemId` and `versionId` as required, but the endpoint
   * does not validate the request body, so existing callers keep working.
   * Removed in v2.
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
      // The 6.7.12 schema marks `lineItemId` and `versionId` as required, so a
      // comment-only body no longer matches the generated type. Sent as-is to
      // keep the pre-6.7.12 behaviour of this deprecated method unchanged.
      body: { comment } as DeclineQuoteParams,
    });
  }

  /**
   * Decline quote, attaching the comment to a quote line item in the current
   * draft version.
   *
   * @param {string} quoteId
   * @param {DeclineQuoteParams} params
   * @returns {Promise<void>}
   */
  async function declineQuoteWithComment(
    quoteId: string,
    params: DeclineQuoteParams,
  ) {
    await apiClient.invoke("declineQuote post /quote/{id}/decline", {
      pathParams: {
        id: quoteId,
      },
      body: params,
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
      "createOrderFromQuote post /quote/{id}/order",
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
    declineQuoteWithComment,
    createDraftQuoteVersion,
    deleteDraftQuoteVersion,
    requestChangeQuote,
    changeShippingMethod,
    changePaymentMethod,
    requestQuote,
    createOrderFromQuote,
  };
}
