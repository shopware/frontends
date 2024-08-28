import type { App } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import Cookies from "js-cookie";

import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";

export default (app: App) => {
  const shopwareEndpoint =
    import.meta.env.API_URL ||
    "https://demo-frontends.shopware.store/store-api";

  const apiClient = createAPIClient<operations>({
    baseURL: shopwareEndpoint,
    accessToken:
      import.meta.env.API_ACCESS_TOKEN || "SWSCBHFSNTVMAWNZDNFKSHLAYW",
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

  // create a Shopware context plugin and inject it to the Vue app
  const shopwareContext = createShopwareContext(app, {
    devStorefrontUrl: null,
  });
  // register a plugin
  app.provide("apiClient", apiClient);
  app.use(shopwareContext);
};
