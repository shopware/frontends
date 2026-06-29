import type { SchemaObject } from "openapi-typescript";
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
