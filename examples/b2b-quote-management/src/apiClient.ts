import { createAPIClient } from "@shopware/api-client";
import type { extendedPaths, extendedOperations } from "#shopware";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<extendedOperations, extendedPaths>({
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
