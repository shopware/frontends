/**
 * This file is just a temporary for playground and testing IDE support, it has no connections and will be removed, fell free to experiment here with the API
 */

import { RequestParameters, createAPIClient } from ".";
import { operationPaths, operations } from "../api-types/apiTypes-6.4.19.0";

const baseURL = "https://demo-frontends.shopware.store/store-api";
const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";
const apiType = "store-api";

type extendedPaths = "qweqwe post /some/{addressId}/pathh" | operationPaths;
type extendedOperations = {
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

const apiInstance = createAPIClient<extendedOperations, extendedPaths>({
  baseURL,
  accessToken,
  apiType,
});

async function testing() {
  const myResponse = await apiInstance.invoke(
    "readCart get /checkout/cart?name",
    {}
  );
}

// async function customOperation() {
//   const resp = await apiInstance.invoke("qweqwe post /some/{addressId}/pathh", {
//     addressId: "123",
//   });

//   // resp.;
// }
// async function test() {
//   const resp = await apiInstance.invoke("readSitemap get /sitemap", {});
//   console.log("resp", resp);
// }

// Define method with predefined path
const readCart = (params: RequestParameters<"readCart", operations>) =>
  apiInstance.invoke("readCart get /checkout/cart?name", params);

async function test() {
  const resp = await readCart({});
}
