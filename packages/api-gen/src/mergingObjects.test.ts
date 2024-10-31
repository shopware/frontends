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
});
