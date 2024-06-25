import { createAPIClient } from "@shopware/api-client";
import type { operations } from "#shopware";
import Cookies from "js-cookie";

const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api";

export const apiClient = createAPIClient<operations>({
  baseURL: shopwareEndpoint,
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
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

// predefine navigation loading method with depth settings
export const readNavigation = (
  activeId: string,
  rootId: string,
  params: operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"],
) =>
  apiClient.invoke("readNavigation post /navigation/{activeId}/{rootId}", {
    pathParams: {
      activeId,
      rootId,
    },
    body: {
      depth: 2,
      ...params,
    },
  });
