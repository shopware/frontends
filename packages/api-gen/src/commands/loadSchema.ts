import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// read .env file and load it into process.env
import "dotenv/config";
import json5 from "json5";
import c from "picocolors";
import { format } from "prettier";
import { getAdminApiClient, getStoreApiClient } from "../apiClient";

const SCHEMA_ENDPOINT = "_info/openapi3.json";
const STORE_API_ENDPOINT = `/store-api/${SCHEMA_ENDPOINT}`;
const ADMIN_API_ENDPOINT = `/api/${SCHEMA_ENDPOINT}`;

/**
 * Load JSON schema from your API instance. You need to have proper .env file with the following values:
 *
 * For `store` API:
 * - OPENAPI_JSON_URL
 * - OPENAPI_ACCESS_KEY
 *
 * For `admin` API:
 * - OPENAPI_JSON_URL
 * - SHOPWARE_ADMIN_USERNAME
 * - SHOPWARE_ADMIN_PASSWORD
 *
 */
export async function loadSchema(args: {
  /**
   * Current working directory
   */
  cwd: string;
  /**
   * Filename to save the downloaded schema, default is `storeApiSchema.json` or `adminApiSchema.json` depending on the `apiType` parameter
   */
  filename?: string;
  /**
   * Type of the API to generate types for
   */
  apiType: "store" | "admin";
}) {
  if (!["store", "admin"].includes(args.apiType)) {
    console.error(
      c.red(`Invalid "apiType" argument. It should be "store" or "admin"`),
    );
    process.exit(1);
  }
  const isAdminApi = args.apiType === "admin";

  const outputFilename = args.filename
    ? args.filename
    : `${args.apiType}ApiSchema.json`;

  const OPENAPI_JSON_URL = process.env.OPENAPI_JSON_URL;
  const requiredEnvVars = [];
  if (isAdminApi) {
    requiredEnvVars.push("SHOPWARE_ADMIN_USERNAME");
    requiredEnvVars.push("SHOPWARE_ADMIN_PASSWORD");
  } else {
    requiredEnvVars.push("OPENAPI_ACCESS_KEY");
  }

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );
  try {
    if (missingEnvVars.length || !OPENAPI_JSON_URL) {
      console.error(
        c.red(
          `Missing ${c.bold(
            missingEnvVars.join(","),
          )} env variables.\n\nCheck whether the .env file is created.\n`,
        ),
      );
      process.exit(1);
    }

    const configUrl = OPENAPI_JSON_URL.replace(
      "/api/_info/openapi3.json",
      "",
    ).replace("/store-api/_info/openapi3.json", "");

    const downloadUrl =
      configUrl + (isAdminApi ? ADMIN_API_ENDPOINT : STORE_API_ENDPOINT);

    let apiJSON: Record<string, unknown>;

    if (isAdminApi) {
      const adminClient = getAdminApiClient();
      const result = await adminClient.invoke(
        "api-info get /_info/openapi3.json",
        {
          // TODO: change to json once default content-type is changed NEXT-30635
          query: { type: "jsonapi" },
        },
      );
      apiJSON = result.data;
    } else {
      const apiClient = getStoreApiClient();
      const result = await apiClient.invoke(
        "api-info get /_info/openapi3.json",
        {
          query: { type: "json" },
        },
      );
      apiJSON = result.data;
    }

    const formatted = await format(json5.stringify(apiJSON), {
      semi: false,
      parser: "json",
    });
    const content = formatted.trim();

    // const version = apiJSON?.info?.version;

    const dir = args.cwd;

    const apiTypesDir = join(dir, "api-types");
    if (!existsSync(apiTypesDir)) {
      mkdirSync(apiTypesDir);
    }

    const filePath = join("api-types", outputFilename);

    writeFileSync(join(dir, filePath), content, {
      encoding: "utf-8",
    });

    console.log(
      c.green(
        `Schema file loaded from ${c.bold(downloadUrl)} and saved to ${c.bold(
          filePath,
        )}`,
      ),
    );
  } catch (error) {
    console.error(
      c.red(
        `Error while loading OpenAPI schema JSON file. Checkout your ${c.bold(
          ".env",
        )} file and try again.\n`,
      ),
      error,
    );
    process.exit(1);
  }
}
