import { createAPIClient } from "@shopware/api-client";
import type { operationPaths, operations } from "#shopware";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations, operationPaths>({
  baseURL: "https://demo-frontends.shopware.store/store-api",
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  contextToken: Cookies.get("sw-context-token"),
  onContextChanged(newContextToken) {
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
    });
  },
});
