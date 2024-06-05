import { createAdminAPIClient } from "@shopware/api-client";
import type {
  operations,
  components,
} from "@shopware/api-client/admin-api-types";
import Cookies from "js-cookie";

export const adminApiClient = createAdminAPIClient<operations>({
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

// predefine navigation loading method with depth settings
export async function login(params: {
  username: string;
  password: string;
}): Promise<operations["token post /oauth/token"]["response"]> {
  const result = await adminApiClient.invoke("token post /oauth/token", {
    body: {
      grant_type: "password",
      client_id: "administration",
      scopes: "write",
      ...params,
    },
  });
  return result.data;
}
