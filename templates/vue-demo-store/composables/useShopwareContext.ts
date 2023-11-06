import type { ShopwareContext } from "@shopware-pwa/composables-next/composables";
import { createAPIClient } from "@shopware/api-client";
import type {
  operationPaths,
  operations,
} from "@shopware/api-client/api-types";
// import Cookies from "js-cookie";

export function useShopwareContext(): ShopwareContext & {
  apiClient: ReturnType<typeof createAPIClient<operations, operationPaths>>;
} {
  const shopwareContext = inject<ShopwareContext | null>("shopware", null);

  // TODO create more user-friendly type for apiClient
  const apiClient =
    inject<ReturnType<typeof createAPIClient<operations, operationPaths>>>(
      "apiClient",
    );

  if (!shopwareContext || !apiClient)
    throw new Error("Critical error. Shopware context is not provided.");

  // TODO: show how we can provide different api clients for different sales channels

  return {
    // old api client
    apiInstance: shopwareContext.apiInstance,
    // expose new api client
    apiClient,
    devStorefrontUrl: shopwareContext.devStorefrontUrl,
  };
}

// TODO: experiment with the possibility of single context component
// export const useShopwareContext = createSharedComposable(_useShopwareContext);
