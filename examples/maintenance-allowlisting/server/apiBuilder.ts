import { createAPIClient } from "@shopware/api-client";
import type { operations } from "#shopware";

const runtimeConfig = useRuntimeConfig();

const shopwareEndpoint =
  runtimeConfig.public?.shopware?.endpoint ??
  runtimeConfig.public?.shopware?.shopwareEndpoint;
const shopwareAccessToken =
  runtimeConfig.public?.shopware?.accessToken ??
  runtimeConfig.public?.shopware?.shopwareAccessToken;

const apiClient = createAPIClient<operations>({
  accessToken: shopwareAccessToken,
  baseURL: shopwareEndpoint,
});

export default apiClient;
