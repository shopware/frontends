import type { App, Plugin } from "vue";
import { ref } from "vue";
import { createInstance } from "@shopware-pwa/api-client";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import Cookies from "js-cookie";

export type ShopwareFrontendsOptions = {
  shopwareEndpoint: string;
  shopwareAccessToken: string;
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

    const instance = createInstance({
      endpoint: options.shopwareEndpoint,
      accessToken: options.shopwareAccessToken,
      timeout: options.shopwareApiClient?.timeout || 5000,
      contextToken: contextToken.value,
      languageId: languageId.value,
    });

    /**
     * Save current contextToken when its change
     */
    instance.onConfigChange(({ config }) => {
      try {
        Cookies.set("sw-context-token", config.contextToken || "", {
          expires: 365,
          sameSite: "Lax",
          path: "/",
        });
        Cookies.set("sw-language-id", config.languageId || "", {
          expires: 365,
          sameSite: "Lax",
          path: "/",
        });

        contextToken.value = config.contextToken;
        languageId.value = config.languageId;
      } catch (e) {
        // Sometimes cookie is set on server after request is send, it can fail silently
      }
    });

    const shopwareContext = createShopwareContext(app, {
      apiInstance: instance,
      enableDevtools: !!options.enableDevtools,
      devStorefrontUrl: null,
    });

    app.provide("shopware", shopwareContext);
    app.provide("swSessionContext", ref());
  },
} as Plugin;
