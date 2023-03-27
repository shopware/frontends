import { createInstance } from "@shopware-pwa/api-client";
const runtimeConfig = useRuntimeConfig();

const apiContext = createInstance({
  endpoint: runtimeConfig.public.shopware.shopwareEndpoint,
  accessToken: runtimeConfig.public.shopware.shopwareAccessToken,
});

export default apiContext;
