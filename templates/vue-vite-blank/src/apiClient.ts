import { createAPIClient } from "@shopware/api-client";
import type { operationPaths, operations } from "#shopware";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations, operationPaths>({
  baseURL: import.meta.env.VITE_DEMO_API_URL,
  accessToken: import.meta.env.VITE_DEMO_API_ACCESS_TOKEN,
  contextToken: Cookies.get("sw-context-token"),
  onContextChanged(newContextToken) {
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
    });
  },
});
