import type { App } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next/dist";
import { createInstance } from "@shopware-pwa/api-client";
import Cookies from "js-cookie";

export default (app: App) => {
  // create an API client instance
  const apiInstance = createInstance({
    endpoint: import.meta.env.API_URL,
    accessToken: import.meta.env.API_ACCESS_TOKEN,
    contextToken: Cookies.get("sw-context-token"),
  });

  // react on API client configuration changes like new context token in headers
  apiInstance.onConfigChange(({ config }) => {
    Cookies.set("sw-context-token", config.contextToken || "", {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
    });
  });
  // create a Shopware context plugin and inject it to the Vue app
  const shopwareContext = createShopwareContext(app, {
    apiInstance,
    devStorefrontUrl: null,
  });
  // register a plugin
  app.use(shopwareContext);
};
