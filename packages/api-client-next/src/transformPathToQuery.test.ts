import { describe, expect, it } from "vitest";
import { transformPathToQuery } from ".";

describe("transform path to query request", () => {
  it("should transform query to request", async () => {
    const [path, params] = transformPathToQuery(
      "readCart get /checkout/cart?name",
      {
        name: "myId123",
      },
    );
    expect(path).toEqual("/checkout/cart");
    expect(params).toMatchInlineSnapshot(`
      {
        "headers": {},
        "method": "GET",
        "query": {
          "name": "myId123",
        },
      }
    `);
  });

  it("should transform path param", async () => {
    const [path, params] = transformPathToQuery(
      "readProductCrossSellings post /product/{productId}/cross-selling",
      {
        productId: "someId1234",
      },
    );
    expect(path).toEqual("/product/someId1234/cross-selling");
    expect(params).toMatchInlineSnapshot(`
      {
        "headers": {},
        "method": "POST",
        "query": {},
      }
    `);
  });

  it("should put other params into body", async () => {
    const [path, params] = transformPathToQuery(
      "createCustomerAddress post /account/address",
      {
        city: "Berlin",
        firstName: "John",
        lastName: "Doe",
      },
    );

    expect(path).toEqual("/account/address");
    expect(params).toMatchInlineSnapshot(`
      {
        "body": {
          "city": "Berlin",
          "firstName": "John",
          "lastName": "Doe",
        },
        "headers": {},
        "method": "POST",
        "query": {},
      }
    `);
  });

  it("should have only body params in body", async () => {
    const [path, params] = transformPathToQuery(
      "createCustomerAddress post /account/address/{city}?firstName someHeader",
      {
        city: "Berlin",
        firstName: "John",
        someHeader: true,
        bodyParamName: "Doe",
      },
    );

    expect(path).toEqual("/account/address/Berlin");
    expect(params).toMatchInlineSnapshot(`
      {
        "body": {
          "bodyParamName": "Doe",
        },
        "headers": {
          "someHeader": true,
        },
        "method": "POST",
        "query": {
          "firstName": "John",
        },
      }
    `);
  });

  it("should put header params into request definition", async () => {
    const [path, params] = transformPathToQuery(
      "readNavigation post /navigation/{activeId}/{rootId} sw-include-seo-urls",
      {
        activeId: "act123",
        rootId: "root123",
        "sw-include-seo-urls": true,
      },
    );
    expect(path).toEqual("/navigation/act123/root123");
    expect(params).toMatchInlineSnapshot(`
      {
        "headers": {
          "sw-include-seo-urls": true,
        },
        "method": "POST",
        "query": {},
      }
    `);
  });
});
