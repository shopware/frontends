import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { OpenApiSchema } from "../../src/php-dto/openApiTypes";
import {
  parseAllDtos,
  parseComponentSchemas,
  parseRequestBodies,
  parseResponseBodies,
} from "../../src/php-dto/schemaParser";

const fixtureSchema = JSON.parse(
  readFileSync(resolve(__dirname, "fixtures/simpleSchema.json"), "utf-8"),
);

const nestedSchema = JSON.parse(
  readFileSync(resolve(__dirname, "fixtures/nestedObjects.json"), "utf-8"),
);

const tagSchema = JSON.parse(
  readFileSync(resolve(__dirname, "fixtures/tagSchema.json"), "utf-8"),
);

describe("schemaParser", () => {
  describe("parseComponentSchemas", () => {
    it("extracts DTO definitions from components/schemas", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("CartDTO");
      expect(names).toContain("CalculatedPriceDTO");
      expect(names).toContain("LineItemDTO");
      expect(names).toContain("NullableUnionDTO");
    });

    it("sets source to component for component schemas", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      for (const dto of dtos) {
        expect(dto.source).toBe("component");
      }
    });

    it("skips schemas without object properties", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).not.toContain("EmptySchemaDTO");
    });

    it("parses Cart component correctly", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const cart = dtos.find((d) => d.name === "CartDTO");

      expect(cart).toBeDefined();
      expect(cart?.description).toBe("Shopping cart");
      expect(cart?.properties).toHaveLength(7);

      const token = cart?.properties.find((p) => p.name === "token");
      expect(token).toEqual({
        name: "token",
        phpType: "string",
        nullable: false,
        required: true,
        description: "Context token identifying the cart",
        pattern: undefined,
        isArray: false,
        arrayItemType: undefined,
      });

      const name = cart?.properties.find((p) => p.name === "name");
      expect(name?.nullable).toBe(false);
      expect(name?.required).toBe(false);

      const price = cart?.properties.find((p) => p.name === "price");
      expect(price?.phpType).toBe("CalculatedPriceDTO");

      const lineItems = cart?.properties.find((p) => p.name === "lineItems");
      expect(lineItems?.phpType).toBe("array");
      expect(lineItems?.isArray).toBe(true);
      expect(lineItems?.arrayItemType).toBe("LineItemDTO");
    });

    it("parses LineItem with pattern", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const lineItem = dtos.find((d) => d.name === "LineItemDTO");
      const id = lineItem?.properties.find((p) => p.name === "id");

      expect(id?.pattern).toBe("^[0-9a-f]{32}$");
      expect(id?.required).toBe(true);
    });

    it("parses enum values from properties", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const navType = dtos.find((d) => d.name === "NavigationTypeDTO");

      expect(navType).toBeDefined();

      const type = navType?.properties.find((p) => p.name === "type");
      expect(type?.enum).toEqual(["page", "link", "folder"]);
      expect(type?.required).toBe(true);

      const routeName = navType?.properties.find((p) => p.name === "routeName");
      expect(routeName?.enum).toEqual([
        "frontend.navigation.page",
        "frontend.landing.page",
        "frontend.detail.page",
      ]);

      const linkType = navType?.properties.find((p) => p.name === "linkType");
      expect(linkType?.enum).toEqual([
        "external",
        "category",
        "product",
        "landing_page",
      ]);
      expect(linkType?.required).toBe(false);
      expect(linkType?.nullable).toBe(false);
    });

    it("distinguishes explicit nullability from optionality", () => {
      const dtos = parseComponentSchemas(fixtureSchema);

      const nullableUnion = dtos.find((d) => d.name === "NullableUnionDTO");
      const value = nullableUnion?.properties.find((p) => p.name === "value");
      expect(value?.nullable).toBe(true);
      expect(value?.required).toBe(false);

      const count = nullableUnion?.properties.find((p) => p.name === "count");
      expect(count?.nullable).toBe(true);
      expect(count?.phpType).toBe("int");

      const cart = dtos.find((d) => d.name === "CartDTO");
      const name = cart?.properties.find((p) => p.name === "name");
      expect(name?.nullable).toBe(false);
      expect(name?.required).toBe(false);
    });

    it("extracts explicit default values", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const defaults = dtos.find((d) => d.name === "DefaultValuesDTO");
      expect(defaults).toBeDefined();

      const limit = defaults?.properties.find((p) => p.name === "limit");
      expect(limit?.defaultValue).toBe(10);

      const sortOrder = defaults?.properties.find(
        (p) => p.name === "sortOrder",
      );
      expect(sortOrder?.defaultValue).toBe("relevance");

      const active = defaults?.properties.find((p) => p.name === "active");
      expect(active?.defaultValue).toBe(true);
    });

    it("uses single-enum value as default when no explicit default", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const defaults = dtos.find((d) => d.name === "DefaultValuesDTO");

      const source = defaults?.properties.find((p) => p.name === "source");
      expect(source?.defaultValue).toBe("storefront");
    });

    it("prefers explicit default over single-enum fallback", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const defaults = dtos.find((d) => d.name === "DefaultValuesDTO");

      const channel = defaults?.properties.find((p) => p.name === "channel");
      expect(channel?.defaultValue).toBe("web");
    });

    it("does not set default for multi-value enum without explicit default", () => {
      const dtos = parseComponentSchemas(fixtureSchema);
      const navType = dtos.find((d) => d.name === "NavigationTypeDTO");
      const type = navType?.properties.find((p) => p.name === "type");
      expect(type?.defaultValue).toBeUndefined();
    });

    it("handles empty schema", () => {
      const dtos = parseComponentSchemas({ components: { schemas: {} } });
      expect(dtos).toHaveLength(0);
    });

    it("handles missing components", () => {
      const dtos = parseComponentSchemas({});
      expect(dtos).toHaveLength(0);
    });

    it("extracts nested inline objects as separate DTOs", () => {
      const dtos = parseComponentSchemas(nestedSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("SalesChannelContextDTO");
      expect(names).toContain("SalesChannelContextContextDTO");
      expect(names).toContain("SalesChannelContextContextSourceDTO");
      expect(names).toContain("SalesChannelContextCurrentCustomerGroupDTO");
      expect(names).toContain("SalesChannelContextItemRoundingDTO");
      expect(names).toContain("SalesChannelContextTaxRulesDTO");
    });

    it("references nested DTO type in the parent property", () => {
      const dtos = parseComponentSchemas(nestedSchema);
      const salesChannelContext = dtos.find(
        (d) => d.name === "SalesChannelContextDTO",
      );
      expect(salesChannelContext).toBeDefined();

      const contextProp = salesChannelContext?.properties.find(
        (p) => p.name === "context",
      );
      expect(contextProp?.phpType).toBe("SalesChannelContextContextDTO");
      expect(contextProp?.isArray).toBe(false);
      expect(contextProp?.nullable).toBe(false);

      const customerGroup = salesChannelContext?.properties.find(
        (p) => p.name === "currentCustomerGroup",
      );
      expect(customerGroup?.phpType).toBe(
        "SalesChannelContextCurrentCustomerGroupDTO",
      );
      expect(customerGroup?.isArray).toBe(false);
      expect(customerGroup?.nullable).toBe(false);

      const itemRounding = salesChannelContext?.properties.find(
        (p) => p.name === "itemRounding",
      );
      expect(itemRounding?.phpType).toBe("SalesChannelContextItemRoundingDTO");
      expect(itemRounding?.required).toBe(true);
      expect(itemRounding?.nullable).toBe(false);
    });

    it("extracts deeply nested inline objects within inline objects", () => {
      const dtos = parseComponentSchemas(nestedSchema);

      const contextDto = dtos.find(
        (d) => d.name === "SalesChannelContextContextDTO",
      );
      expect(contextDto).toBeDefined();
      expect(contextDto?.description).toBe(
        "Core context with general configuration values and state",
      );

      const sourceProp = contextDto?.properties.find(
        (p) => p.name === "source",
      );
      expect(sourceProp?.phpType).toBe("SalesChannelContextContextSourceDTO");
      expect(sourceProp?.isArray).toBe(false);

      const sourceDto = dtos.find(
        (d) => d.name === "SalesChannelContextContextSourceDTO",
      );
      expect(sourceDto).toBeDefined();
      expect(sourceDto?.properties).toHaveLength(2);

      const typeProp = sourceDto?.properties.find((p) => p.name === "type");
      expect(typeProp?.required).toBe(true);
      expect(typeProp?.enum).toEqual(["sales-channel", "shop-api"]);

      const salesChannelId = sourceDto?.properties.find(
        (p) => p.name === "salesChannelId",
      );
      expect(salesChannelId?.required).toBe(true);
      expect(salesChannelId?.phpType).toBe("string");
    });

    it("extracts properties of nested inline objects correctly", () => {
      const dtos = parseComponentSchemas(nestedSchema);

      const rounding = dtos.find(
        (d) => d.name === "SalesChannelContextItemRoundingDTO",
      );
      expect(rounding).toBeDefined();
      expect(rounding?.properties).toHaveLength(3);

      const decimals = rounding?.properties.find((p) => p.name === "decimals");
      expect(decimals?.phpType).toBe("int");
      expect(decimals?.required).toBe(true);

      const roundForNet = rounding?.properties.find(
        (p) => p.name === "roundForNet",
      );
      expect(roundForNet?.phpType).toBe("bool");
      expect(roundForNet?.required).toBe(true);
    });

    it("handles arrays of inline objects", () => {
      const dtos = parseComponentSchemas(nestedSchema);
      const context = dtos.find((d) => d.name === "SalesChannelContextDTO");

      const taxRules = context?.properties.find((p) => p.name === "taxRules");
      expect(taxRules?.phpType).toBe("array");
      expect(taxRules?.isArray).toBe(true);
      expect(taxRules?.arrayItemType).toBe("SalesChannelContextTaxRulesDTO");

      const taxRuleDto = dtos.find(
        (d) => d.name === "SalesChannelContextTaxRulesDTO",
      );
      expect(taxRuleDto).toBeDefined();
      expect(taxRuleDto?.properties).toHaveLength(2);

      const taxRate = taxRuleDto?.properties.find((p) => p.name === "taxRate");
      expect(taxRate?.required).toBe(true);
    });

    it("handles deeply nested inline objects", () => {
      const dtos = parseComponentSchemas(nestedSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("OrderBillingAddressDTO");
      expect(names).toContain("OrderBillingAddressCountryDTO");

      const order = dtos.find((d) => d.name === "OrderDTO");
      const billing = order?.properties.find(
        (p) => p.name === "billingAddress",
      );
      expect(billing?.phpType).toBe("OrderBillingAddressDTO");

      const billingDto = dtos.find((d) => d.name === "OrderBillingAddressDTO");
      const country = billingDto?.properties.find((p) => p.name === "country");
      expect(country?.phpType).toBe("OrderBillingAddressCountryDTO");

      const countryDto = dtos.find(
        (d) => d.name === "OrderBillingAddressCountryDTO",
      );
      expect(countryDto).toBeDefined();
      expect(countryDto?.properties).toHaveLength(2);
    });

    it("keeps $ref properties unchanged for non-inline objects", () => {
      const dtos = parseComponentSchemas(nestedSchema);
      const context = dtos.find((d) => d.name === "SalesChannelContextDTO");

      const salesChannel = context?.properties.find(
        (p) => p.name === "salesChannel",
      );
      expect(salesChannel?.phpType).toBe("SalesChannelDTO");
      expect(salesChannel?.isArray).toBe(false);
    });
  });

  describe("parseRequestBodies", () => {
    it("extracts request body DTOs from paths", () => {
      const dtos = parseRequestBodies(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("SendContactMailRequestDTO");
    });

    it("sets source to operation for request DTOs", () => {
      const dtos = parseRequestBodies(fixtureSchema);
      for (const dto of dtos) {
        expect(dto.source).toBe("operation");
      }
    });

    it("parses sendContactMail request body correctly", () => {
      const dtos = parseRequestBodies(fixtureSchema);
      const dto = dtos.find((d) => d.name === "SendContactMailRequestDTO");

      expect(dto).toBeDefined();
      expect(dto?.description).toBe("Used for submitting contact forms.");
      expect(dto?.properties.length).toBeGreaterThanOrEqual(6);

      const email = dto?.properties.find((p) => p.name === "email");
      expect(email?.required).toBe(true);
      expect(email?.nullable).toBe(false);

      const salutationId = dto?.properties.find(
        (p) => p.name === "salutationId",
      );
      expect(salutationId?.required).toBe(false);
      expect(salutationId?.nullable).toBe(false);
      expect(salutationId?.pattern).toBe("^[0-9a-f]{32}$");
    });

    it("includes path parameters in request DTOs", () => {
      const dtos = parseRequestBodies(fixtureSchema);
      const dto = dtos.find((d) => d.name === "ReadProductRequestDTO");

      expect(dto).toBeDefined();
      const productId = dto?.properties.find((p) => p.name === "productId");
      expect(productId).toBeDefined();
      expect(productId?.required).toBe(true);
      expect(productId?.pattern).toBe("^[0-9a-f]{32}$");
    });

    it("skips header parameters", () => {
      const dtos = parseRequestBodies(fixtureSchema);
      const dto = dtos.find((d) => d.name === "SendContactMailRequestDTO");
      const headerParam = dto?.properties.find(
        (p) => p.name === "sw-language-id",
      );
      expect(headerParam).toBeUndefined();
    });

    it("skips operations without request body or parameters", () => {
      const dtos = parseRequestBodies(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).not.toContain("DeleteCartRequestDTO");
    });

    it("handles missing paths", () => {
      const dtos = parseRequestBodies({});
      expect(dtos).toHaveLength(0);
    });
  });

  describe("parseResponseBodies", () => {
    it("extracts response DTOs from inline response schemas", () => {
      const dtos = parseResponseBodies(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("ReadProductResponseDTO");
    });

    it("sets source to operation for response DTOs", () => {
      const dtos = parseResponseBodies(fixtureSchema);
      for (const dto of dtos) {
        expect(dto.source).toBe("operation");
      }
    });

    it("resolves $ref responses to component schemas", () => {
      const dtos = parseResponseBodies(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("ReadCartResponseDTO");
    });

    it("handles missing paths", () => {
      const dtos = parseResponseBodies({});
      expect(dtos).toHaveLength(0);
    });
  });

  describe("parseAllDtos", () => {
    it("returns components, request bodies, and response bodies", () => {
      const dtos = parseAllDtos(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("CartDTO");
      expect(names).toContain("SendContactMailRequestDTO");
      expect(names).toContain("ReadProductResponseDTO");
    });

    it("without tag returns all DTOs", () => {
      const all = parseAllDtos(tagSchema);
      const names = all.map((d) => d.name);

      expect(names).toContain("ProductDTO");
      expect(names).toContain("CartDTO");
      expect(names).toContain("CategoryDTO");
      expect(names).toContain("AddLineItemRequestDTO");
      expect(names).toContain("ReadCategoriesResponseDTO");
    });

    it("with tag filters to matching operations and referenced schemas", () => {
      const dtos = parseAllDtos(tagSchema, { tag: "Cart" });
      const names = dtos.map((d) => d.name);

      expect(names).toContain("AddLineItemRequestDTO");
      expect(names).toContain("CartDTO");
      expect(names).toContain("LineItemDTO");
      expect(names).toContain("ProductDTO");
      expect(names).toContain("MediaDTO");

      expect(names).not.toContain("CategoryDTO");
      expect(names).not.toContain("ReadCategoriesResponseDTO");
      expect(names).not.toContain("ReadProductRequestDTO");
    });

    it("with tag includes transitively referenced schemas", () => {
      const dtos = parseAllDtos(tagSchema, { tag: "Product" });
      const names = dtos.map((d) => d.name);

      expect(names).toContain("ProductDTO");
      expect(names).toContain("MediaDTO");
      expect(names).toContain("ReadProductRequestDTO");
      expect(names).toContain("ReadProductResponseDTO");

      expect(names).not.toContain("CartDTO");
      expect(names).not.toContain("LineItemDTO");
      expect(names).not.toContain("CategoryDTO");
    });

    it("with non-matching tag returns empty", () => {
      const dtos = parseAllDtos(tagSchema, { tag: "NonExistent" });
      expect(dtos).toHaveLength(0);
    });
  });

  describe("oneOf request bodies", () => {
    let oneOfSchema: Record<string, unknown>;

    beforeAll(async () => {
      oneOfSchema = JSON.parse(
        readFileSync(resolve(__dirname, "fixtures/oneOfRequest.json"), "utf-8"),
      );
    });

    it("generates a separate DTO per oneOf variant using title", () => {
      const dtos = parseRequestBodies(oneOfSchema as OpenApiSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("LegacyImpersonationPayloadDTO");
      expect(names).toContain("JwtImpersonationPayloadDTO");
      expect(names).not.toContain("ImitateCustomerLoginRequestDTO");
    });

    it("variant DTOs have correct properties", () => {
      const dtos = parseRequestBodies(oneOfSchema as OpenApiSchema);

      const legacy = dtos.find(
        (d) => d.name === "LegacyImpersonationPayloadDTO",
      );
      expect(legacy).toBeDefined();
      expect(legacy?.properties.map((p) => p.name)).toEqual(
        expect.arrayContaining(["token", "customerId", "userId"]),
      );
      expect(legacy?.properties.find((p) => p.name === "token")?.required).toBe(
        true,
      );

      const jwt = dtos.find((d) => d.name === "JwtImpersonationPayloadDTO");
      expect(jwt).toBeDefined();
      expect(jwt?.properties).toHaveLength(1);
      expect(jwt?.properties[0]?.name).toBe("token");
    });

    it("variant DTOs are marked as operation source with endpoint path", () => {
      const dtos = parseRequestBodies(oneOfSchema as OpenApiSchema);

      for (const dto of dtos) {
        expect(dto.source).toBe("operation");
        expect(dto.endpointPath).toBe("/account/login/imitate-customer");
      }
    });
  });

  describe("oneOf with shared top-level fields", () => {
    let sharedFieldsSchema: Record<string, unknown>;

    beforeAll(async () => {
      sharedFieldsSchema = JSON.parse(
        readFileSync(
          resolve(__dirname, "fixtures/oneOfSharedFields.json"),
          "utf-8",
        ),
      );
    });

    it("merges shared properties into each variant", () => {
      const dtos = parseRequestBodies(sharedFieldsSchema as OpenApiSchema);
      const names = dtos.map((d) => d.name);

      expect(names).toContain("PrivateRegistrationDTO");
      expect(names).toContain("BusinessRegistrationDTO");
      expect(names).not.toContain("RegisterRequestDTO");
    });

    it("each variant contains shared fields plus its own", () => {
      const dtos = parseRequestBodies(sharedFieldsSchema as OpenApiSchema);

      const privateDtos = dtos.find((d) => d.name === "PrivateRegistrationDTO");
      const privateNames = privateDtos?.properties.map((p) => p.name) ?? [];
      expect(privateNames).toContain("email");
      expect(privateNames).toContain("firstName");
      expect(privateNames).toContain("lastName");
      expect(privateNames).toContain("accountType");

      const businessDtos = dtos.find(
        (d) => d.name === "BusinessRegistrationDTO",
      );
      const businessNames = businessDtos?.properties.map((p) => p.name) ?? [];
      expect(businessNames).toContain("email");
      expect(businessNames).toContain("firstName");
      expect(businessNames).toContain("lastName");
      expect(businessNames).toContain("accountType");
      expect(businessNames).toContain("company");
      expect(businessNames).toContain("vatIds");
    });

    it("shared required fields apply to all variants", () => {
      const dtos = parseRequestBodies(sharedFieldsSchema as OpenApiSchema);

      const privateDtos = dtos.find((d) => d.name === "PrivateRegistrationDTO");
      expect(
        privateDtos?.properties.find((p) => p.name === "email")?.required,
      ).toBe(true);
      expect(
        privateDtos?.properties.find((p) => p.name === "firstName")?.required,
      ).toBe(true);

      const businessDtos = dtos.find(
        (d) => d.name === "BusinessRegistrationDTO",
      );
      expect(
        businessDtos?.properties.find((p) => p.name === "email")?.required,
      ).toBe(true);
      expect(
        businessDtos?.properties.find((p) => p.name === "company")?.required,
      ).toBe(true);
      expect(
        businessDtos?.properties.find((p) => p.name === "vatIds")?.required,
      ).toBe(true);
    });

    it("variant-specific properties override shared ones", () => {
      const dtos = parseRequestBodies(sharedFieldsSchema as OpenApiSchema);

      const businessDtos = dtos.find(
        (d) => d.name === "BusinessRegistrationDTO",
      );
      const accountType = businessDtos?.properties.find(
        (p) => p.name === "accountType",
      );
      expect(accountType?.enum).toEqual(["business"]);
    });
  });

  describe("array validation (minItems and item types)", () => {
    let arraySchema: Record<string, unknown>;

    beforeAll(() => {
      arraySchema = JSON.parse(
        readFileSync(
          resolve(__dirname, "fixtures/arrayValidation.json"),
          "utf-8",
        ),
      );
    });

    it("parses minItems on array properties", () => {
      const dtos = parseRequestBodies(arraySchema as OpenApiSchema);
      const dto = dtos.find((d) => d.name === "CreateItemsRequestDTO");
      expect(dto).toBeDefined();

      const tags = dto?.properties.find((p) => p.name === "tags");
      expect(tags?.minItems).toBe(1);

      const ids = dto?.properties.find((p) => p.name === "ids");
      expect(ids?.minItems).toBe(2);

      const scores = dto?.properties.find((p) => p.name === "scores");
      expect(scores?.minItems).toBeUndefined();
    });

    it("parses item types for typed arrays", () => {
      const dtos = parseRequestBodies(arraySchema as OpenApiSchema);
      const dto = dtos.find((d) => d.name === "CreateItemsRequestDTO");

      expect(
        dto?.properties.find((p) => p.name === "tags")?.arrayItemType,
      ).toBe("string");
      expect(
        dto?.properties.find((p) => p.name === "scores")?.arrayItemType,
      ).toBe("int");
      expect(
        dto?.properties.find((p) => p.name === "flags")?.arrayItemType,
      ).toBe("bool");
      expect(
        dto?.properties.find((p) => p.name === "untyped")?.arrayItemType,
      ).toBeUndefined();
    });

    it("parses arrayItemMinLength from items.minLength", () => {
      const dtos = parseRequestBodies(arraySchema as OpenApiSchema);
      const dto = dtos.find((d) => d.name === "CreateItemsRequestDTO");

      expect(
        dto?.properties.find((p) => p.name === "vatIds")?.arrayItemMinLength,
      ).toBe(1);
      expect(
        dto?.properties.find((p) => p.name === "tags")?.arrayItemMinLength,
      ).toBeUndefined();
    });
  });
});
