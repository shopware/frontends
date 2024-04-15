/**
 * This file is just a temporary for playground and testing IDE support, it has no connections and will be removed, fell free to experiment here with the API
 */

import { createAPIClient } from ".";
import type { RequestParameters } from ".";
import type { operations } from "../api-types";

const baseURL = "https://demo-frontends.shopware.store/store-api";
const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

// type extendedPaths = "qweqwe post /some/{addressId}/pathh" | operationPaths;
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

const apiInstance = createAPIClient<extendedOperations>({
  baseURL,
  accessToken,
});

async function testing() {
  const myResponse = await apiInstance.invoke(
    "readCart get /checkout/cart",
    {},
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

// TDODO: DO NOT REMOVE. FIX
// const readCart = (params: RequestParameters<"readCart", operations>) =>
//   apiInstance.invoke("readCart get /checkout/cart", params);

// async function test() {
//   const resp = await readCart({});
// }
