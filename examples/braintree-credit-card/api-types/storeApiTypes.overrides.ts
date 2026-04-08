import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type operations = {
  "handlePaymentMethod post /handle-payment": {
    contentType?: "application/json";
    accept?: "application/json";
    body: {
      /** URL to which the client should be redirected after erroneous payment */
      errorUrl?: string;
      /** URL to which the client should be redirected after successful payment */
      finishUrl?: string;
      /** Identifier of an order */
      orderId: string;
      /** Braintree payment nonce */
      braintreeNonce?: string;
      /** Braintree device data for fraud protection */
      braintreeDeviceData?: string;
    };
    response: {
      redirectUrl: string;
    };
    responseCode: 200;
  };
};
