import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type Schemas = {};

export type operations = {
  "handlePaymentMethod post /handle-payment": {
    contentType?: "application/json";
    accept?: "application/json";
    query?: {
      isPayPalExpressCheckout?: boolean;
      paypalOrderId?: string;
    };
    body: {
      /** URL to which the client should be redirected after erroneous payment */
      errorUrl?: string;
      /** URL to which the client should be redirected after successful payment */
      finishUrl?: string;
      /** Identifier of an order */
      orderId: string;
    };
    response: {
      redirectUrl: string;
    };
    responseCode: 200;
  };
  "payPalCreateOrder post /paypal/express/create-order": {
    contentType?: "application/json";
    accept?: "application/json";
    response: {
      token: string;
    };
    responseCode: 200;
  };
  "payPalPrepare post /paypal/express/prepare-checkout": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      token: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
};
