import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type Schemas = {};

export type operations = {
  "mollieSubmitCreditCart post script/mollie/creditcard/store-token/{userId/{token}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      userId: string;
      token: string;
    };
    response: never;
    responseCode: 200;
  };
};
