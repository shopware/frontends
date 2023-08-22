import { describe, expect, it, assertType } from "vitest";
import { createAPIClient } from ".";
import {
  operationPaths as paths6419,
  operations as operations6419,
} from "../api-types/apiTypes-6.4.19.0";
import {
  operationPaths as paths6420,
  operations as operations6420,
} from "../api-types/apiTypes-6.4.20.0";

const baseURL = "https://demo-frontends.shopware.store/store-api";
const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

const client6419 = createAPIClient<operations6419, paths6419>({
  baseURL,
  accessToken,
});
const client6420 = createAPIClient<operations6420, paths6420>({
  baseURL,
  accessToken,
});

describe("Multiple versions test", () => {
  describe("readCard", () => {
    it("6.4.19.0", async () => {
      const result = await client6419.invoke(
        "readCart get /checkout/cart?name",
        {
          name: "myCartName",
        },
      );
      expect(result.name).toEqual(undefined);
      // expect(result.name).toEqual("myCartName");
    });

    it("6.4.20.0", async () => {
      const result = await client6420.invoke(
        "readCart get /checkout/cart?name",
        {
          name: "myCartName",
        },
      );
      expect(result.name).toEqual(undefined);
      // expect(result.name).toEqual("myCartName");
    });
  });
});
