import { createAPIClient } from "@shopware/api-client";
import type {
  operationPaths,
  operations,
} from "@shopware/api-client/api-types";
import Cookies from "js-cookie";

/**
 * Here you can initialise your api client and provide it to the app.
 * You can also initialise multiple clients and provide them under different names.
 */
export default defineNuxtPlugin((NuxtApp) => {
  const apiClient = createAPIClient<operations, operationPaths>({
    baseURL: "https://demo-frontends.shopware.store/store-api",
    accessToken: "SWSCOEFMZFVVUNPPYKXHCUGWAW",
    contextToken: Cookies.get("sw-context-token"),
    onContextChanged(newContextToken) {
      Cookies.set("sw-context-token", newContextToken, {
        expires: 365, // days
        path: "/",
        sameSite: "lax",
      });
    },
  });

  const apiClient2 = createAPIClient<operations, operationPaths>({
    baseURL: "https://demo-frontends.shopware.store/store-api",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    contextToken: Cookies.get("sw-context-token2"),
    onContextChanged(newContextToken) {
      Cookies.set("sw-context-token2", newContextToken, {
        expires: 365, // days
        path: "/",
        sameSite: "lax",
      });
    },
  });

  NuxtApp.vueApp.provide("apiClient", apiClient);
  NuxtApp.vueApp.provide("apiClient2", apiClient2);
});
