/**
 * This file is just a temporary for playground and testing IDE support, it has no connections and will be removed, fell free to experiment here with the API
 */

import { createAPIClient } from ".";
import { operationPaths, operations } from "../api-types/apiTypes-6.4.19.0";

const baseURL = "https://demo-frontends.shopware.store/store-api";
const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";
const apiType = "store-api";

type extendedPaths = "qweqwe post /some/{addressId}/pathh" | operationPaths;
type extendedOPerations = {
  qweqwe: {
    parameters: {
      path: {
        addressId: string;
      };
    };
    responses: {
      204: never;
      400: never;
    };
  };
} & operations;

const apiInstance = createAPIClient<extendedOPerations, extendedPaths>({
  baseURL,
  accessToken,
  apiType,
});

async function customOperation() {
  const resp = await apiInstance.invoke("qweqwe post /some/{addressId}/pathh", {
    addressId: "123",
  });

  // resp.;
}

async function test() {
  const resp = await apiInstance.invoke("readSitemap get /sitemap", {});
}
