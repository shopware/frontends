import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import openapiTS from "openapi-typescript";
import type { OpenAPI3 } from "openapi-typescript";
import * as dotenv from "dotenv";
import c from "picocolors";
import { format } from "prettier";
import { processAstSchemaAndOverrides } from "../processAstSchemaAndOverrides";
import { ofetch } from "ofetch";
import { TransformedElements } from "../generateFile";
import { transformSchemaTypes } from "../transformSchemaTypes";
import { transformOpenApiTypes } from "../transformOpenApiTypes";
import { extendedDefu, patchJsonSchema } from "../patchJsonSchema";
import json5 from "json5";
import {
  displayPatchingSummary,
  loadApiGenConfig,
  loadJsonOverrides,
} from "../jsonOverrideUtils";

// read .env file and load it into process.env
dotenv.config();

export async function generate(args: {
  cwd: string;
  filename?: string;
  apiType: "store" | "admin";
  debug: boolean;
}) {
  const inputFilename = args.filename
    ? args.filename
    : `${args.apiType}ApiSchema.json`;

  try {
    const start = performance.now();
    const outputFilename = inputFilename.replace(".json", ".d.ts");

    const fullInputFilePath = join(args.cwd, "api-types", inputFilename);
    const fullOutputFilePath = join(args.cwd, "api-types", outputFilename);

    //check if file exist
    const fileExist = existsSync(fullInputFilePath);

    if (!fileExist && !args.apiType) {
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
      const schemaForPatching = json5.parse(schemaFile) as OpenAPI3;
      const version = schemaForPatching?.info?.version;

      const configJSON = await loadApiGenConfig({
        silent: true, // we allow to not have the config file in this command
      });
      const jsonOverrides = await loadJsonOverrides({
        path: configJSON?.patches,
        apiType: args.apiType,
      });

      const {
        patchedSchema,
        todosToFix,
        outdatedPatches,
        alreadyApliedPatches,
      } = patchJsonSchema({
        openApiSchema: schemaForPatching,
        jsonOverrides,
      });

      const originalSchema = json5.parse(schemaFile);
      console.log("schema", originalSchema.info);

      displayPatchingSummary({
        todosToFix,
        outdatedPatches,
        alreadyApliedPatches,
      });

      schema = await openapiTS(patchedSchema, {
        version: +(process.env.OPENAPI_VERSION || 3),
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
              "apiAlias",
            ];
            const stringFields = Object.keys(schemaObject.properties).filter(
              (key) => {
                if (notAllowedKeys.includes(key)) return false;
                const property = schemaObject.properties?.[key];
                return (
                  !!property && "type" in property && property.type === "string"
                );
              },
            );

            const stringProperties = stringFields
              .filter((fieldKey) => !notAllowedKeys.includes(fieldKey))
              .reduce(
                (acc, key) => {
                  acc[key] = {
                    type: "string",
                  };
                  return acc;
                },
                {} as Record<string, { type: "string" }>,
              );
            if (Object.keys(stringProperties).length === 0) {
              delete schemaObject.properties.translated;
            } else {
              schemaObject.required?.push("translated");

              schemaObject.properties.translated = extendedDefu(
                {
                  additionalProperties: "_DELETE_",
                },
                schemaObject.properties.translated,
                {
                  type: "object",
                  properties: stringProperties,
                  required: stringFields,
                },
              );
            }
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
            !(schemaObject as { allOf?: [] }).allOf &&
            !(schemaObject as { additionalProperties?: object })
              .additionalProperties
          ) {
            return "GenericRecord";
          }
          // transform(schemaObject) {
          // if ("format" in schemaObject && schemaObject.format === "date-time") {
          //   return "Date";
          // }
        },
      });

      schema += `\n
    /**
     * @deprecated this field is not needed anymore
     */
    export type operationPaths = string;`;

      // clean up
      // remove `@description ` tags
      schema = schema.replace(/@description /g, "");

      // fix 'any' type problem
      schema = schema.replace(
        "type OneOf<T extends any[]",
        "type OneOf<T extends unknown[]",
      );

      if (args.debug) {
        writeFileSync(fullOutputFilePath, schema, {
          encoding: "utf-8",
        });

        schema = await format(schema, {
          // semi: false,
          parser: "typescript",
          // plugins: [tsParser],
        });
        schema = schema.trim();
      }

      processedSchemaAst = transformOpenApiTypes(schema);
    } else {
      console.log(
        c.yellow(
          `File ${c.bold(fullInputFilePath)} does not exist. Using default schema '${args.apiType}' as a base. to change that use param --apiType=admin or --apiType=store to pick the base schema.`,
        ),
      );

      // resolve default schema from node_modules api-client
      const link = resolve(
        `node_modules/@shopware/api-client/api-types/${args.apiType}ApiTypes.d.ts`,
      );
      if (existsSync(link)) {
        schema = readFileSync(link, {
          encoding: "utf-8",
        });
      } else {
        // falback from the github
        // TODO: change to main branch
        schema = await ofetch(
          `https://raw.githubusercontent.com/shopware/frontends/main/packages/api-client/api-types/${args.apiType}ApiTypes.d.ts`,
        );
      }

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
      const overridesFilepath = join(
        args.cwd,
        "api-types",
        `${args.apiType}ApiTypes.overrides.ts`,
      );
      const fileExists = existsSync(overridesFilepath);
      let overridesSchema = "";
      console.error(
        "Overrides exist:",
        fileExists,
        "in file",
        overridesFilepath,
      );

      if (fileExists) {
        overridesSchema = readFileSync(overridesFilepath, {
          encoding: "utf-8",
        });
      }

      await processAstSchemaAndOverrides(
        processedSchemaAst,
        overridesSchema,
        args.apiType,
      );
    } else {
      throw new Error("Schema is not a string");
    }

    const stop = performance.now();
    const time = Math.round(stop - start);
    console.log(
      c.green(
        `Types generated in ${c.bold(join("api-types", `${args.apiType}ApiTypes.d.ts`))} (took ${time}ms)`,
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
