import {
  defineNuxtPlugin,
  useRuntimeConfig,
  // useCookie,
  useState,
  createShopwareContext,
} from "#imports";
import { ref } from "vue";
import Cookies from "js-cookie";
import { createAPIClient } from "@shopware/api-client";

export default defineNuxtPlugin((NuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const shopwareEndpoint =
    runtimeConfig.shopware?.endpoint ??
    runtimeConfig.shopware?.shopwareEndpoint ??
    runtimeConfig.public?.shopware?.endpoint ??
    runtimeConfig.public?.shopware?.shopwareEndpoint;
  const shopwareAccessToken =
    runtimeConfig.public?.shopware?.accessToken ??
    runtimeConfig.public?.shopware?.shopwareAccessToken;
  if (!shopwareEndpoint || !shopwareAccessToken) {
    throw new Error(
      "Make sure that endpoint and accessToken are settled in the configuration",
    );
  }

  const apiClient = createAPIClient({
    baseURL: shopwareEndpoint,
    accessToken: shopwareAccessToken,
    contextToken: Cookies.get("sw-context-token"),
    onContextChanged(newContextToken) {
      Cookies.set("sw-context-token", newContextToken, {
        expires: 365, // days
        path: "/",
        sameSite: "lax",
      });
    },
  });

  NuxtApp.vueApp.provide("apiClient", apiClient);

  // Shopware context
  const shopwareContext = createShopwareContext(NuxtApp.vueApp, {
    apiInstance: null,
    enableDevtools: true,
    devStorefrontUrl: runtimeConfig.public.shopware?.devStorefrontUrl || null,
  });
  NuxtApp.vueApp.provide("shopware", shopwareContext);

  // Session Context
  const sessionContextData = ref();
  NuxtApp.vueApp.provide("swSessionContext", sessionContextData);
  // in case someone tries to use it in nuxt specific code like middleware
  useState("swSessionContext", () => sessionContextData);
});

// const ShopwarePlugin = {
//   install(app, options) {
//     const runtimeConfig = useRuntimeConfig();

//     const isUserCookieContext =
//       !!runtimeConfig.public?.shopware?.useUserContextInSSR ||
//       !options.isServer;

//     const contextToken = getCookieContextToken();
//     const languageId = getCookieLanguageId();

//     const shopwareEndpoint =
//       runtimeConfig?.shopware?.shopwareEndpoint ||
//       runtimeConfig.public.shopware.shopwareEndpoint;

//     if (
//       !shopwareEndpoint ||
//       !runtimeConfig.public?.shopware?.shopwareAccessToken
//     ) {
//       throw new Error(
//         "Make sure that shopwareEndpoint and shopwareAccessToken are settled in the configuration",
//       );
//     }

//     const instance = createApiClientInstance(
//       shopwareEndpoint,
//       runtimeConfig.public.shopware.shopwareAccessToken,
//       getContextToken(isUserCookieContext),
//       getLanguageId(isUserCookieContext),
//     );

//     /**
//      * Save current contextToken when its change
//      */
//     instance.onConfigChange(({ config }) => {
//       try {
//         // only save cookies on client side render
//         if (isUserCookieContext) {
//           contextToken.value = config.contextToken;
//           languageId.value = config.languageId;
//           setCookieContextToken(config.contextToken);
//           setCookieLanguageId(config.languageId);
//         }
//       } catch (e) {
//         // Sometimes cookie is set on server after request is send, it can fail silently
//       }
//     });
//     const shopwareContext = createShopwareContext(app, {
//       apiInstance: instance,
//       enableDevtools: true,
//       shopwareDefaults: options.apiDefaults,
//       devStorefrontUrl: runtimeConfig.public.shopware?.devStorefrontUrl || null,
//     });

//     const apiClient = createAPIClient<operations, operationPaths>({
//       baseURL: runtimeConfig.public.shopware.shopwareEndpoint,
//       accessToken: runtimeConfig.public.shopware.shopwareAccessToken,
//       contextToken: Cookies.get("sw-context-token"),
//       onContextChanged(newContextToken) {
//         Cookies.set("sw-context-token", newContextToken, {
//           expires: 365, // days
//           path: "/",
//           sameSite: "lax",
//         });
//       },
//     });

//     app.provide("shopware", shopwareContext);
//     const sessionContextData = ref();
//     app.provide("swSessionContext", sessionContextData);
//     app.provide("apiClient", apiClient);
//     // in case someone tries to use it in nuxt specific code like middleware
//     useState("swSessionContext", () => sessionContextData);
//   },
// };

// function getCookieContextToken() {
//   return useCookie("sw-context-token", {
//     maxAge: 60 * 60 * 24 * 365,
//     sameSite: "Lax",
//     path: "/",
//   });
// }

// function setCookieContextToken(contextToken) {
//   Cookies.set("sw-context-token", contextToken || "", {
//     expires: 365, //days
//     sameSite: "Lax",
//     path: "/",
//   });
// }

// function getContextToken(isUserCookieContext) {
//   const contextToken = getCookieContextToken();
//   // workaround for SSG case, where cookies contains additional dot in name, related: https://github.com/shopware/frontends/commit/ee5b8a71e1e016c973a7852efa3b85a136e6ea14
//   const cookieContextToken = Cookies.get("sw-context-token");

//   return isUserCookieContext ? contextToken.value || cookieContextToken : "";
// }

// function getCookieLanguageId() {
//   return useCookie("sw-language-id", {
//     maxAge: 60 * 60 * 24 * 365,
//     sameSite: "Lax",
//     path: "/",
//   });
// }

// function setCookieLanguageId(languageId) {
//   Cookies.set("sw-language-id", languageId || "", {
//     expires: 365, //days
//     sameSite: "Lax",
//     path: "/",
//   });
// }

// function getLanguageId(isUserCookieContext) {
//   const languageId = getCookieLanguageId();
//   // workaround for SSG case, where cookies contains additional dot in name, related: https://github.com/shopware/frontends/commit/ee5b8a71e1e016c973a7852efa3b85a136e6ea14
//   const cookieLanguageId = Cookies.get("sw-language-id");

//   return isUserCookieContext ? languageId.value || cookieLanguageId : undefined;
// }

// /**
//  * Server config has bigger prio than client
//  */
// function createApiClientInstance(
//   shopwareEndpoint,
//   shopwareAccessToken,
//   contextToken,
//   languageId,
// ) {
//   return createInstance({
//     endpoint: shopwareEndpoint,
//     accessToken: shopwareAccessToken,
//     timeout: shopwareAccessToken || 10000,
//     auth: {
//       username:
//         "<%= options.shopwareApiClient.auth ? options.shopwareApiClient.auth.username : undefined %>",
//       password:
//         "<%=  options.shopwareApiClient.auth ? options.shopwareApiClient.auth.password : undefined %>",
//     },
//     contextToken: contextToken,
//     languageId: languageId,
//   });
// }

// export default defineNuxtPlugin(async (nuxtApp) => {
//   nuxtApp.vueApp.use(ShopwarePlugin, {
//     apiDefaults: getDefaultApiParams(),
//     isServer: !!nuxtApp.ssrContext,
//   });
// });
