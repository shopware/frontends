import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type Schemas = {};

export type operations = {
  "payPalCreateOrder post /store-api/paypal/express/create-order": {
    contentType?: "application/json";
    accept?: "application/json";
    query: {
      isPayPalExpressCheckout: "1";
    };
    response: {
      token: string;
    };
    responseCode: 200;
  };
  "payPalPrepare post /store-api/paypal/express/prepare-checkout": {
    contentType?: "application/json";
    accept?: "application/json";
    query: {
      isPayPalExpressCheckout: "1";
    };
    body: {
      token: string;
    };
    response: components["schemas"]["SuccessResponse"];
    responseCode: 200;
  };
};
