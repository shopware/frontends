import { describe, expect, it } from "vitest";
import { createAPIClient } from ".";
import {
  operationPaths as paths6419,
  operations as operations6419,
} from "../api-types/apiTypes-6.4.19.0";
import {
  operationPaths as paths6420,
  operations as operations6420,
} from "../api-types/apiTypes-6.4.20.0";
import {
  operationPaths as paths6500,
  operations as operations6500,
} from "../api-types/apiTypes-6.5.0.0";

const baseURL = "https://demo-frontends.shopware.store/store-api";
const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";
const apiType = "store-api";

const client6419 = createAPIClient<operations6419, paths6419>({
  baseURL,
  accessToken,
  apiType,
});
const client6420 = createAPIClient<operations6420, paths6420>({
  baseURL,
  accessToken,
  apiType,
});

// const client6500 = createAPIClient<operations6500, paths6500>({
//   baseURL: "https://ci-20230328-0845-noyce.swstage.store/store-api/",
//   accessToken: "SWSCTNU1Z3Y2EG5ZTKVWU0JKCA",
//   apiType,
// });

describe("Multiple versions test", () => {
  describe("readCard", () => {
    it("6.4.19.0", async () => {
      const result = await client6419.invoke(
        "readCart get /checkout/cart?name",
        {
          name: "myCartName",
        }
      );
      expect(result.name).toEqual("myCartName");
    });

    it("6.4.20.0", async () => {
      const result = await client6420.invoke(
        "readCart get /checkout/cart?name",
        {
          name: "myCartName",
        }
      );
      expect(result.name).toEqual("myCartName");
    });

    // it("6.5.0.0 - BREAKING CHANGE", async () => {
    //   // TODO: name parameter has been removed from the API, schema fix needed
    //   const result = await client6500.invoke(
    //     "readCart get /checkout/cart?name",
    //     {
    //       name: "myCartName",
    //     }
    //   );
    //   expect(result.name).toBeUndefined();
    // });
  });
});
