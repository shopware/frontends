import { join } from "node:path";
import c from "picocolors";
import { readFileSync } from "node:fs";
import type { ObjectSubtype, OpenAPI3 } from "openapi-typescript";
import { validationRules } from "../validation-rules";
import { patchJsonSchema } from "../patchJsonSchema";
import {
  API_GEN_CONFIG_FILENAME,
  displayPatchingSummary,
  loadApiGenConfig,
  loadJsonOverrides,
} from "../jsonOverrideUtils";
import json5 from "json5";
import { getAdminApiClient, getStoreApiClient } from "../apiClient";

/**
 * Removes the api type from the endpoint string to compare it with the definition from the schema
 */
function cleanupEndpointString(endpoint: string) {
  const path1 = endpoint
    .replace(/\/(api|store-api)\//, "/")
    // also replace all names betwern {} with empty brackets> example /some-endpoint/{id} -> /some-endpoint/{}
    .replace(/\{.*?\}/g, "{}")
    .trim();

  const endpointPath =
    path1.endsWith("{}") && path1[path1.length - 3] !== "/"
      ? path1.slice(0, -2)
      : path1;

  return endpointPath;
}

async function getAllApiEndpoints({ isAdminApi }: { isAdminApi: boolean }) {
  if (isAdminApi) {
    const adminClient = getAdminApiClient();
    const result = await adminClient.invoke("getRoutes get /_info/routes");
    return result.data;
  }

  const apiClient = getStoreApiClient();
  const result = await apiClient.invoke("getRoutes get /_info/routes");
  return result.data;
}

export async function validateJson(args: {
  cwd: string;
  filename?: string;
  apiType: string;
}) {
  const schemaFilenameToValidate = args.filename
    ? args.filename
    : `${args.apiType}ApiSchema.json`;

  const filePath = join("api-types", schemaFilenameToValidate);
  const fileContent = await readFileSync(filePath, {
    encoding: "utf-8",
  });

  let fileContentAsJson: OpenAPI3;
  try {
    fileContentAsJson = json5.parse(fileContent) as OpenAPI3;
  } catch (error) {
    console.error(
      c.red(
        `Error while parsing JSON schema file ${filePath}. Check whether the file is correct JSON file.\n`,
      ),
      error,
    );
    process.exit(1);
  }

  // load config
  const configJSON = await loadApiGenConfig();
  if (!configJSON) {
    process.exit(1);
  }

  const rulesToProcess = configJSON.rules || [];

  if (!rulesToProcess.length) {
    console.error(
      c.red(
        `No rules to process. Check your ${c.bold(API_GEN_CONFIG_FILENAME)} file.`,
      ),
    );
    process.exit(1);
  }

  const errors: string[] = [];
  const jsonOverrides = await loadJsonOverrides({
    path: configJSON.patches,
    apiType: args.apiType,
  });

  for (const [schemaName, schema] of Object.entries(
    fileContentAsJson.components?.schemas || {},
  )) {
    for (const ruleName of rulesToProcess) {
      if (!validationRules[ruleName]) {
        console.error(
          c.red(
            `Validation rule ${c.bold(
              ruleName,
            )} is not implemented. Check your ${c.bold(API_GEN_CONFIG_FILENAME)} file.`,
          ),
        );
        process.exit(1);
      }
      const res = validationRules[ruleName]?.(
        schemaName,
        schema as ObjectSubtype,
      );
      if (res) {
        errors.push(res);
      }
    }
  }

  const { alreadyApliedPatches, todosToFix, outdatedPatches, schemaPaths } =
    patchJsonSchema({
      openApiSchema: fileContentAsJson,
      jsonOverrides,
    });

  let endpointsMissingInSchema = 0;
  const exposedApiEndpoints = await getAllApiEndpoints({
    isAdminApi: args.apiType === "admin",
  });

  // compare endpoints
  for (const endpoint of exposedApiEndpoints.endpoints) {
    const endpointPath = cleanupEndpointString(endpoint.path);

    for (const endpointMethod of endpoint.methods) {
      const foundPath = schemaPaths.find((path) => {
        const pathName = cleanupEndpointString(path.path);
        return (
          pathName === endpointPath &&
          path.method.toUpperCase() === endpointMethod.toUpperCase()
        );
      });
      if (!foundPath) {
        errors.push(
          `Endpoint ${c.bold(
            `${endpointMethod.toUpperCase()} ${endpoint.path}`,
          )} is not defined in the schema but is exposed by API. Add OpenAPI documentation for this endpoint.`,
        );
        endpointsMissingInSchema++;
      }
    }
  }

  let endpointsInSchemaButNotInApi = 0;
  for (const path of schemaPaths) {
    const searchedPath = cleanupEndpointString(path.path);

    const foundPath = exposedApiEndpoints.endpoints.find((endpoint) => {
      const currentPath = cleanupEndpointString(endpoint.path);
      return currentPath === searchedPath;
    });
    if (!foundPath) {
      errors.push(
        `Path ${c.bold(
          `${path.method.toUpperCase()} ${path.path}`,
        )} is defined in schema but API does not expose this method!`,
      );
      endpointsInSchemaButNotInApi++;
    } else {
      for (const currentMethod of foundPath.methods) {
        if (!foundPath.methods.includes(currentMethod)) {
          errors.push(
            `Path ${c.bold(
              `${path.method.toUpperCase()} ${path.path}`,
            )} is defined in schema but API does not expose this method!`,
          );
          endpointsInSchemaButNotInApi++;
        }
      }
    }
  }

  displayPatchingSummary({
    todosToFix,
    errors,
    outdatedPatches,
    alreadyApliedPatches,
  });

  console.log(
    endpointsMissingInSchema > 0 ? c.red("❌") : c.green("✔️"),
    `API Endpoints (total ${exposedApiEndpoints.endpoints.length})`,
    "missing in the schema: ",
    c.red(c.bold(endpointsMissingInSchema)),
  );
  console.log(
    endpointsInSchemaButNotInApi > 0 ? c.red("❌") : c.green("✔️"),
    "API Endpoints defined in schema but not in API",
    c.red(c.bold(endpointsInSchemaButNotInApi)),
  );

  if (errors.length) {
    console.error(
      c.red(`Validation failed with ${c.bold(errors.length)} errors.`),
    );
    // process.exit(1);
    console.warn(
      c.yellow(
        "Errors found! This command will start failing in the future. Fix the errors from summary. Bypassing process fail for now.",
      ),
    );
  } else {
    console.log(c.green("✔️ Validation passed successfully."));
  }
}
