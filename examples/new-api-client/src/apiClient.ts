import { createAPIClient } from "@shopware/api-client";
import type { operations } from "#shopware";
import Cookies from "js-cookie";

export const apiClient = createAPIClient<operations>({
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
