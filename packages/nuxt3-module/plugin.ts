// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { defineNuxtPlugin } from "#app";
import {
  createShopwareContext,
  getDefaultApiParams,
} from "@shopware-pwa/composables-next";
import { createInstance } from "@shopware-pwa/api-client";
import { ref } from "vue";
import Cookies from "js-cookie";

const ShopwarePlugin = {
  install(app, options) {
    const cookieContextToken = Cookies.get("sw-context-token");
    const cookieLanguageId = Cookies.get("sw-language-id");

    const instance = createInstance({
      endpoint: "<%= options.shopwareEndpoint %>",
      accessToken: "<%= options.shopwareAccessToken %>",
      timeout: "<%= options.shopwareApiClient.timeout %>",
      auth: {
        username:
          "<%= options.shopwareApiClient.auth ? options.shopwareApiClient.auth.username : undefined %>",
        password:
          "<%=  options.shopwareApiClient.auth ? options.shopwareApiClient.auth.password : undefined %>",
      },
      contextToken: cookieContextToken,
      languageId: cookieLanguageId,
    });
    /**
     * Save current contextToken when its change
     */
    instance.onConfigChange(({ config }) => {
      try {
        Cookies.set("sw-context-token", config.contextToken || "", {
          expires: 365, //days
          sameSite: "Lax",
          path: "/",
        });
        Cookies.set("sw-language-id", config.contextToken || "", {
          expires: 365, //days
          sameSite: "Lax",
          path: "/",
        });
      } catch (e) {
        // Sometimes cookie is set on server after request is send, it can fail silently
      }
    });
    const shopwareContext = createShopwareContext(app, {
      apiInstance: instance,
      enableDevtools: true,
      shopwareDefaults: options.apiDefaults,
    });
    app.provide("shopware", shopwareContext);
    const sessionContextData = ref();
    app.provide("swSessionContext", sessionContextData);
    // in case someone tries to use it in nuxt specific code like middleware
    useState("swSessionContext", () => sessionContextData);
  },
};

export default defineNuxtPlugin(async (nuxtApp) => {
  const newConfig = getDefaultApiParams();
  // newConfig.add("useOrderDetails.associations",{
  //   "lineItems": {
  //     "associations": {
  //         "cover": {}
  //     }
  // }
  // });
  nuxtApp.vueApp.use(ShopwarePlugin, {
    apiDefaults: newConfig,
  });
});
