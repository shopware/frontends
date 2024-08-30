import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useState,
  createShopwareContext,
  createError,
} from "#imports";
import { ref, computed, ComputedRef } from "vue";
import Cookies from "js-cookie";
import { createAPIClient } from "@shopware/api-client";
import { getCookie } from "h3";
import { isMaintenanceMode } from "@shopware-pwa/helpers-next";
import type { ApiClient, operations } from "#shopware";

declare module "#app" {
  interface NuxtApp {
    $shopwareApiClient: ApiClient;
    $getCurrentSession: ComputedRef<
      operations["readContext get /context"]["response"]
    >;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $shopwareApiClient: ApiClient;
  }
}

export default defineNuxtPlugin(async (NuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const shopwareEndpoint =
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

  const shouldUseSessionContextInServerRender =
    !NuxtApp.ssrContext ||
    !!runtimeConfig.public?.shopware?.useUserContextInSSR ||
    !!runtimeConfig?.shopware?.useUserContextInSSR;

  const contextTokenFromCookie = !!NuxtApp.ssrContext
    ? getCookie(NuxtApp.ssrContext?.event, "sw-context-token")
    : Cookies.get("sw-context-token");

  const apiClient = createAPIClient({
    baseURL: shopwareEndpoint,
    accessToken: shopwareAccessToken,
    contextToken: shouldUseSessionContextInServerRender
      ? contextTokenFromCookie
      : "",
  });

  apiClient.hook("onContextChanged", (newContextToken) => {
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
      secure: shopwareEndpoint.startsWith("https://"),
    });
  });

  // apiClient.hook("onSuccessResponse", (response) => {
  // });

  apiClient.hook("onResponseError", (response) => {
    // @ts-expect-error TODO: check maintenance mode and fix typongs here
    const error = isMaintenanceMode(response._data?.errors ?? []);
    if (error) {
      throw createError({
        statusCode: 503,
        statusMessage: "MAINTENANCE_MODE",
      });
    }
  });

  NuxtApp.vueApp.provide("apiClient", apiClient);

  // Shopware context
  const shopwareContext = createShopwareContext(NuxtApp.vueApp, {
    enableDevtools: true,
    devStorefrontUrl: runtimeConfig.public.shopware?.devStorefrontUrl || null,
  });
  NuxtApp.vueApp.provide("shopware", shopwareContext);

  async function loadCurrentSession() {
    console.warn(
      "loadCurrentSession",
      NuxtApp.ssrContext ? "(server)" : "(client)",
    );
    return (await apiClient.invoke("readContext get /context")).data;
  }
  const sessionContextData = ref();

  if (NuxtApp.ssrContext) {
    const currentSession = await loadCurrentSession();

    console.warn("setting payload in (server)", contextTokenFromCookie);
    NuxtApp.ssrContext.payload.data = {
      sessionContext: currentSession,
    };
    sessionContextData.value = currentSession;
  } else {
    console.warn(
      "taking session from server payload (client)",
      NuxtApp.payload.data.sessionContext,
    );
    sessionContextData.value =
      NuxtApp.payload.data.sessionContext || (await loadCurrentSession());
  }
  // Session Context
  NuxtApp.vueApp.provide("swSessionContext", sessionContextData);
  // in case someone tries to use it in nuxt specific code like middleware
  useState("swSessionContext", () => sessionContextData);

  return {
    provide: {
      shopwareApiClient: apiClient as ApiClient,
      getCurrentSession: computed(() => sessionContextData.value),
    },
  };
});