import { createInstance } from "@shopware-pwa/api-client";
import Cookies from "js-cookie";

const USE_USER_CONTEXT_IN_SSR = false;

export default defineNuxtPlugin((app) => {
  const runtimeConfig = useRuntimeConfig();

  const useUserCookieContext = !!USE_USER_CONTEXT_IN_SSR || !app.ssrContext;

  const contextToken = useCookie("sw-context-token", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
  const languageId = useCookie("sw-language-id", {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });

  // workaround for SSG case, where cookies contains additional dot in name, related: https://github.com/shopware/frontends/commit/ee5b8a71e1e016c973a7852efa3b85a136e6ea14
  const cookieContextToken = Cookies.get("sw-context-token");
  const cookieLanguageId = Cookies.get("sw-language-id");

  if (
    !runtimeConfig.public?.shopware?.shopwareEndpoint ||
    !runtimeConfig.public?.shopware?.shopwareAccessToken
  ) {
    throw new Error(
      "Make sure that shopwareEndpoint and shopwareAccessToken are settled in the configuration",
    );
  }

  /**
   * Server config has bigger prio than client
   */
  const instance = createInstance({
    endpoint:
      runtimeConfig?.shopware?.shopwareEndpoint ||
      runtimeConfig.public.shopware.shopwareEndpoint,
    accessToken: runtimeConfig.public.shopware.shopwareAccessToken,
    timeout: +runtimeConfig.public.shopware.shopwareAccessToken || 10000,
    // TODO there are no types for auth in old client
    // auth: {
    //   username:
    //     "<%= options.shopwareApiClient.auth ? options.shopwareApiClient.auth.username : undefined %>",
    //   password:
    //     "<%=  options.shopwareApiClient.auth ? options.shopwareApiClient.auth.password : undefined %>",
    // },
    contextToken: useUserCookieContext
      ? contextToken.value || cookieContextToken
      : "",
    languageId: useUserCookieContext
      ? languageId.value || cookieLanguageId
      : undefined,
  });
  /**
   * Save current contextToken when its change
   */
  instance.onConfigChange(({ config }) => {
    try {
      // only save cookies on client side render
      if (useUserCookieContext) {
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
      }
    } catch (e) {
      // Sometimes cookie is set on server after request is send, it can fail silently
    }
  });
  const shopwareContext = createShopwareContext(app.vueApp, {
    apiInstance: instance,
    enableDevtools: true,
    devStorefrontUrl: runtimeConfig.public.shopware?.devStorefrontUrl || null,
  });
  app.vueApp.provide("shopware", shopwareContext);
  const sessionContextData = ref();
  app.vueApp.provide("swSessionContext", sessionContextData);
  // in case someone tries to use it in nuxt specific code like middleware
  useState("swSessionContext", () => sessionContextData);
});
