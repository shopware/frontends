import { createAdminAPIClient, createAPIClient } from "@shopware/api-client";
import { operations } from "@shopware/api-client/api-types";
import { operations as adminOperations } from "@shopware/api-client/admin-api-types";

let adminApiClient: ReturnType<typeof createAdminAPIClient<adminOperations>>;
let storeApiClient: ReturnType<typeof createAPIClient<operations>>;

export function getAdminApiClient() {
  if (!adminApiClient) {
    adminApiClient = createAdminAPIClient<adminOperations>({
      baseURL: `${process.env.OPENAPI_JSON_URL}/api`,
      credentials: {
        grant_type: "password",
        client_id: "administration",
        scopes: "write",
        username: process.env.SHOPWARE_ADMIN_USERNAME,
        password: process.env.SHOPWARE_ADMIN_PASSWORD,
      },
    });
  }
  return adminApiClient;
}

export function getStoreApiClient() {
  if (!storeApiClient) {
    storeApiClient = createAPIClient<operations>({
      baseURL: `${process.env.OPENAPI_JSON_URL}/store-api`,
      accessToken: process.env.OPENAPI_ACCESS_KEY,
    });
  }
  return storeApiClient;
}
