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
