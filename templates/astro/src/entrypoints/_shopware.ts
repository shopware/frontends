import type { App } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import Cookies from "js-cookie";

import { createAPIClient } from "@shopware/api-client";
import type {
  operationPaths,
  operations,
} from "@shopware/api-client/api-types";

export default (app: App) => {
  const apiInstance = createAPIClient<operations, operationPaths>({
    baseURL:
      import.meta.env.API_URL ||
      "https://demo-frontends.shopware.store/store-api",
    accessToken:
      import.meta.env.API_ACCESS_TOKEN || "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    contextToken: Cookies.get("sw-context-token"),
    onContextChanged(newContextToken: string) {
      Cookies.set("sw-context-token", newContextToken, {
        expires: 365, // days
        path: "/",
        sameSite: "lax",
      });
    },
  });

  // create a Shopware context plugin and inject it to the Vue app
  const shopwareContext = createShopwareContext(app, {
    devStorefrontUrl: null,
  });
  // register a plugin
  app.provide("apiClient", apiInstance);
  app.use(shopwareContext);
};
