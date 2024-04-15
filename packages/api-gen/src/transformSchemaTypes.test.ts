import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { transformSchemaTypes } from "./transformSchemaTypes";

describe("transformSchemaTypes", async () => {
  it(`transform should match snapshot for file`, async () => {
    const exampleFileContent = readFileSync(
      join(__dirname, `../tests/snapshots-override/simpleOverride.example.ts`),
      "utf-8",
    );

    const [operationsMap, componentsMap, existingTypes] =
      transformSchemaTypes(exampleFileContent);

    expect(operationsMap).toMatchInlineSnapshot(`
      {
        "myNewEndpointWithDifferentBodys post /aaaaa/bbbbb": "
          | {
              contentType?: "application/json";
              accept?: "application/json";
              body: components["schemas"]["CustomerAddress"];
              response: components["schemas"]["Country"];
              responseCode: 201;
            }
          | {
              contentType: "application/xml";
              accept?: "application/json";
              body: {
                someting: boolean;
              };
              response: {
                thisIs200Response: string;
              };
              responseCode: 200;
            };",
        "updateCustomerAddress patch /account/address/{addressId}": " {
          contentType?: "application/json";
          accept?: "application/json";
          /**
           * We're testing overrides, assuming update address can only update the city
           */
          body: {
            city: string;
          };
          response: components["schemas"]["CustomerAddress"];
          responseCode: 200;
        };",
      }
    `);

    expect(componentsMap).toMatchInlineSnapshot(`
      {
        "CustomerAddress": " {
          qwe: string;
        };",
      }
    `);

    expect(existingTypes).toMatchInlineSnapshot(`[]`);
  });
});
