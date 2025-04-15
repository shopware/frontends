import { describe, expect, it } from "vitest";
import { transformPathToQuery } from "./transformPathToQuery";

describe("transform path to query request", () => {
  describe("transforming query parameters", () => {
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

    it("should add [] to query name if it's an array", () => {
      const [path, params] = transformPathToQuery(
        "removeLineItem delete /checkout/cart/line-item?ids",
        {
          ids: ["myId123", "myId456"],
        },
      );
      expect(path).toEqual("/checkout/cart/line-item");
      expect(params).toMatchInlineSnapshot(`
        {
          "headers": {},
          "method": "DELETE",
          "query": {
            "ids[]": [
              "myId123",
              "myId456",
            ],
          },
        }
      `);
    });

    it("should accept query param names if there is already '[]' in the name", () => {
      const [path, params] = transformPathToQuery(
        "removeLineItem delete /checkout/cart/line-item?ids[]",
        {
          "ids[]": ["myId123", "myId456"],
        },
      );
      expect(path).toEqual("/checkout/cart/line-item");
      expect(params).toMatchInlineSnapshot(`
        {
          "headers": {},
          "method": "DELETE",
          "query": {
            "ids[]": [
              "myId123",
              "myId456",
            ],
          },
        }
      `);
    });

    it("should use the whole formData object as a request payload", async () => {
      const formData = new FormData();
      formData.append("optionId", "some-id");
      const [path, params] = transformPathToQuery(
        "sendFormData post /some/path/to/send/form/data",
        formData as unknown as Record<string, unknown>,
      );
      expect(path).toEqual("/some/path/to/send/form/data");
      expect(params.body).toEqual(expect.any(FormData));
    });
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

  it("should omit passing param in a payload s when HTTP method is GET", async () => {
    const [path, params] = transformPathToQuery("getContext get /context", {
      languageId: "some-en-id",
    });

    expect(path).toEqual("/context");
    expect(params.body).toBeUndefined();
  });

  it("should omit passing params in a payload when HTTP method is OPTIONS", async () => {
    const [path, params] = transformPathToQuery("getContext options /context", {
      languageId: "some-en-id",
    });

    expect(path).toEqual("/context");
    expect(params.body).toBeUndefined();
  });

  it("should omit passing params in a payload  when HTTP method is HEAD", async () => {
    const [path, params] = transformPathToQuery("getContext head /context", {
      languageId: "some-en-id",
    });

    expect(path).toEqual("/context");
    expect(params.body).toBeUndefined();
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

  it("should handle undefined pathDefinition", async () => {
    const [path, params] = transformPathToQuery("yo POST", {
      someParam: "value",
    });

    expect(path).toEqual("");
    expect(params).toMatchInlineSnapshot(`
      {
        "body": {
          "someParam": "value",
        },
        "headers": {},
        "method": "POST",
        "query": {},
      }
    `);
  });
});
