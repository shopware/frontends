import { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents;

export type Schemas = {};

export type operations = {
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
