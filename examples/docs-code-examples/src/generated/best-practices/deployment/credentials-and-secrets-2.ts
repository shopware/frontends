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

  // The client asks for plain JSON, so the response carries `total`. Even
  // without an exact total count it counts the returned product, so it is
  // above 0 whenever a product exists.
  const total = "total" in data ? (data.total ?? 0) : 0;

  // Return only what the browser needs, never the credentials or the token.
  return { found: total > 0 };
});
