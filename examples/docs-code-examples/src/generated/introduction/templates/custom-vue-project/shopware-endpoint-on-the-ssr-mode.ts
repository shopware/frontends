import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";
import { ref } from "vue";

import type { ShopwareFrontendsOptions } from "./configure-api-client-2";

const ssrValue = "http://shopware";
const clientValue = "https://demo-frontends.shopware.store";
const options: ShopwareFrontendsOptions = {
  endpoint: clientValue,
  accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  shopwareApiClient: {
    timeout: 5000,
  },
};
const contextToken = ref<string>();
const languageId = ref<string>();

const apiClient = createAPIClient<operations>({
  baseURL: ssrValue || clientValue,
  accessToken: options.accessToken,
  fetchOptions: {
    timeout: options.shopwareApiClient?.timeout || 5000,
  },
  contextToken: contextToken.value,
  defaultHeaders: {
    "sw-language-id": languageId.value,
  },
});

export { apiClient };
