import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, isAbsolute, posix, relative, resolve, sep } from "node:path";
import openapiTS from "openapi-typescript";
import * as dotenv from "dotenv";
import c from "picocolors";
import prettier from "prettier";

const config = dotenv.config().parsed || {};

if (!config.OPENAPI_JSON_URL || !config.OPENAPI_ACCESS_KEY) {
  console.error(
    c.red(
      `Missing ${c.bold("OPENAPI_JSON_URL")} or ${c.bold(
        "OPENAPI_ACCESS_KEY"
      )} env variables.\n\nCheck whether the .env file is created.\n`
    )
  );
  process.exit(1);
}

// const SCHEMA_FILENAME = "schema-admin.json";
// const TYPES_FILENAME = "admin-types.d.ts";
const loadFromAPI = false; // TODO; cli flag
const SCHEMA_FILENAME = "apiSchema.json";
const TYPES_FILENAME = (version) => `apiTypes-${version}.d.ts`;

export async function generate() {
  try {
    //check if file exist
    const fileExist = existsSync(SCHEMA_FILENAME);

    if (fileExist && !loadFromAPI) {
      console.log(
        c.yellow(
          `Schema file ${c.bold(
            SCHEMA_FILENAME
          )} already exist. Remove it or use --overwrite flag to overwrite it.`
        )
      );
    } else {
      // load json and save to local file
      const apiJSON = await fetch(config.OPENAPI_JSON_URL, {
        headers: {
          "sw-access-key": config.OPENAPI_ACCESS_KEY,
          Authorization: config.OPENAPI_ACCESS_KEY,
        },
      }).then((res) => res.json());

      const content = prettier
        .format(JSON.stringify(apiJSON), {
          semi: false,
          parser: "json",
        })
        .trim();

      writeFileSync(SCHEMA_FILENAME, content, {
        encoding: "utf-8",
      });
    }

    // const readedContentFromFile = readFileSync("./openapi/schema.json", {
    const readedContentFromFile = readFileSync(SCHEMA_FILENAME, {
      encoding: "utf-8",
    });

    const originalSchema = JSON.parse(readedContentFromFile);
    const { paths } = originalSchema;
    console.log("schema", originalSchema.info);

    const address = resolve(process.cwd(), SCHEMA_FILENAME);
    let schema = await openapiTS(
      // new URL(SCHEMA_FILENAME, import.meta.url),
      address,
      {
        version: +(config.OPENAPI_VERSION || 3),
        exportType: true,
        pathParamsAsTypes: true,
        // rawSchema: false,
        additionalProperties: false,
        alphabetize: true,
        // transform(schemaObject, metadata): string {
        // transform(schemaObject, metadata) {
        // if ("format" in schemaObject && schemaObject.format === "date-time") {
        //   return "Date";
        // }
        // console.log("transform", schemaObject);
        // return "null";
        // },
      }
    );

    // create map of paths
    const operationsMap = Object.keys(paths).reduce((acc, path) => {
      const pathObject = paths[path];
      const methods = Object.keys(pathObject);
      methods.forEach((method) => {
        const methodObject = pathObject[method];
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
    }, {});

    schema += `\n export type operationPaths = ${Object.values(operationsMap)
      .map((el) => `"${(el as { finalPath: string }).finalPath}"`)
      .join(" | ")};`;

    // clean up
    // remove `@description ` tags
    schema = schema.replace(/@description /g, "");

    if (typeof schema === "string") {
      writeFileSync(TYPES_FILENAME(originalSchema.info.version), schema, {
        encoding: "utf-8",
      });
    }
    console.log(
      c.green(
        `Types generated in ${TYPES_FILENAME(originalSchema.info.version)}`
      )
    );
  } catch (error) {
    console.error(
      c.red(
        "Error while generating types. Checkout the OpenAPI Schema and try again.\n"
      ),
      error
    );
    process.exit(1);
  }
}
