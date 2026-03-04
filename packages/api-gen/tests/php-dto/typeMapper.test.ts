import { describe, expect, it } from "vitest";
import {
  getSchemaType,
  hasTypeNull,
  isValidPhpClassName,
  mapOpenApiTypeToPhp,
  resolveRefName,
  toDtoClassName,
  toPascalCase,
} from "../../src/php-dto/typeMapper";

describe("typeMapper", () => {
  describe("resolveRefName", () => {
    it("extracts the last segment from a $ref path", () => {
      expect(resolveRefName("#/components/schemas/Cart")).toBe("Cart");
    });

    it("handles single-segment ref", () => {
      expect(resolveRefName("Product")).toBe("Product");
    });
  });

  describe("toDtoClassName", () => {
    it("appends DTO suffix", () => {
      expect(toDtoClassName("Product")).toBe("ProductDTO");
      expect(toDtoClassName("Cart")).toBe("CartDTO");
    });
  });

  describe("mapOpenApiTypeToPhp", () => {
    it("maps string to string", () => {
      expect(mapOpenApiTypeToPhp({ type: "string" })).toEqual({
        phpType: "string",
        isArray: false,
        nullable: false,
      });
    });

    it("maps integer to int", () => {
      expect(mapOpenApiTypeToPhp({ type: "integer" })).toEqual({
        phpType: "int",
        isArray: false,
        nullable: false,
      });
    });

    it("maps number to float", () => {
      expect(mapOpenApiTypeToPhp({ type: "number" })).toEqual({
        phpType: "float",
        isArray: false,
        nullable: false,
      });
    });

    it("maps boolean to bool", () => {
      expect(mapOpenApiTypeToPhp({ type: "boolean" })).toEqual({
        phpType: "bool",
        isArray: false,
        nullable: false,
      });
    });

    it("maps $ref to DTO class name", () => {
      expect(
        mapOpenApiTypeToPhp({ $ref: "#/components/schemas/Product" }),
      ).toEqual({
        phpType: "ProductDTO",
        isArray: false,
        nullable: false,
      });
    });

    it("maps array with $ref items", () => {
      expect(
        mapOpenApiTypeToPhp({
          type: "array",
          items: { $ref: "#/components/schemas/LineItem" },
        }),
      ).toEqual({
        phpType: "array",
        isArray: true,
        arrayItemType: "LineItemDTO",
        nullable: false,
      });
    });

    it("maps array with primitive items", () => {
      expect(
        mapOpenApiTypeToPhp({
          type: "array",
          items: { type: "string" },
        }),
      ).toEqual({
        phpType: "array",
        isArray: true,
        arrayItemType: "string",
        nullable: false,
      });
    });

    it("maps array without items", () => {
      expect(mapOpenApiTypeToPhp({ type: "array" })).toEqual({
        phpType: "array",
        isArray: true,
        nullable: false,
      });
    });

    it("maps oneOf with null to nullable type", () => {
      expect(
        mapOpenApiTypeToPhp({
          oneOf: [{ type: "string" }, { type: "null" }],
        }),
      ).toEqual({
        phpType: "string",
        isArray: false,
        nullable: true,
      });
    });

    it("maps oneOf with multiple non-null types to mixed", () => {
      expect(
        mapOpenApiTypeToPhp({
          oneOf: [{ type: "string" }, { type: "integer" }],
        }),
      ).toEqual({
        phpType: "mixed",
        isArray: false,
        nullable: false,
      });
    });

    it("maps anyOf with null to nullable", () => {
      expect(
        mapOpenApiTypeToPhp({
          anyOf: [{ type: "integer" }, { type: "null" }],
        }),
      ).toEqual({
        phpType: "int",
        isArray: false,
        nullable: true,
      });
    });

    it("maps allOf with single schema", () => {
      expect(
        mapOpenApiTypeToPhp({
          allOf: [{ $ref: "#/components/schemas/Media" }],
        }),
      ).toEqual({
        phpType: "MediaDTO",
        isArray: false,
        nullable: false,
      });
    });

    it("maps allOf with $ref among multiple schemas", () => {
      expect(
        mapOpenApiTypeToPhp({
          allOf: [
            { type: "object", properties: { extra: { type: "string" } } },
            { $ref: "#/components/schemas/Address" },
          ],
        }),
      ).toEqual({
        phpType: "AddressDTO",
        isArray: false,
        nullable: false,
      });
    });

    it("maps type array with null to nullable", () => {
      expect(mapOpenApiTypeToPhp({ type: ["string", "null"] })).toEqual({
        phpType: "string",
        isArray: false,
        nullable: true,
      });
    });

    it("maps object type to array", () => {
      expect(mapOpenApiTypeToPhp({ type: "object" })).toEqual({
        phpType: "array",
        isArray: false,
        nullable: false,
      });
    });

    it("maps unknown type to mixed", () => {
      expect(mapOpenApiTypeToPhp({})).toEqual({
        phpType: "mixed",
        isArray: false,
        nullable: false,
      });
    });

    it("maps type: ['integer', 'null'] to nullable int", () => {
      expect(mapOpenApiTypeToPhp({ type: ["integer", "null"] })).toEqual({
        phpType: "int",
        isArray: false,
        nullable: true,
      });
    });

    it("maps type: ['array', 'null'] with items to nullable array", () => {
      expect(
        mapOpenApiTypeToPhp({
          type: ["array", "null"],
          items: { type: "string" },
        }),
      ).toEqual({
        phpType: "array",
        isArray: true,
        arrayItemType: "string",
        nullable: true,
      });
    });

    it("maps type: ['object', 'null'] to nullable array", () => {
      expect(mapOpenApiTypeToPhp({ type: ["object", "null"] })).toEqual({
        phpType: "array",
        isArray: false,
        nullable: true,
      });
    });

    it("does not treat plain string type as nullable", () => {
      expect(mapOpenApiTypeToPhp({ type: "string" }).nullable).toBe(false);
    });
  });

  describe("toPascalCase", () => {
    it("converts hyphenated names", () => {
      expect(toPascalCase("api-info")).toBe("ApiInfo");
      expect(toPascalCase("Api-info")).toBe("ApiInfo");
    });

    it("converts underscored names", () => {
      expect(toPascalCase("some_thing")).toBe("SomeThing");
    });

    it("converts mixed separators", () => {
      expect(toPascalCase("my-special_name.test")).toBe("MySpecialNameTest");
    });

    it("preserves already PascalCase names", () => {
      expect(toPascalCase("CartDTO")).toBe("CartDTO");
      expect(toPascalCase("ProductDTO")).toBe("ProductDTO");
    });

    it("handles names with numbers", () => {
      expect(toPascalCase("b2b-components")).toBe("B2bComponents");
    });

    it("handles names ending with DTO suffix through separators", () => {
      expect(toPascalCase("Api-infoRequestDTO")).toBe("ApiInfoRequestDTO");
    });
  });

  describe("isValidPhpClassName", () => {
    it("accepts valid class names", () => {
      expect(isValidPhpClassName("CartDTO")).toBe(true);
      expect(isValidPhpClassName("ProductDTO")).toBe(true);
      expect(isValidPhpClassName("_Internal")).toBe(true);
    });

    it("rejects names with hyphens", () => {
      expect(isValidPhpClassName("Api-infoDTO")).toBe(false);
    });

    it("rejects names with dots", () => {
      expect(isValidPhpClassName("Some.ClassDTO")).toBe(false);
    });

    it("rejects names starting with a digit", () => {
      expect(isValidPhpClassName("2FactorDTO")).toBe(false);
    });

    it("rejects empty string", () => {
      expect(isValidPhpClassName("")).toBe(false);
    });
  });

  describe("hasTypeNull", () => {
    it("returns true for type array containing null", () => {
      expect(hasTypeNull({ type: ["string", "null"] })).toBe(true);
    });

    it("returns false for plain string type", () => {
      expect(hasTypeNull({ type: "string" })).toBe(false);
    });

    it("returns false for type array without null", () => {
      expect(hasTypeNull({ type: ["string", "integer"] })).toBe(false);
    });

    it("returns false when type is undefined", () => {
      expect(hasTypeNull({})).toBe(false);
    });
  });

  describe("getSchemaType", () => {
    it("returns the type for a plain string type", () => {
      expect(getSchemaType({ type: "string" })).toBe("string");
    });

    it("returns the non-null type from a type array", () => {
      expect(getSchemaType({ type: ["string", "null"] })).toBe("string");
    });

    it("returns undefined for multiple non-null types", () => {
      expect(getSchemaType({ type: ["string", "integer"] })).toBeUndefined();
    });

    it("returns undefined when type is missing", () => {
      expect(getSchemaType({})).toBeUndefined();
    });
  });
});
