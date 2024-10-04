import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";

export async function getApiClientInstance(): Promise<
  ReturnType<typeof createAPIClient<operations>>
> {
  const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api";

  const apiClient = createAPIClient<operations>({
    baseURL: shopwareEndpoint,
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  });

  return apiClient;
}
