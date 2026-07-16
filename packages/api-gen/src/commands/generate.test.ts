import openapiTS, {
  astToString,
  type OpenAPI3,
  type SchemaObject,
} from "openapi-typescript";
import ts from "typescript";
import { describe, expect, it } from "vitest";

import { normalizeCustomFieldsTypes, runTransformations } from "./generate";

function printTypeNode(typeNode: ts.TypeNode) {
  const printer = ts.createPrinter();
  const sourceFile = ts.createSourceFile(
    "type-node.ts",
    "",
    ts.ScriptTarget.Latest,
  );

  return printer.printNode(ts.EmitHint.Unspecified, typeNode, sourceFile);
}

describe("generate transformations", () => {
  it("uses CustomFields for customFields object schemas", () => {
    const typeNode = runTransformations({ type: "object" } as SchemaObject, {
      path: "#/components/schemas/Product/properties/customFields",
    });

    expect(typeNode && printTypeNode(typeNode)).toBe("CustomFields | null");
  });

  it("keeps generic object schemas as GenericRecord", () => {
    const typeNode = runTransformations({ type: "object" } as SchemaObject, {
      path: "#/components/schemas/Criteria/properties/associations",
    });

    expect(typeNode && printTypeNode(typeNode)).toBe("GenericRecord");
  });

  it("uses literal types for const schema values", () => {
    expect(
      printTypeNode(
        runTransformations({
          type: "string",
          const: "product",
        } as SchemaObject)!,
      ),
    ).toBe('"product"');
    expect(
      printTypeNode(
        runTransformations({
          type: "number",
          const: -1,
        } as SchemaObject)!,
      ),
    ).toBe("-1");
    expect(
      printTypeNode(
        runTransformations({
          type: "boolean",
          const: true,
        } as SchemaObject)!,
      ),
    ).toBe("true");
    expect(
      printTypeNode(
        runTransformations({
          const: null,
        } as SchemaObject)!,
      ),
    ).toBe("null");
  });

  it("uses string literal types for string schemas with non-string const values", () => {
    expect(
      printTypeNode(
        runTransformations({
          type: "string",
          const: 1,
        } as SchemaObject)!,
      ),
    ).toBe('"1"');
  });

  it("generates string const schema values as literal types", async () => {
    const ast = await openapiTS(
      {
        openapi: "3.1.0",
        info: {
          title: "Test schema",
          version: "1.0.0",
        },
        paths: {},
        components: {
          schemas: {
            Product: {
              type: "object",
              required: ["apiAlias"],
              properties: {
                apiAlias: {
                  type: "string",
                  const: "product",
                },
              },
            },
          },
        },
      } as OpenAPI3,
      {
        version: 3,
        exportType: true,
        transform: runTransformations,
      },
    );

    expect(astToString(ast)).toContain('apiAlias: "product";');
  });

  it("generates non-string const values on string schemas as string literal types", async () => {
    const ast = await openapiTS(
      {
        openapi: "3.1.0",
        info: {
          title: "Test schema",
          version: "1.0.0",
        },
        paths: {},
        components: {
          schemas: {
            Product: {
              type: "object",
              required: ["apiAlias"],
              properties: {
                apiAlias: {
                  type: "string",
                  const: 1,
                },
              },
            },
          },
        },
      } as OpenAPI3,
      {
        version: 3,
        exportType: true,
        transform: runTransformations,
      },
    );

    expect(astToString(ast)).toContain('apiAlias: "1";');
  });

  it("normalizes generated customFields properties", () => {
    const schema = `type GenericRecord =
  | never
  | null
  | string
  | string[]
  | number
  | { [key: string]: GenericRecord };
export type Schemas = {
  Product: {
    associations?: GenericRecord;
    customFields?: GenericRecord;
  };
  NewsletterRecipient: {
    customFields?: string;
  };
};`;

    expect(normalizeCustomFieldsTypes(schema)).toMatchInlineSnapshot(`
      "type GenericRecord =
        | never
        | null
        | string
        | string[]
        | number
        | { [key: string]: GenericRecord };
      type CustomFields = { [key: string]: CustomFieldValue };
      type CustomFieldValue = null | string | string[] | number | boolean | CustomFieldValue[] | { [key: string]: CustomFieldValue };
      export type Schemas = {
        Product: {
          associations?: GenericRecord;
          customFields?: CustomFields | null;
        };
        NewsletterRecipient: {
          customFields?: CustomFields | null;
        };
      };"
    `);
  });
});
