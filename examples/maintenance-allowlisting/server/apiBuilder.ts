import { createAPIClient } from "@shopware/api-client";

import type { operations } from "#shopware";

const runtimeConfig = useRuntimeConfig();

const shopwareEndpoint = runtimeConfig.public?.shopware?.endpoint;
const shopwareAccessToken = runtimeConfig.public?.shopware?.accessToken;

const apiClient = createAPIClient<operations>({
  accessToken: shopwareAccessToken,
  baseURL: shopwareEndpoint,
});

export default apiClient;
