import { createAPIClient } from "@shopware/api-client";
import {
  operationPaths,
  operations,
  components,
} from "@shopware/api-client/api-types/apiTypes-6.4.20.0";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations, operationPaths>({
  baseURL: "https://demo-frontends.shopware.store/store-api",
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  contextToken: Cookies.get("sw-context-token"),
  apiType: "store-api",
  onContextChanged(newContextToken) {
    console.error("changed token", newContextToken);
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
    });
  },
});

export type Schemas = components["schemas"];
