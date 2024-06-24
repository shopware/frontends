import { describe, expect, it } from "vitest";
import componentsApiAliasRule from "./componentsApiAlias.rule";
import { ObjectSubtype } from "openapi-typescript";

describe("componentsApiAlias.rule", async () => {
  it("Lowercase component name is proper name", async () => {
    const componentName = "Category";
    const body = {
      type: "object",
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
      properties: {
        apiAlias: {
          type: "string",
          enum: ["cmsBlock"],
        },
      },
    } as ObjectSubtype;

    const result = componentsApiAliasRule(componentName, body);

    expect(result).not.toBe(null);
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

  it("should fail if apiALias exist but is not marked as required", async () => {
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
  });
});
