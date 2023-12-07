import { RequestParameters, createAPIClient } from "@shopware/api-client";
import type { operationPaths, operations } from "#shopware";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations, operationPaths>({
  baseURL: "https://demo-frontends.shopware.store/store-api",
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  contextToken: Cookies.get("sw-context-token"),
  onContextChanged(newContextToken) {
    console.error("changed token", newContextToken);
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
    });
  },
});

// predefine navigation loading method with depth settings
export const readNavigation = (params: RequestParameters<"readNavigation">) =>
  apiClient.invoke(
    "readNavigation post /navigation/{activeId}/{rootId} sw-include-seo-urls",
    {
      depth: 2,
      ...params,
    },
  );
