import { createAPIClient } from "@shopware/api-client";
import type { operations, Schemas } from "./api-types/storeApiTypes";

export async function setupExample() {
  const shopwareEndpoint = "https://demo-frontends.shopware.store/store-api";
  const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

  // @ts-ignore
  createAPIClient<operations>({
    baseURL: shopwareEndpoint,
    accessToken: accessToken,
  });

  // @ts-ignore
  const product: Schemas["Product"] = {
    name: "My Artificially Generated Product",
    isAiGenerated: true,
  };

  console.warn("Product:", product);
}
