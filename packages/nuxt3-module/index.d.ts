import { ApiClient } from "#shopware";

declare module "#app" {
  interface NuxtApp {
    $shopwareApiInstance: ApiClient;
  }
}

return {};
