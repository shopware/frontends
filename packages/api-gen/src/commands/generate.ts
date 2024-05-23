import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import openapiTS from "openapi-typescript";
import type { OpenAPI3 } from "openapi-typescript";
import * as dotenv from "dotenv";
import c from "picocolors";
import { format } from "prettier";
import { patches } from "../patches";
import semver from "semver";
import { processAstSchemaAndOverrides } from "../processAstSchemaAndOverrides";
import { ofetch } from "ofetch";
import { TransformedElements } from "../generateFile";
import { transformSchemaTypes } from "../transformSchemaTypes";
import { transformOpenApiTypes } from "../transformOpenApiTypes";

const config = dotenv.config().parsed || {};

export async function generate(args: {
  cwd: string;
  filename: string;
  default: string;
  debug: boolean;
}) {
  try {
    const start = performance.now();
    const outputFilename = args.filename.replace(".json", ".d.ts");

    const fullInputFilePath = join(args.cwd, "api-types", args.filename);
    const fullOutputFilePath = join(args.cwd, "api-types", outputFilename);

    //check if file exist
    const fileExist = existsSync(fullInputFilePath);

    if (!fileExist && !args.default) {
      console.log(
        c.yellow(
          `Schema file ${c.bold(
            fullInputFilePath,
          )} does not exist. Check whether the file is created (use ${c.bold(
            "loadSchema",
          )} command first).`,
        ),
      );
      process.exit(1);
    }

    let schema: string = "";
    let processedSchemaAst: TransformedElements;

    if (fileExist) {
      // Apply patches
      const schemaFile = readFileSync(fullInputFilePath, {
        encoding: "utf-8",
      });
      let schemaForPatching = JSON.parse(schemaFile) as OpenAPI3;
      const version = schemaForPatching?.info?.version;

      const allPatches: Array<keyof typeof patches> = []; // Object.keys(patches) as Array<keyof typeof patches>;
      const semverVersion = version.slice(2);
      const patchesToApply = allPatches.filter((patch) => {
        return semver.satisfies(semverVersion, patch);
      });
      for (const patchName of patchesToApply) {
        schemaForPatching = patches[patchName].patch(schemaForPatching);
      }

      if (patchesToApply.length) {
        patchesToApply.length &&
          console.log("Applied", patchesToApply.length, "patches");

        const formatted = await format(JSON.stringify(schemaForPatching), {
          semi: false,
          parser: "json",
        });
        const content = formatted.trim();
        writeFileSync(fullInputFilePath, content, {
          encoding: "utf-8",
        });
      }

      const readedContentFromFile = !patchesToApply.length
        ? schemaFile
        : readFileSync(fullInputFilePath, {
            encoding: "utf-8",
          });

      const originalSchema = JSON.parse(readedContentFromFile);
      console.log("schema", originalSchema.info);

      const address = resolve(fullInputFilePath);
      schema = await openapiTS(
        // new URL(SCHEMA_FILENAME, import.meta.url),
        address,
        {
          version: +(config.OPENAPI_VERSION || 3),
          exportType: true,
          // pathParamsAsTypes: true,
          // rawSchema: false,
          additionalProperties: false,
          alphabetize: true,
          supportArrayLength: true,
          commentHeader: `/**
 * This file is auto-generated. Do not make direct changes to the file. 
 * Instead override it in your shopware.d.ts file.
 * 
 * Shopware API version: ${version}
 * 
 */
`,
          /**
           * GenericRecord is used for types like associations
           */
          inject: `
            type GenericRecord = never | null | string | string[] | number | { [key: string]: GenericRecord };
            `,

          transform(schemaObject) {
            /**
             * Add proper `translated` types for object fields without entity fields like id, createdAt, updatedAt etc.
             */
            if (
              "type" in schemaObject &&
              "properties" in schemaObject &&
              schemaObject.type === "object" &&
              !!schemaObject?.properties?.translated
            ) {
              const notAllowedKeys = [
                "id",
                "createdAt",
                "updatedAt",
                "translated",
              ];
              const stringFields = Object.keys(schemaObject.properties).filter(
                (key) => {
                  if (notAllowedKeys.includes(key)) return false;
                  const property = schemaObject.properties?.[key];
                  return (
                    !!property &&
                    "type" in property &&
                    property.type === "string"
                  );
                },
              );

              schemaObject.properties.translated = {
                type: "object",
                properties: stringFields.reduce(
                  (acc, key) => {
                    acc[key] = {
                      type: "string",
                    };
                    return acc;
                  },
                  {} as Record<string, { type: "string" }>,
                ),
              };
            }
            /**
             * Blob type is used for binary data
             */
            if (schemaObject.format === "binary") {
              return "Blob";
            }

            /**
             * We're changing "object" declarations into "GenericRecord" to allow recursive types like `associations`
             */
            if (
              // for object types
              (schemaObject as { type: string }).type === "object" &&
              // without properties, items, anyOf, allOf
              !(schemaObject as { properties?: object }).properties &&
              !(schemaObject as { items?: [] }).items &&
              !(schemaObject as { anyOf?: [] }).anyOf &&
              !(schemaObject as { allOf?: [] }).allOf
            ) {
              return "GenericRecord";
            }
            // transform(schemaObject, metadata) {
            // if ("format" in schemaObject && schemaObject.format === "date-time") {
            //   return "Date";
            // }
          },
        },
      );

      schema += `\n
    /**
     * @deprecated this field is not needed anymore
     */
    export type operationPaths = string;`;

      // clean up
      // remove `@description ` tags
      schema = schema.replace(/@description /g, "");
      writeFileSync(fullOutputFilePath, schema, {
        encoding: "utf-8",
      });

      schema = await format(schema, {
        // semi: false,
        parser: "typescript",
        // plugins: [tsParser],
      });
      schema = schema.trim();

      processedSchemaAst = transformOpenApiTypes(schema);
    } else {
      console.log(
        c.yellow(`Using default schema '${args.default}' as a base.`),
      );

      // TODO: change to main branch
      schema = await ofetch(
        "https://raw.githubusercontent.com/shopware/frontends/feat/api-client-new-structure/packages/api-client-next/api-types/newApiTypes.d.ts",
      );

      processedSchemaAst = transformSchemaTypes(schema);
    }

    if (typeof schema === "string") {
      if (args.debug) {
        mkdirSync(dirname(fullOutputFilePath), { recursive: true });
        writeFileSync(fullOutputFilePath, schema, {
          encoding: "utf-8",
        });
      }

      // TODO: change overrides file name to param
      // read file "storeApiTypes.overrides.ts" if exists
      const fileExists = existsSync(
        join(args.cwd, "api-types", "storeApiTypes.overrides.ts"),
      );
      let overridesSchema = "";
      console.error("Overrides exist", fileExists);

      if (fileExists) {
        overridesSchema = readFileSync(
          join(args.cwd, "api-types", "storeApiTypes.overrides.ts"),
          {
            encoding: "utf-8",
          },
        );
      }

      await processAstSchemaAndOverrides(processedSchemaAst, overridesSchema);
    } else {
      throw new Error("Schema is not a string");
    }

    const stop = performance.now();
    const time = Math.round(stop - start);
    console.log(
      c.green(
        `Types generated in ${c.bold(fullOutputFilePath)} (took ${time}ms)`,
      ),
    );
  } catch (error) {
    console.error(
      c.red(
        "Error while generating types. Checkout the OpenAPI Schema and try again.\n",
      ),
      error,
    );
    process.exit(1);
  }
}
