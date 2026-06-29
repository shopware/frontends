import { describe, expect, it } from "vitest";

import { formatSource } from "./formatSource";

describe("formatSource", () => {
  it("formats TypeScript sources with api-gen defaults", async () => {
    await expect(
      formatSource(
        "storeApiTypes.d.ts",
        'export type operations={"read product":{response:{id:string}}}',
      ),
    ).resolves.toMatchInlineSnapshot(`
      "export type operations = { "read product": { response: { id: string } } };
      "
    `);
  });

  it("formats JSON sources based on the file name", async () => {
    await expect(
      formatSource(
        "storeApiSchema.json",
        `{
          "openapi": "3.1.0",
          "paths": {
            "/checkout/cart": {
              "get": {}
            }
          }
        }`,
      ),
    ).resolves.toMatchInlineSnapshot(`
      "{
        "openapi": "3.1.0",
        "paths": {
          "/checkout/cart": {
            "get": {}
          }
        }
      }
      "
    `);
  });

  it("allows call sites to override formatting options", async () => {
    await expect(
      formatSource("schema.ts", 'const value={label:"Shopware"}', {
        semi: false,
      }),
    ).resolves.toMatchInlineSnapshot(`
      "const value = { label: "Shopware" }
      "
    `);
  });

  it("throws a useful error when oxfmt cannot parse the source", async () => {
    await expect(formatSource("broken.ts", "export type =")).rejects.toThrow(
      "Could not format broken.ts:\nUnexpected token",
    );
  });
});
