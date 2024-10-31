import { describe, expect, it } from "vitest";
import { patchJsonSchema } from "./patchJsonSchema";
import json5 from "json5";

describe("patchJsonSchema", () => {
  describe("components", () => {
    it("should add new property to the existing component", async () => {
      const { patchedSchema } = patchJsonSchema({
        openApiSchema: json5.parse(`{
          components: {
            schemas: {
              CalculatedPrice: {
                type: "object",
                properties: {
                  apiAlias: { type: "string", enum: ["calculated_price"] },
                },
                required: ["apiAlias"],
              },
            },
          },
        }`),
        jsonOverrides: json5.parse(`{
          components: {
            CalculatedPrice: [
              {
                properties: { netPrice: { type: "number" } },
                required: ["netPrice"],
              },
            ],
          },
        }`),
      });

      expect(patchedSchema).toMatchInlineSnapshot(`
      {
        "components": {
          "schemas": {
            "CalculatedPrice": {
              "properties": {
                "apiAlias": {
                  "enum": [
                    "calculated_price",
                  ],
                  "type": "string",
                },
                "netPrice": {
                  "type": "number",
                },
              },
              "required": [
                "apiAlias",
                "netPrice",
              ],
              "type": "object",
            },
          },
        },
      }
    `);
    });

    it("should properly merge errors array", async () => {
      const { patchedSchema } = patchJsonSchema({
        openApiSchema: json5.parse(`{
        components: {
          schemas: {
           "CartError": {
              "type": "object",
              "description": "A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers.",
              "properties": {
                "items": {
                  "type": "object",
                  "properties": {
                    "key": { "type": "string" },
                    "level": {
                      "type": "number",
                      "enum": [0, 10, 20],
                      "description": "desc"
                    },
                    "message": { "type": "string" },
                    "messageKey": { "type": "string" }
                  }
                }
              }
            },
            "Cart": {
              "type": "object",
              "properties": {
                "name": {
                  "description": "Name of the cart - for example \`guest-cart\`",
                  "type": "string"
                },
                "errors": {
                  "type": "array",
                  "description": "A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers.",
                  "items": { "$ref": "#/components/schemas/CartError" }
                },
              },
            },
          },
        },
      }`),
        jsonOverrides: json5.parse(`{
        components: {
          "Cart": [
            {
              "properties": {
                "errors": {
                  "type": "object",
                  "items": "_DELETE_",
                  "anyOf": [
                    {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/CartError" }
                    },
                    {
                      "type": "object",
                      "additionalProperties": {
                        "type": "object",
                        "properties": {
                          "code": {
                            "type": "number"
                          },
                          "key": {
                            "type": "string"
                          },
                          "level": {
                            "type": "number"
                          },
                          "message": {
                            "type": "string"
                          },
                          "messageKey": {
                            "type": "string"
                          }
                        },
                        "required": ["code", "key", "level", "message", "messageKey"]
                      }
                    }
                  ]
                }
              }
            }
          ],
        },
      }`),
      });

      expect(patchedSchema).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Cart": {
                "properties": {
                  "errors": {
                    "anyOf": [
                      {
                        "items": {
                          "$ref": "#/components/schemas/CartError",
                        },
                        "type": "array",
                      },
                      {
                        "additionalProperties": {
                          "properties": {
                            "code": {
                              "type": "number",
                            },
                            "key": {
                              "type": "string",
                            },
                            "level": {
                              "type": "number",
                            },
                            "message": {
                              "type": "string",
                            },
                            "messageKey": {
                              "type": "string",
                            },
                          },
                          "required": [
                            "code",
                            "key",
                            "level",
                            "message",
                            "messageKey",
                          ],
                          "type": "object",
                        },
                        "type": "object",
                      },
                    ],
                    "description": "A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers.",
                    "type": "object",
                  },
                  "name": {
                    "description": "Name of the cart - for example \`guest-cart\`",
                    "type": "string",
                  },
                },
                "type": "object",
              },
              "CartError": {
                "description": "A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers.",
                "properties": {
                  "items": {
                    "properties": {
                      "key": {
                        "type": "string",
                      },
                      "level": {
                        "description": "desc",
                        "enum": [
                          0,
                          10,
                          20,
                        ],
                        "type": "number",
                      },
                      "message": {
                        "type": "string",
                      },
                      "messageKey": {
                        "type": "string",
                      },
                    },
                    "type": "object",
                  },
                },
                "type": "object",
              },
            },
          },
        }
      `);
    });

    it("should remove property from existing component", async () => {
      const { patchedSchema } = patchJsonSchema({
        openApiSchema: json5.parse(`{
          components: {
            schemas: {
              Category: {
                type: "object",
                properties: {
                  breadcrumb: {
                    type: "array",
                    items: { type: "string", additionalProperties: false },
                    readOnly: true,
                  },
                },
                required: [],
              },
            },
          },
        }`),
        jsonOverrides: json5.parse(`{
          components: {
            Category: [
              {
                required: ["breadcrumb"],
                properties: {
                  breadcrumb: {
                    items: {
                      additionalProperties: "_DELETE_",
                    },
                    readOnly: "_DELETE_",
                  },
                },
              },
            ],
          },
        }`),
      });

      expect(patchedSchema).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "Category": {
                "properties": {
                  "breadcrumb": {
                    "items": {
                      "type": "string",
                    },
                    "type": "array",
                  },
                },
                "required": [
                  "breadcrumb",
                ],
                "type": "object",
              },
            },
          },
        }
      `);
    });

    it("should skip removing property from component if it's not there", async () => {
      const { patchedSchema } = patchJsonSchema({
        openApiSchema: json5.parse(`{
          components: {
            schemas: {
              "ProductMedia": {
                "description": "Added since version: 6.0.0.0",
                "required": [],
                "properties": {
                  "media": { "$ref": "#/components/schemas/Media" },
                },
                "type": "object"
              },
            },
          },
        }`),
        jsonOverrides: json5.parse(`{
          components: {
            "ProductMedia": [
              {
                "properties": {
                  "thumbnails": {
                    "$ref": "_DELETE_",
                    "type": "array",
                    "items": { "$ref": "#/components/schemas/MediaThumbnail" }
                  }
                }
              },
              {
                "required": ["media"]
              }
            ],
          },
        }`),
      });

      expect(patchedSchema).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "ProductMedia": {
                "description": "Added since version: 6.0.0.0",
                "properties": {
                  "media": {
                    "$ref": "#/components/schemas/Media",
                  },
                  "thumbnails": {
                    "items": {
                      "$ref": "#/components/schemas/MediaThumbnail",
                    },
                    "type": "array",
                  },
                },
                "required": [
                  "media",
                ],
                "type": "object",
              },
            },
          },
        }
      `);
    });

    it("should add new component if there was none before", async () => {
      const { patchedSchema } = patchJsonSchema({
        openApiSchema: json5.parse(`{
          components: {
            schemas: {
            },
          },
        }`),
        jsonOverrides: json5.parse(`{
          components: {
            CalculatedPrice: [
              {
                type: "object",
                properties: { netPrice: { type: "number" } },
                required: ["netPrice"],
              },
            ],
          },
        }`),
      });

      expect(patchedSchema).toMatchInlineSnapshot(`
        {
          "components": {
            "schemas": {
              "CalculatedPrice": {
                "properties": {
                  "netPrice": {
                    "type": "number",
                  },
                },
                "required": [
                  "netPrice",
                ],
                "type": "object",
              },
            },
          },
        }
      `);
    });
  });

  describe("paths", () => {
    it("should remove requestBody from get request", async () => {
      const { patchedSchema, outdatedPatches } = patchJsonSchema({
        openApiSchema: json5.parse(`{
          "paths": {
            "/role": {
              "get": {
                "operationId": "readRoles",
                "parameters": [],
                "requestBody": {
                  "required": false,
                  "content": {
                    "application/json": {
                      "schema": {
                        "allOf": [{ "$ref": "#/components/schemas/Criteria" }]
                      }
                    }
                  }
                }
              },
            },
          },
        }`),
        jsonOverrides: json5.parse(`{
          paths: {
            "/role": {
              "get": {
                "requestBody": "_DELETE_"
              }
            }
          },
        }`),
      });

      expect(patchedSchema).toMatchInlineSnapshot(`
        {
          "paths": {
            "/role": {
              "get": {
                "operationId": "readRoles",
                "parameters": [],
              },
            },
          },
        }
      `);
      expect(outdatedPatches.length).toBe(0);
    });
  });
});
