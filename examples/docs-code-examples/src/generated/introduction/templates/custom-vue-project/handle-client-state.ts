import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";
import Cookies from "js-cookie";
import { ref } from "vue";

const contextToken = ref(Cookies.get("sw-context-token"));
const languageId = ref(Cookies.get("sw-language-id"));
const apiClient = createAPIClient<operations>({
  baseURL: "https://demo-frontends.swstage.store/store-api",
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  contextToken: contextToken.value,
  defaultHeaders: {
    "sw-language-id": languageId.value,
  },
});

/**
 * Save current contextToken when it changes
 */
apiClient.hook("onDefaultHeaderChanged", (headerName, value) => {
  try {
    const headerValue = typeof value === "string" ? value : "";

    if (headerName === "sw-context-token") {
      Cookies.set("sw-context-token", headerValue, {
        expires: 365,
        sameSite: "Lax",
        path: "/",
      });
      contextToken.value = headerValue;
    }

    if (headerName === "sw-language-id") {
      Cookies.set("sw-language-id", headerValue, {
        expires: 365,
        sameSite: "Lax",
        path: "/",
      });
      languageId.value = headerValue;
    }
  } catch (error) {
    void error;
    // Sometimes cookie is set on server after request is send, it can fail silently
  }
});
