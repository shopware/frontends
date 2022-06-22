// @ts-nocheck
import { defineNuxtPlugin } from "#app";
import { createInstance } from "@shopware-pwa/shopware-6-client";
import { createShopware, getDefaultApiParams } from "@shopware-pwa/composables";
import defaultsConfigBuilder from "@shopware-pwa/nuxt-module/api-defaults";

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
    const shopwareContext = createShopware(app, {
      apiInstance: instance,
      enableDevtools: true,
      shopwareDefaults: options.apiDefaults,
    });
    app.provide("shopware", shopwareContext);
  },
};

export default defineNuxtPlugin(async (nuxtApp) => {
  const newConfig = defaultsConfigBuilder()
  newConfig.add("useOrderDetails.associations",{
    "lineItems": {
      "associations": {
          "cover": {}
      }
  }
  });
  nuxtApp.vueApp.use(ShopwarePlugin, {
    apiDefaults: newConfig.get()
  })
});
