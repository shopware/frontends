import { describe, expect, it } from "vitest";
import type { GenerationMap } from "./generateFile";
import { transformOpenApiTypes } from "./transformOpenApiTypes";

describe("transformOpenApiTypes", async () => {
  it("should transform open api type with optional body", async () => {
    const example = `
    export type paths = {
      "/salutation": {
        post: operations["readSalutation"];
      };
    }

    export type operations = {
      readSalutation: {
        parameters: {
          header?: {
            /** Instructs Shopware to return the response in the given language. */
            "sw-language-id"?: string;
          };
        };
        requestBody?: {
          content: {
            "application/json": {
              testAnswer: string;
            }
          };
        };
      }
    }
    `;

    const [operationsMap] = transformOpenApiTypes(example);
    expect(
      (operationsMap as GenerationMap)["readSalutation post /salutation"]
        ?.bodyOptional,
    ).toEqual(true);
  });
});
