import { createAPIClient } from "@shopware/api-client";
import { isMaintenanceMode } from "@shopware/helpers";
import { getCookie } from "h3";
import type { H3Event } from "h3";
import Cookies from "js-cookie";
import { ref } from "vue";

import type { Plugin } from "#app";
import {
  createShopwareContext,
  defineNuxtPlugin,
  showError,
  useRequestHeaders,
  useRuntimeConfig,
  useState,
} from "#imports";
import type { ApiClient } from "#shopware";

import type { ShopwareNuxtOptions } from "./src";

type ShopwarePluginInjections = {
  shopwareApiClient: ApiClient;
};

type ShopwarePluginNuxtApp = {
  ssrContext?: {
    event: H3Event;
  };
  vueApp: {
    provide: (name: string, value: unknown) => void;
  };
};

type ApiError = {
  code?: string;
};

function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== "object") {
    return false;
  }

  const { code } = error as { code?: unknown };

  return code === undefined || typeof code === "string";
}

function getApiErrors(data: unknown): ApiError[] {
  if (!data || typeof data !== "object" || !("errors" in data)) {
    return [];
  }

  const { errors } = data as { errors?: unknown };

  return Array.isArray(errors) ? errors.filter(isApiError) : [];
}

function toTimeout(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function setupShopwarePlugin(NuxtApp: ShopwarePluginNuxtApp): {
  provide: ShopwarePluginInjections;
} {
  const runtimeConfig = useRuntimeConfig();

  const shopwareRuntimeConfigPublic = runtimeConfig.public
    .shopware as ShopwareNuxtOptions;
  const shopwareRuntimeConfig = import.meta.server
    ? (runtimeConfig.shopware as ShopwareNuxtOptions)
    : undefined;

  const shopwareEndpointCSR =
    shopwareRuntimeConfigPublic?.endpoint ??
    shopwareRuntimeConfigPublic?.shopwareEndpoint;

  const shopwareEndpointSSR =
    (NuxtApp.ssrContext &&
      (shopwareRuntimeConfig?.endpoint ??
        shopwareRuntimeConfig?.shopwareEndpoint)) ||
    shopwareEndpointCSR;

  const shopwareEndpoint = import.meta.server
    ? shopwareEndpointSSR
    : shopwareEndpointCSR;

  const shopwareAccessToken =
    shopwareRuntimeConfigPublic?.accessToken ??
    shopwareRuntimeConfigPublic?.shopwareAccessToken;

  if (!shopwareEndpoint || !shopwareAccessToken) {
    throw new Error(
      "Make sure that endpoint and accessToken are settled in the configuration",
    );
  }

  const shouldUseSessionContextInServerRender =
    !NuxtApp.ssrContext ||
    !!shopwareRuntimeConfigPublic?.useUserContextInSSR ||
    !!shopwareRuntimeConfig?.useUserContextInSSR;

  const contextTokenFromCookie = NuxtApp.ssrContext
    ? getCookie(NuxtApp.ssrContext.event, "sw-context-token")
    : Cookies.get("sw-context-token");

  type ApiClientConfig = {
    headers?: Record<string, string>;
    timeout?: unknown;
  };

  const privateApiClientConfig = import.meta.server
    ? (runtimeConfig.apiClientConfig as ApiClientConfig)
    : undefined;
  const publicApiClientConfig = runtimeConfig.public
    ?.apiClientConfig as ApiClientConfig;

  const timeout =
    toTimeout(privateApiClientConfig?.timeout) ??
    toTimeout(publicApiClientConfig?.timeout) ??
    toTimeout(shopwareRuntimeConfigPublic?.apiClientConfig?.timeout) ??
    toTimeout(shopwareRuntimeConfig?.apiClientConfig?.timeout);

  const apiClient = createAPIClient({
    baseURL: shopwareEndpoint,
    accessToken: shopwareAccessToken,
    contextToken: shouldUseSessionContextInServerRender
      ? contextTokenFromCookie
      : "",
    defaultHeaders:
      (NuxtApp.ssrContext && privateApiClientConfig?.headers) ||
      publicApiClientConfig?.headers,
    ...(timeout === undefined ? {} : { fetchOptions: { timeout } }),
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
    const error = isMaintenanceMode(getApiErrors(response._data));
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
  // TODO: Improve this typing.
  const shopwareContext = createShopwareContext(NuxtApp.vueApp as any, {
    enableDevtools: true,
    devStorefrontUrl: shopwareRuntimeConfigPublic?.devStorefrontUrl || null,
    browserLocale,
    cacheableReads: shopwareRuntimeConfigPublic?.cacheableReads ?? false,
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
}

const shopwarePlugin: Plugin<ShopwarePluginInjections> =
  defineNuxtPlugin<ShopwarePluginInjections>(setupShopwarePlugin);

export default shopwarePlugin;
