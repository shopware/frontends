import { describe, bench } from "vitest";
import { transformPathToQuery } from "../transformPathToQuery";

describe("transforming requests", () => {
  bench("transform without any params", () => {
    transformPathToQuery("readCart get /checkout/cart", {});
  });

  bench("transform with query params", () => {
    transformPathToQuery("readCart get /checkout/cart?name", {
      name: "myId123",
    });
  });

  bench("transform with body params", () => {
    transformPathToQuery("readCart get /checkout/cart", {
      name: "myId123",
    });
  });

  bench("transform with path params", () => {
    transformPathToQuery("readCart get /checkout/cart/{name}", {
      name: "myId123",
    });
  });

  bench("transform with header params", () => {
    transformPathToQuery("readCart get /checkout/cart name", {
      name: "myId123",
    });
  });

  bench("transform with path,query,body,header params", () => {
    transformPathToQuery("readCart get /checkout/cart/{id}?name surname", {
      id: "myId123",
      name: "myId123",
      surname: "myOtherId",
      bodyParam: "some123",
    });
  });
});
