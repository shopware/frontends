import { createAPIClient } from "@shopware/api-client";
import type { operations } from "#shopware";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations>({
  baseURL: import.meta.env.VITE_DEMO_API_URL,
  accessToken: import.meta.env.VITE_DEMO_API_ACCESS_TOKEN,
  contextToken: Cookies.get("sw-context-token"),
});
