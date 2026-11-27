// server/api/has-products.get.ts
import { createAdminAPIClient } from "@shopware/api-client";
import { defineEventHandler } from "h3";

import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async () => {
  // Private runtime config is only readable on the server.
  const config = useRuntimeConfig();

  const adminApiClient = createAdminAPIClient({
    baseURL: String(config.adminApiEndpoint),
    credentials: {
      grant_type: "client_credentials",
      client_id: String(config.adminApiClientId),
      client_secret: String(config.adminApiClientSecret),
    },
  });

  const { data } = await adminApiClient.invoke(
    "searchProduct post /search/product",
    { body: { limit: 1 } },
  );

  // Return only what the browser needs, never the credentials or the token.
  return { found: Boolean(data) };
});
