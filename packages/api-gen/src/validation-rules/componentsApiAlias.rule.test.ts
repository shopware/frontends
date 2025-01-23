import type { ObjectSubtype } from "openapi-typescript";
import { describe, expect, it } from "vitest";
import componentsApiAliasRule from "./componentsApiAlias.rule";

function _uncolorize(str: string | null) {
  // biome-ignore lint: noControlCharactersInRegex used to decolorize output
  return str?.replace(/\u001b[^m]*?m/g, "");
}

describe("componentsApiAlias.rule", async () => {
  it("Lowercase component name is proper name", async () => {
    const componentName = "Category";
    const body = {
      type: "object",
      required: ["apiAlias"],
      properties: {
        apiAlias: {
          type: "string",
          enum: ["category"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).toBe(null);
  });

  it("alias should be written in snake_case", async () => {
    const componentName = "CmsBlock";
    const body = {
      type: "object",
      required: ["apiAlias"],
      properties: {
        apiAlias: {
          type: "string",
          enum: ["cms_block"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).toBe(null);
  });

  it("should fail if alias is not in snake_case", async () => {
    const componentName = "CmsBlock";
    const body = {
      type: "object",
      required: ["apiAlias"],
      properties: {
        apiAlias: {
          type: "string",
          enum: ["cmsBlock"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
    expect(_uncolorize(result)).toMatchInlineSnapshot(`
      "Component CmsBlock has invalid apiAlias definition. Diff:
       - Expected
      + Received

        {
          "enum": [
      -     "cms_block",
      +     "cmsBlock",
          ],
          "type": "string",
        }
      It's also possible, that the schema component name is not correct and apiApias is proper. In that case schema component name should be CmsBlock. Confirm proper solution with the source code."
    `);
  });

  it("should fail if name is not matching component name", async () => {
    const componentName = "PriceDefinition";
    const body = {
      type: "object",
      properties: {
        apiAlias: {
          type: "string",
          enum: ["cart_price_quantity"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
    expect(_uncolorize(result)).toMatchInlineSnapshot(`
      "Component PriceDefinition has invalid apiAlias definition. Diff:
       - Expected
      + Received

        {
          "enum": [
      -     "price_definition",
      +     "cart_price_quantity",
          ],
          "type": "string",
        }
      It's also possible, that the schema component name is not correct and apiApias is proper. In that case schema component name should be CartPriceQuantity. Confirm proper solution with the source code."
    `);
  });

  it("should not fail if component definition does not have apiAlias", async () => {
    const componentName = "PriceDefinition";
    const body = {
      type: "object",
      properties: {},
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).toBe(null);
  });

  it("should fail if apiAlias exist but is not marked as required", async () => {
    const componentName = "Cart";
    const body = {
      type: "object",
      required: ["id"],
      properties: {
        apiAlias: {
          type: "string",
          enum: ["cart"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
    expect(_uncolorize(result)).toMatchInlineSnapshot(
      `"Component Cart has invalid apiAlias definition. This field should be required."`,
    );
  });

  it("should fail if apiAlias exist and there is no required definition", async () => {
    const componentName = "Cart";
    const body = {
      type: "object",
      properties: {
        apiAlias: {
          type: "string",
          enum: ["cart"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
    expect(_uncolorize(result)).toMatchInlineSnapshot(
      `"Component Cart has invalid apiAlias definition. This field should be required."`,
    );
  });

  it("should indicate that the name of the entity might not be correct instead of schema name", async () => {
    const componentName = "CmsBlockResult";
    const body = {
      type: "object",
      required: ["apiAlias"],
      properties: {
        apiAlias: {
          type: "string",
          enum: ["cms_block"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
    expect(_uncolorize(result)).toContain(
      "In that case schema component name should be",
    );
  });

  it("should display diff wihout additional message when enum is incorrect", async () => {
    const componentName = "CmsBlockResult";
    const body = {
      type: "object",
      required: ["apiAlias"],
      properties: {
        apiAlias: {
          type: "string",
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
    expect(_uncolorize(result)).not.toContain(
      "In that case schema component name should be",
    );
  });

  it("should display diff wihout additional message when names are proper", async () => {
    const componentName = "CmsBlockResult";
    // @ts-expect-error - pris is not a valid enum type value
    const body = {
      type: "object",
      required: ["apiAlias"],
      properties: {
        apiAlias: {
          type: "object",
          enum: ["cms_block_result"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
    expect(_uncolorize(result)).not.toContain(
      "In that case schema component name should be",
    );
  });
});
