import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
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

    it("skips responses that are $ref only", () => {
      const dtos = parseResponseBodies(fixtureSchema);
      const names = dtos.map((d) => d.name);

      expect(names).not.toContain("ReadCartResponseDTO");
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
  });
});
