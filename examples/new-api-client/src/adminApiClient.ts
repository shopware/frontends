import {
  RequestParameters,
  RequestReturnType,
  createAdminAPIClient,
} from "@shopware/api-client";
import type {
  operationPaths,
  operations,
  components,
} from "@shopware/api-client/admin-api-types";
import Cookies from "js-cookie";

export const adminApiClient = createAdminAPIClient<operations, operationPaths>({
  baseURL: "https://demo-frontends.shopware.store/api",
  sessionData: JSON.parse(Cookies.get("sw-admin-session-data") || "{}"),
  onAuthChange(sessionData) {
    Cookies.set("sw-admin-session-data", JSON.stringify(sessionData), {
      expires: 1, // days
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

// predefine navigation loading method with depth settings
export const login = (params: {
  username: string;
  password: string;
}): Promise<ApiReturnType<"token">> => {
  return adminApiClient.invoke("token post /oauth/token", {
    grant_type: "password",
    client_id: "administration",
    scopes: "write",
    ...params,
  });
};
