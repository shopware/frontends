import { describe, expect, it } from "vitest";
import { createAPIClient } from ".";
import { operationPaths, operations } from "../api-types/apiTypes-6.4.19.0";

const baseURL = "https://demo-frontends.shopware.store/store-api";
const accessToken = "SWSCBHFSNTVMAWNZDNFKSHLAYW";

describe("Test real API invocations", () => {
  it("should fail on unprovided access token", async () => {
    const apiInstance = createAPIClient<operations, operationPaths>({
      baseURL,
      accessToken: "",
    });
    await expect(() =>
      apiInstance.invoke("readCart get /checkout/cart?name", {
        name: "qwe",
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `
      "Failed request
       - [Unauthorized] Header \\"sw-access-key\\" is required."
    `,
    );
  });

  it("should not allow to pass an empty string as token", async () => {
    const apiInstance = createAPIClient<operations, operationPaths>({
      baseURL,
      accessToken,
      contextToken: "",
    });
    const result = await apiInstance.invoke("readContext get /context", {});
    expect(result).toHaveProperty("token");
    expect(result.token).not.toBe("");
  });

  it("should not allow to pass undefined as context token", async () => {
    const apiInstance = createAPIClient<operations, operationPaths>({
      baseURL,
      accessToken,
      contextToken: undefined,
    });
    const result = await apiInstance.invoke("readContext get /context", {});
    expect(result).toHaveProperty("token");
    expect(result.token).not.toBe("undefined");
  });

  it("should fetch seo-url for page", async () => {
    const apiInstance = createAPIClient<operations, operationPaths>({
      baseURL,
      accessToken,
    });
    const result = await apiInstance.invoke("readSeoUrl post /seo-url", {
      filter: [
        {
          type: "equals",
          field: "seoPathInfo",
          value: "Pepper-white-ground-Muntok-pearl/SW10098M",
        },
      ],
    });
    expect(result).toMatchInlineSnapshot(`
      {
        "aggregations": [],
        "apiAlias": "dal_entity_search_result",
        "elements": [
          {
            "apiAlias": "seo_url",
            "createdAt": "2020-08-06T06:26:52.576+00:00",
            "customFields": null,
            "foreignKey": "24cc835ccc944665a94a31c392c27366",
            "id": "4a105064127e49ccbba360e2c739b464",
            "isCanonical": true,
            "isDeleted": false,
            "isModified": false,
            "isValid": null,
            "languageId": "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
            "pathInfo": "/detail/24cc835ccc944665a94a31c392c27366",
            "routeName": "frontend.detail.page",
            "salesChannelId": "98432def39fc4624b33213a56b8c944d",
            "seoPathInfo": "Pepper-white-ground-Muntok-pearl/SW10098M",
            "translated": [],
            "updatedAt": "2022-08-10T05:53:28.819+00:00",
            "url": null,
          },
        ],
        "entity": "seo_url",
        "limit": 100,
        "page": 1,
        "states": [],
        "total": 1,
      }
    `);
  });
});
