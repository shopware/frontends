import { writeFileSync } from "node:fs";
import * as dotenv from "dotenv";
import c from "picocolors";
import { format } from "prettier";
import { createAdminAPIClient, createAPIClient } from "@shopware/api-client";
import type {
  operations as adminOperations,
  operationPaths as adminOperationPaths,
} from "@shopware/api-client/admin-api-types";
// TODO: change adminOperations to storeOperations after fixing NEXT-33506
// import type {
//   operations,
//   operationPaths,
// } from "@shopware/api-client/api-types";

const config = dotenv.config().parsed || {};

const SCHEMA_ENDPOINT = "_info/openapi3.json";
const STORE_API_ENDPOINT = `/store-api/${SCHEMA_ENDPOINT}`;
const ADMIN_API_ENDPOINT = `/api/${SCHEMA_ENDPOINT}`;

export async function loadSchema(args: {
  cwd: string;
  filename: string;
  apiType: string;
}) {
  if (!["store", "admin"].includes(args.apiType)) {
    console.error(
      c.red(`Invalid "apiType" argument. It should be "store" or "admin"`),
    );
    process.exit(1);
  }
  const apiType: "store" | "admin" = args.apiType;
  const isAdminApi = apiType === "admin";

  const requiredEnvVars = ["OPENAPI_JSON_URL"];
  if (isAdminApi) {
    requiredEnvVars.push("SHOPWARE_ADMIN_USERNAME");
    requiredEnvVars.push("SHOPWARE_ADMIN_PASSWORD");
  } else {
    requiredEnvVars.push("OPENAPI_ACCESS_KEY");
  }

  const missingEnvVars = requiredEnvVars.filter((envVar) => !config[envVar]);
  try {
    if (missingEnvVars.length) {
      console.error(
        c.red(
          `Missing ${c.bold(missingEnvVars.join(","))} env variables.\n\nCheck whether the .env file is created.\n`,
        ),
      );
      process.exit(1);
    }

    const configUrl = config.OPENAPI_JSON_URL.replace(
      "/api/_info/openapi3.json",
      "",
    ).replace("/atore-api/_info/openapi3.json", "");

    const downloadUrl =
      configUrl + (isAdminApi ? ADMIN_API_ENDPOINT : STORE_API_ENDPOINT);

    let apiJSON;

    if (isAdminApi) {
      const adminClient = createAdminAPIClient<
        adminOperations,
        adminOperationPaths
      >({
        baseURL: `${configUrl}/api`,
        credentials: {
          grant_type: "password",
          client_id: "administration",
          scopes: "write",
          username: config.SHOPWARE_ADMIN_USERNAME,
          password: config.SHOPWARE_ADMIN_PASSWORD,
        },
      });
      apiJSON = await adminClient.invoke(
        "api-info get /_info/openapi3.json?type",
        {
          type: "json",
        },
      );
    } else {
      // TODO: change adminOperations to storeOperations after fixing NEXT-33506
      const apiClient = createAPIClient<adminOperations, adminOperationPaths>({
        baseURL: `${configUrl}/store-api`,
        accessToken: config.OPENAPI_ACCESS_KEY,
      });
      apiJSON = await apiClient.invoke(
        "api-info get /_info/openapi3.json?type",
        {
          type: "json",
        },
      );
    }

    const formatted = await format(JSON.stringify(apiJSON), {
      semi: false,
      parser: "json",
    });
    const content = formatted.trim();

    // const version = apiJSON?.info?.version;

    writeFileSync(args.filename, content, {
      encoding: "utf-8",
    });

    console.log(
      c.green(
        `Schema file loaded from ${c.bold(
          downloadUrl,
        )} and saved to ${c.bold(args.filename)}`,
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
