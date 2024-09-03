import Cookies from "js-cookie";
import { createAPIClient } from "@shopware/api-client";
import { isMaintenanceMode } from "@shopware-pwa/helpers-next";

import type { Composer } from "vue-i18n";

export default defineNuxtPlugin((NuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const salesChannels = runtimeConfig.public?.shopware?.salesChannels;

  if (!salesChannels) {
    throw new Error(
      "Make sure to add your sales channels to the nuxt configuration",
    );
  }

  const shouldUseSessionContextInServerRender =
    !process.server || !!runtimeConfig.public?.shopware?.useUserContextInSSR;

  const i18n: Composer = NuxtApp.$i18n as unknown as Composer;
  const locale: string | undefined = i18n?.locale.value;

  const salesChannel = computed(() =>
    Object.values(salesChannels)?.find((s) => s.locales.includes(locale)),
  );

  const apiClient = createAPIClient({
    baseURL: salesChannel.value?.endpoint,
    accessToken: salesChannel.value?.accessToken,
    contextToken: shouldUseSessionContextInServerRender
      ? Cookies.get("sw-context-token")
      : "",
  });

  apiClient.hook("onContextChanged", (newContextToken) => {
    Cookies.set("sw-context-token", newContextToken, {
      expires: 365, // days
      path: "/",
      sameSite: "lax",
      secure: salesChannel.value?.endpoint?.startsWith("https://"),
    });
  });

  apiClient.hook("onResponseError", (response) => {
    // @ts-expect-error TODO: check maintenance mode and fix typings here
    const error = isMaintenanceMode(response._data?.errors ?? []);
    if (error) {
      throw createError({
        statusCode: 503,
        statusMessage: "MAINTENANCE_MODE",
      });
    }
  });

  NuxtApp.vueApp.provide("apiClient", apiClient);

  const shopwareContext = createShopwareContext(NuxtApp.vueApp, {
    enableDevtools: true,
    devStorefrontUrl: runtimeConfig.public.shopware?.devStorefrontUrl || null,
  });
  NuxtApp.vueApp.provide("shopware", shopwareContext);

  const sessionContextData = ref();
  NuxtApp.vueApp.provide("swSessionContext", sessionContextData);
  // in case someone tries to use it in nuxt specific code like middleware
  useState("swSessionContext", () => sessionContextData);
});
