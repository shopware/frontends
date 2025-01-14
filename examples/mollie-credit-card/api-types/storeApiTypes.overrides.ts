import type { components as coreComponents } from "./storeApiTypes";

export type components = coreComponents & {
  schemas: Schemas;
};

export type Schemas = {
  MollieCreditCard: {
    token: string;
  };
};

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
  "readEmployee get /employee/{id}": {
    contentType?: "application/json";
    accept?: "application/json";
    pathParams: {
      /** Identifier of the employee to be fetched */
      id: string;
    };
    response: components["schemas"]["B2bEmployee"];
    responseCode: 200;
  };
};
