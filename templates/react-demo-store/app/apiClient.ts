import {
  RequestParameters,
  RequestReturnType,
  createAPIClient,
} from "@shopware/api-client";

import {
  operationPaths,
  operations,
  components,
} from "@shopware/api-client/api-types";

import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations, operationPaths>({
  baseURL: "https://demo-frontends.shopware.store/store-api",
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  contextToken: Cookies.get("sw-context-token"),
  apiType: "store-api",
  onContextChanged(newContextToken) {
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365,
      path: "/",
      sameSite: "lax",
    });
  },
});

export type ApiSchemas = components["schemas"];
export type ApiRequestParams<OPERATION_NAME extends keyof operations> =
  RequestParameters<OPERATION_NAME, operations>;
export type ApiReturnType<OPERATION_NAME extends keyof operations> =
  RequestReturnType<OPERATION_NAME, operations>;
