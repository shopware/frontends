import { createAPIClient } from "@shopware/api-client";
import type { operationPaths, operations } from "#shopware";

const runtimeConfig = useRuntimeConfig();

const apiClient = createAPIClient<operations, operationPaths>({
  accessToken: runtimeConfig.public.shopware.shopwareAccessToken,
  baseURL: runtimeConfig.public.shopware.shopwareEndpoint,
});

export default apiClient;
