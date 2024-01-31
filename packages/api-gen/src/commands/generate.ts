import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import openapiTS from "openapi-typescript";
import type { OpenAPI3 } from "openapi-typescript";
import * as dotenv from "dotenv";
import c from "picocolors";
import { format } from "prettier";
import { patches } from "../patches";
import semver from "semver";

const config = dotenv.config().parsed || {};

export async function generate(args: { cwd: string; filename: string }) {
  try {
    const outputFilename = args.filename.replace(".json", ".d.ts");

    const fullInputFilePath = join(args.cwd, args.filename);
    const fullOutputFilePath = join(args.cwd, outputFilename);

    //check if file exist
    const fileExist = existsSync(fullInputFilePath);

    if (!fileExist) {
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
    patchesToApply.forEach((patchName) => {
      schemaForPatching = patches[patchName].patch(schemaForPatching);
    });
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

    const readedContentFromFile = readFileSync(fullInputFilePath, {
      encoding: "utf-8",
    });

    const originalSchema = JSON.parse(readedContentFromFile);
    const { paths } = originalSchema;
    console.log("schema", originalSchema.info);

    const address = resolve(fullInputFilePath);
    let schema = await openapiTS(
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
                  !!property && "type" in property && property.type === "string"
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

    type MethodObject = {
      operationId: string;
      parameters: [
        {
          in: "query" | "header" | "path";
          name: string;
        },
      ];
    };

    type OperationsMap = Record<
      string,
      {
        path: string;
        method: string;
        queryParamNames: string[];
        finalPath: string;
      }
    >;

    // create map of paths
    const operationsMap: OperationsMap = Object.keys(paths).reduce(
      (acc, path) => {
        const pathObject = paths[path];
        const methods = Object.keys(pathObject);
        methods.forEach((method) => {
          const methodObject = pathObject[method] as MethodObject;
          const { operationId } = methodObject;
          const queryParamNames =
            methodObject.parameters
              ?.filter((param) => param.in === "query")
              .map((param) => param.name) || [];

          const headerParamNames =
            methodObject.parameters
              ?.filter((param) => param.in === "header")
              .map((param) => param.name) || [];

          let finalPath = `${operationId} ${method.toLocaleLowerCase()} ${path}`;
          if (queryParamNames.length) {
            finalPath += `?${queryParamNames.join(",")}`;
          }
          if (headerParamNames.length) {
            finalPath += ` ${headerParamNames.join(",")}`;
          }

          acc[operationId] = {
            path,
            method,
            queryParamNames,
            finalPath,
          };
        });
        return acc;
      },
      {} as OperationsMap,
    );

    const operationsSortedByPath = Object.values(operationsMap).sort((a, b) => {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });

    schema += `\n export type operationPaths = ${operationsSortedByPath
      .map((el) => `"${(el as { finalPath: string }).finalPath}"`)
      .join(" | ")};`;

    // clean up
    // remove `@description ` tags
    schema = schema.replace(/@description /g, "");

    // add generic components definition
    schema = schema.replace(
      /export type operations =/g,
      "export type operations<components = components> =",
    );

    schema = await format(schema, {
      // semi: false,
      parser: "typescript",
      // plugins: [tsParser],
    });
    schema = schema.trim();

    if (typeof schema === "string") {
      writeFileSync(fullOutputFilePath, schema, {
        encoding: "utf-8",
      });
    } else {
      throw new Error("Schema is not a string");
    }
    console.log(c.green(`Types generated in ${c.bold(fullOutputFilePath)}`));
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
