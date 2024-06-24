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
  const jsonOverrides = await loadJsonOverrides(configJSON.patches);

  Object.entries(fileContentAsJson.components?.schemas || {}).forEach(
    (schema) => {
      rulesToProcess.forEach((ruleName) => {
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
          schema[0],
          schema[1] as ObjectSubtype,
        );
        if (res) {
          errors.push(res);
        }
      });
    },
  );

  const { alreadyApliedPatches, todosToFix, outdatedPatches } = patchJsonSchema(
    {
      openApiSchema: fileContentAsJson,
      jsonOverrides,
    },
  );

  displayPatchingSummary({
    todosToFix,
    errors,
    outdatedPatches,
    alreadyApliedPatches,
  });

  if (errors.length) {
    console.error(
      c.red(`Validation failed with ${c.bold(errors.length)} errors.`),
    );
    process.exit(1);
  } else {
    console.log(c.green("Validation passed successfully."));
  }
}
