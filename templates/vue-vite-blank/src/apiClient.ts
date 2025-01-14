import { createAPIClient } from "@shopware/api-client";
import Cookies from "js-cookie";
import type { operations } from "#shopware";

const shopwareEndpoint = import.meta.env.VITE_DEMO_API_URL;

export const apiClient = createAPIClient<operations>({
  baseURL: shopwareEndpoint,
  accessToken: import.meta.env.VITE_DEMO_API_ACCESS_TOKEN,
  contextToken: Cookies.get("sw-context-token"),
});

apiClient.hook("onContextChanged", (newContextToken) => {
  Cookies.set("sw-context-token", newContextToken, {
    expires: 365, // days
    path: "/",
    sameSite: "lax",
    secure: shopwareEndpoint.startsWith("https://"),
  });
});
