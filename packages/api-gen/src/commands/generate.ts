import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import openapiTS, {
  astToString,
  transformSchemaObjectWithComposition,
} from "openapi-typescript";
import type { OpenAPI3, SchemaObject } from "openapi-typescript";
import ts from "typescript";
// read .env file and load it into process.env
import "dotenv/config";
import json5 from "json5";
import { ofetch } from "ofetch";
import c from "picocolors";
import { format } from "prettier";
import type { TransformedElements } from "../generateFile";
import {
  displayPatchingSummary,
  loadApiGenConfig,
  loadJsonOverrides,
} from "../jsonOverrideUtils";
import { extendedDefu, patchJsonSchema } from "../patchJsonSchema";
import { processAstSchemaAndOverrides } from "../processAstSchemaAndOverrides";
import { transformOpenApiTypes } from "../transformOpenApiTypes";
import { transformSchemaTypes } from "../transformSchemaTypes";

export async function generate(args: {
  cwd: string;
  filename?: string;
  apiType: "store" | "admin";
  debug: boolean;
  logPatches: boolean;
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

    let schema = "";
    let processedSchemaAst: TransformedElements;
    let apiVersion = "unknown";

    if (fileExist) {
      // Apply patches
      const schemaFile = readFileSync(fullInputFilePath, {
        encoding: "utf-8",
      });
      const schemaForPatching = json5.parse(schemaFile) as OpenAPI3;
      apiVersion = schemaForPatching?.info?.version;

      const configJSON = await loadApiGenConfig({
        silent: true, // we allow to not have the config file in this command
      });
      console.error("test1");
      const jsonOverrides = await loadJsonOverrides({
        paths: configJSON?.patches,
        apiType: args.apiType,
      });
      console.error("test2");

      if (args.debug) {
        // save overrides to file
        writeFileSync(
          join(
            args.cwd,
            "api-types",
            `${args.apiType}ApiTypes.overrides-result.json`,
          ),
          json5.stringify(jsonOverrides, null, 2),
        );
      }

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
        displayPatchedLogs: args.logPatches,
      });

      if (args.debug) {
        // save patched schema to json file with additoinal name "debug-patched"
        const patchedSchemaFilename = inputFilename.replace(
          ".json",
          ".debug-patched.json",
        );
        const patchedSchemaPath = join(
          args.cwd,
          "api-types",
          patchedSchemaFilename,
        );
        writeFileSync(patchedSchemaPath, json5.stringify(patchedSchema), {
          encoding: "utf-8",
        });
      }

      const astSchema = await openapiTS(patchedSchema, {
        version: +(process.env.OPENAPI_VERSION || 3),
        exportType: true,
        // pathParamsAsTypes: true,
        // rawSchema: false,
        additionalProperties: false,
        alphabetize: true,
        defaultNonNullable: false,
        arrayLength: true,
        /**
         * GenericRecord is used for types like associations
         */
        inject: `
            type GenericRecord = never | null | string | string[] | number | { [key: string]: GenericRecord };
            `,
        transform(schemaObject, metadata) {
          if (!schemaObject) {
            throw new Error(`Schema object is empty at ${metadata.path}`);
          }
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
              const { translated: _, ...propertiesWithoutTranslated } =
                schemaObject.properties;
              schemaObject.properties = propertiesWithoutTranslated;
            } else {
              schemaObject.required ??= [];
              schemaObject.required.push("translated");
              schemaObject.properties.translated = extendedDefu(
                {
                  additionalProperties: false,
                },
                schemaObject.properties.translated,
                {
                  type: "object",
                  properties: stringProperties,
                  required: stringFields,
                },
              ) as SchemaObject;
            }
            return transformSchemaObjectWithComposition(schemaObject, {
              ...metadata,
              ctx: {
                ...metadata.ctx,
                transform: runTransformations,
              },
            });
          }

          // run standard transform
          return runTransformations(schemaObject);
        },
      });

      schema = astToString(astSchema);

      // clean up
      // remove `@description ` tags
      schema = schema.replace(/@description /g, "");

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
        {
          version: apiVersion,
        },
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

function runTransformations(schemaObject: SchemaObject) {
  /**
   * Blob type is used for binary data
   */
  if (schemaObject.format === "binary") {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier("Blob"),
    );
  }

  /**
   * We're changing "object" declarations into "GenericRecord" to allow recursive types like `associations`
   */
  if (
    // for object types
    schemaObject.type === "object" &&
    // without properties, items, anyOf, allOf
    !(schemaObject as { properties?: object }).properties &&
    !(schemaObject as { items?: [] }).items &&
    !(schemaObject as { anyOf?: [] }).anyOf &&
    !(schemaObject as { allOf?: [] }).allOf &&
    !(schemaObject as { additionalProperties?: object }).additionalProperties &&
    !(schemaObject as { $ref?: [] }).$ref
  ) {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier("GenericRecord"),
    );
  }
}
