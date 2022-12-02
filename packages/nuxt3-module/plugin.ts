// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { defineNuxtPlugin } from "#app";
import {
  createShopwareContext,
  getDefaultApiParams,
} from "@shopware-pwa/composables-next";
import { createInstance } from "@shopware-pwa/api-client";
import { ref } from "vue";

const ShopwarePlugin = {
  install(app, options) {
    const contextToken = useCookie("sw-context-token", {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "Lax",
      path: "/",
    });
    const languageId = useCookie("sw-language-id", {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "Lax",
      path: "/",
    });

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
      contextToken: contextToken.value,
      languageId: languageId.value,
    });
    /**
     * Save current contextToken when its change
     */
    instance.onConfigChange(({ config }) => {
      try {
        contextToken.value = config.contextToken;
        languageId.value = config.languageId;
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
