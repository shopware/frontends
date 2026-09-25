import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";
import { createShopwareContext } from "@shopware/composables";
import Cookies from "js-cookie";
// ./plugins/vue-shopware-frontends.ts file
import { ref } from "vue";
import type { App } from "vue";

// Types to be used during the registration of the plugin to pass basic credentials for your Shopware 6 instance.
export type ShopwareFrontendsOptions = {
  endpoint: string;
  accessToken: string;
  shopwareApiClient?: {
    timeout: number;
  };
  enableDevtools?: boolean;
};

export default {
  install: (app: App, options: ShopwareFrontendsOptions) => {
    const cookieContextToken = Cookies.get("sw-context-token");
    const cookieLanguageId = Cookies.get("sw-language-id");

    const contextToken = ref(cookieContextToken);
    const languageId = ref(cookieLanguageId);

    const apiClient = createAPIClient<operations>({
      baseURL: options.endpoint,
      accessToken: options.accessToken,
      contextToken: contextToken.value,
      fetchOptions: {
        timeout: options.shopwareApiClient?.timeout || 5000,
      },
      defaultHeaders: {
        "sw-language-id": languageId.value,
      },
    });

    const shopwareContext = createShopwareContext(app, {
      enableDevtools: !!options.enableDevtools,
    });

    app.provide("apiClient", apiClient);
    app.provide("shopware", shopwareContext);
    app.provide("swSessionContext", ref());
  },
};
