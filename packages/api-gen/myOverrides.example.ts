import { components as mainComponents } from "./apiSchema";

// TODO: move this as example and remove this file

export type components = mainComponents & {
  schemas: schemas;
};

export type schemas = {
  CustomerAddress: {
    qwe: string;
  };
};

export type operations = {
  "aaaCompletlyNewCustomOperation post /aaaaa/bbbbb":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        body: components["schemas"]["CustomerAddress"];
        response: components["schemas"]["AdvancedSearchBoosting"];
        responseCode: 201;
      }
    | {
        contentType: "application/json2";
        accept?: "application/json";
        body: {
          someting: boolean;
        };
        response: {
          thisIs200Response: string;
        };
        responseCode: 200;
      };
  "updateCustomerAddress patch /account/address/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    /**
     * We're testing overrides, assuming update address can only update the city
     */
    body: {
      city: string;
    };
    response: components["schemas"]["CustomerAddress"];
    responseCode: 200;
  };
};
