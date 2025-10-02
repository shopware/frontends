import { createAPIClient } from "@shopware/api-client";
import type { operations } from "#shopware";

const runtimeConfig = useRuntimeConfig();

const shopwareEndpoint =
  runtimeConfig.public?.shopware?.endpoint ??
  (runtimeConfig.public?.shopware as { shopwareEndpoint?: string })
    ?.shopwareEndpoint;
const shopwareAccessToken =
  runtimeConfig.public?.shopware?.accessToken ??
  (runtimeConfig.public?.shopware as { shopwareAccessToken?: string })
    ?.shopwareAccessToken;

const apiClient = createAPIClient<operations>({
  accessToken: shopwareAccessToken,
  baseURL: shopwareEndpoint,
});

export { shopwareEndpoint, shopwareAccessToken, apiClient };
