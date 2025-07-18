import { createAPIClient } from "@shopware/api-client";
import { isMaintenanceMode } from "@shopware/helpers";
import { getCookie } from "h3";
import Cookies from "js-cookie";
import { ref } from "vue";
import {
  createShopwareContext,
  defineNuxtPlugin,
  showError,
  useRequestHeaders,
  useRuntimeConfig,
  useState,
} from "#imports";
import type { ApiClient } from "#shopware";

declare module "#app" {
  interface NuxtApp {
    $shopwareApiClient: ApiClient;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $shopwareApiClient: ApiClient;
  }
}

export default defineNuxtPlugin((NuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const shopwareEndpointCSR =
    runtimeConfig.public?.shopware?.endpoint ??
    runtimeConfig.public?.shopware?.shopwareEndpoint;

  const shopwareEndpointSSR =
    (NuxtApp.ssrContext && runtimeConfig.shopware?.endpoint) ||
    shopwareEndpointCSR;

  const shopwareEndpoint = import.meta.server
    ? shopwareEndpointSSR
    : shopwareEndpointCSR;

  const shopwareAccessToken =
    runtimeConfig.public?.shopware?.accessToken ??
    runtimeConfig.public?.shopware?.shopwareAccessToken;

  if (!shopwareEndpoint || !shopwareAccessToken) {
    throw new Error(
      "Make sure that endpoint and accessToken are settled in the configuration",
    );
  }

  const shouldUseSessionContextInServerRender =
    !NuxtApp.ssrContext ||
    !!runtimeConfig.public?.shopware?.useUserContextInSSR ||
    !!runtimeConfig?.shopware?.useUserContextInSSR;

  const contextTokenFromCookie = NuxtApp.ssrContext
    ? getCookie(NuxtApp.ssrContext.event, "sw-context-token")
    : Cookies.get("sw-context-token");

  const apiClient = createAPIClient({
    baseURL: shopwareEndpoint,
    accessToken: shopwareAccessToken,
    contextToken: shouldUseSessionContextInServerRender
      ? contextTokenFromCookie
      : "",
    defaultHeaders:
      (NuxtApp.ssrContext && runtimeConfig.apiClientConfig?.headers) ||
      runtimeConfig.public?.apiClientConfig?.headers,
  });

  apiClient.hook("onContextChanged", (newContextToken) => {
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
      secure: shopwareEndpoint.startsWith("https://"),
    });
  });

  apiClient.hook("onResponseError", (response) => {
    // @ts-expect-error TODO: check maintenance mode and fix typongs here
    const error = isMaintenanceMode(response._data?.errors ?? []);
    if (error) {
      throw showError({
        statusCode: 503,
        statusMessage: "MAINTENANCE_MODE",
      });
    }
  });

  // Get browser locale in CSR and SSR
  let browserLocale = "en-US";
  if (import.meta.client) {
    browserLocale = navigator.language;
  } else {
    browserLocale =
      useRequestHeaders()["accept-language"]?.split(",")[0]?.split(";")[0] ??
      "en-US";
  }

  NuxtApp.vueApp.provide("apiClient", apiClient);
  // Shopware context
  // TODO fix type App<Element>
  // biome-ignore lint: ignore type error
  const shopwareContext = createShopwareContext(NuxtApp.vueApp as any, {
    enableDevtools: true,
    devStorefrontUrl: runtimeConfig.public.shopware?.devStorefrontUrl || null,
    browserLocale,
  });
  NuxtApp.vueApp.provide("shopware", shopwareContext);

  // Session Context
  const sessionContextData = ref();
  NuxtApp.vueApp.provide("swSessionContext", sessionContextData);
  // in case someone tries to use it in nuxt specific code like middleware
  useState("swSessionContext", () => sessionContextData);

  return {
    provide: {
      shopwareApiClient: apiClient as ApiClient,
    },
  };
});
