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
    const runtimeConfig = useRuntimeConfig();

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

    // workaround for SSG case, where cookies contains additional dot in name, related: https://github.com/shopware/frontends/commit/ee5b8a71e1e016c973a7852efa3b85a136e6ea14
    const cookieContextToken = Cookies.get("sw-context-token");
    const cookieLanguageId = Cookies.get("sw-language-id");

    if (
      !runtimeConfig.public.shopware.shopwareEndpoint ||
      !runtimeConfig.public.shopware.shopwareAccessToken
    ) {
      throw new Error(
        "Make sure that shopwareEndpoint and shopwareAccessToken are settled in the configuration"
      );
    }

    const instance = createInstance({
      endpoint: runtimeConfig.public.shopware.shopwareEndpoint,
      accessToken: runtimeConfig.public.shopware.shopwareAccessToken,
      timeout: runtimeConfig.public.shopware.shopwareAccessToken || 10000,
      auth: {
        username:
          "<%= options.shopwareApiClient.auth ? options.shopwareApiClient.auth.username : undefined %>",
        password:
          "<%=  options.shopwareApiClient.auth ? options.shopwareApiClient.auth.password : undefined %>",
      },
      contextToken: contextToken.value || cookieContextToken,
      languageId: languageId.value || cookieLanguageId,
    });
    /**
     * Save current contextToken when its change
     */
    instance.onConfigChange(({ config }) => {
      try {
        contextToken.value = config.contextToken;
        languageId.value = config.languageId;
        Cookies.set("sw-context-token", config.contextToken || "", {
          expires: 365, //days
          sameSite: "Lax",
          path: "/",
        });
        Cookies.set("sw-language-id", config.languageId || "", {
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
      devStorefrontUrl: runtimeConfig.public.shopware?.devStorefrontUrl || null,
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
