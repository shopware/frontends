import { describe, bench } from "vitest";
import { transformPathToQuery } from "../transformPathToQuery";

describe("transforming requests", () => {
  bench(
    "[api-client][transformPathToQuery] - transform without any params",
    () => {
      transformPathToQuery("readCart post /checkout/cart", {});
    },
  );

  bench(
    "[api-client][transformPathToQuery] - transform with query params",
    () => {
      transformPathToQuery("readCart post /checkout/cart?name", {
        name: "myId123",
      });
    },
  );

  bench(
    "[api-client][transformPathToQuery] - transform with body params",
    () => {
      transformPathToQuery("readCart post /checkout/cart", {
        name: "myId123",
      });
    },
  );

  bench(
    "[api-client][transformPathToQuery] - transform with path params",
    () => {
      transformPathToQuery("readCart post /checkout/cart/{name}", {
        name: "myId123",
      });
    },
  );

  bench(
    "[api-client][transformPathToQuery] - transform with header params",
    () => {
      transformPathToQuery("readCart post /checkout/cart name", {
        name: "myId123",
      });
    },
  );

  bench(
    "[api-client][transformPathToQuery] - transform with path,query,body,header params",
    () => {
      transformPathToQuery("readCart post /checkout/cart/{id}?name surname", {
        id: "myId123",
        name: "myId123",
        surname: "myOtherId",
        bodyParam: "some123",
      });
    },
  );
});
