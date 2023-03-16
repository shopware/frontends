import { defaultInstance, ShopwareApiInstance } from "../apiService";
import {
  getCheckoutOrderEndpoint,
  handlePaymentEndpoint,
  getCustomerOrderEndpoint,
  getCancelOrderEndpoint,
  getChangeOrderPaymentMethodEndpoint,
} from "../endpoints";
import {
  CreateOrderParams,
  Order,
  OrderState,
  ShopwareSearchParams,
} from "@shopware-pwa/types";

/**
 * Creates an order for logged in and guest users
 * 
 * @param params CreateOrderParams
 * @param contextInstance ShopwareApiInstance
 * 
 * @category Checkout
 * @public
 */
export async function createOrder(
  params?: CreateOrderParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Order> {
  const resp = await contextInstance.invoke.post(
    getCheckoutOrderEndpoint(),
    params
  );

  return resp.data;
}

/**
 * @param orderId Id of an order
 * @param finishUrl URL where the customer is redirected to after payment is done
 * @param errorUrl URL where the customer is redirected to after payment fails
 * 
 * @category Checkout
 * @public
 */
export async function handlePayment(
  params: {
    orderId: string;
    finishUrl?: string;
    errorUrl?: string;
    paymentDetails?: unknown;
  },
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<{
  redirectUrl: string | null;
  apiAlias: string;
}> {
  if (!params?.orderId) {
    throw new Error("handlePayment method requires orderId");
  }

  /**
   * save contextToken in sessionStorage when using Webkit
   * https://github.com/vuestorefront/shopware-pwa/pull/1817
   */
  if (navigator?.userAgent.includes("WebKit")) {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(
        "sw-context-token",
        contextInstance.config.contextToken as string
      );
    }
  }

  const resp = await contextInstance.invoke.get(handlePaymentEndpoint(), {
    params,
  });

  return resp.data;
}

/**
 * Get order details
 *
 * @param orderId Id of an order
 * @param params ShopwareSearchParams
 * @param contextInstance - ShopwareApiInstance
 * 
 * @throws ClientApiError
 * @category Checkout
 * @public
 */
export async function getOrderDetails(
  orderId: string,
  params?: ShopwareSearchParams,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Order | undefined> {
  const resp = await contextInstance.invoke.post(
    getCustomerOrderEndpoint(),
    Object.assign({}, params, {
      filter: [
        {
          // filter order's collection by given id
          type: "equals",
          field: "id",
          value: orderId,
        },
      ],
    })
  );
  return resp.data?.orders?.elements?.[0];
}

/**
 * Cancel an order
 * 
 * @param orderId Id of an order
 * @param contextInstance - ShopwareApiInstance
 *
 * @throws ClientApiError
 * @category Checkout
 * @public
 */
export async function cancelOrder(
  orderId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<OrderState> {
  const resp = await contextInstance.invoke.post(getCancelOrderEndpoint(), {
    orderId,
  });
  return resp.data;
}

/**
 * Change payment method for given order
 *
 * @param orderId Id of an order
 * 
 * @throws ClientApiError
 * @category Checkout
 * @public
 */
export async function changeOrderPaymentMethod(
  orderId: string,
  paymentMethodId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<{
  apiAlias: string;
  success: boolean;
}> {
  const resp = await contextInstance.invoke.post(
    getChangeOrderPaymentMethodEndpoint(),
    {
      orderId,
      paymentMethodId,
    }
  );
  return resp.data;
}
