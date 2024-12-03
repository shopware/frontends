import { describe, expect, it } from "vitest";
import { extendedDefu } from "./patchJsonSchema";

describe("mergingObjects - extendedDefu", () => {
  it("should merge error objects properly", () => {
    const result = extendedDefu(
      {
        errors: {
          type: "object",
          items: "_DELETE_",
          anyOf: [
            {
              type: "array",
              items: { $ref: "#/components/schemas/CartError" },
            },
            {
              type: "object",
              additionalProperties: {
                type: "object",
                properties: {
                  code: {
                    type: "number",
                  },
                  key: {
                    type: "string",
                  },
                  level: {
                    type: "number",
                  },
                  message: {
                    type: "string",
                  },
                  messageKey: {
                    type: "string",
                  },
                },
                required: ["code", "key", "level", "message", "messageKey"],
              },
            },
          ],
        },
      },
      {
        errors: {
          type: "array",
          description:
            "A list of all cart errors, such as insufficient stocks, invalid addresses or vouchers.",
          items: { $ref: "#/components/schemas/CartError" },
        },
      },
    );

    expect(result).toMatchInlineSnapshot(`
      {
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
      }
    `);
  });

  it("should omit _DELETE_ if object not existed", () => {
    const result = extendedDefu(
      {},
      {
        CartError: {
          required: ["key", "level", "message", "messageKey"],
          properties: {
            items: "_DELETE_",
            key: { type: "string" },
            level: {
              type: "number",
              enum: [0, 10, 20],
              description: "* `0` - notice,\n* `10` - warning,\n* `20` - error",
            },
            message: { type: "string" },
            messageKey: { type: "string" },
          },
        },
      },
    );

    expect(result).toMatchInlineSnapshot(`
      {
        "CartError": {
          "properties": {
            "items": "_DELETE_",
            "key": {
              "type": "string",
            },
            "level": {
              "description": "* \`0\` - notice,
      * \`10\` - warning,
      * \`20\` - error",
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
          "required": [
            "key",
            "level",
            "message",
            "messageKey",
          ],
        },
      }
    `);
  });
});
