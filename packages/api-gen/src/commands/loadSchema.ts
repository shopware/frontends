import { writeFileSync } from "node:fs";
import { join } from "node:path";
import * as dotenv from "dotenv";
import c from "picocolors";
import { format } from "prettier";
import { createAdminAPIClient, createAPIClient } from "@shopware/api-client";
import type { operations as adminOperations } from "@shopware/api-client/admin-api-types";
import type { operations } from "@shopware/api-client/store-api-types";
import json5 from "json5";

// read .env file and load it into process.env
dotenv.config();

const SCHEMA_ENDPOINT = "_info/openapi3.json";
const STORE_API_ENDPOINT = `/store-api/${SCHEMA_ENDPOINT}`;
const ADMIN_API_ENDPOINT = `/api/${SCHEMA_ENDPOINT}`;

export async function loadSchema(args: {
  cwd: string;
  filename?: string;
  apiType: string;
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
    ).replace("/atore-api/_info/openapi3.json", "");

    const downloadUrl =
      configUrl + (isAdminApi ? ADMIN_API_ENDPOINT : STORE_API_ENDPOINT);

    let apiJSON;

    if (isAdminApi) {
      const adminClient = createAdminAPIClient<adminOperations>({
        baseURL: `${configUrl}/api`,
        credentials: {
          grant_type: "password",
          client_id: "administration",
          scopes: "write",
          username: process.env.SHOPWARE_ADMIN_USERNAME,
          password: process.env.SHOPWARE_ADMIN_PASSWORD,
        },
      });
      const result = await adminClient.invoke(
        "api-info get /_info/openapi3.json",
        {
          // TODO: change to json once default content-type is changed NEXT-30635
          query: { type: "jsonapi" },
        },
      );
      apiJSON = result.data;
    } else {
      const apiClient = createAPIClient<operations>({
        baseURL: `${configUrl}/store-api`,
        accessToken: process.env.OPENAPI_ACCESS_KEY,
      });
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
