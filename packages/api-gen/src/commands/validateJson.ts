import { join } from "node:path";
import c from "picocolors";
import { readFileSync } from "node:fs";
import type { ObjectSubtype, OpenAPI3 } from "openapi-typescript";
import { validationRules } from "../validation-rules";

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
    fileContentAsJson = JSON.parse(fileContent) as OpenAPI3;
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
  let configJSON: { rules: string[] };
  try {
    const config = await readFileSync("api-gen.config.json", {
      // TODO: use c12 library for that
      // name: "api-gen", // file should be "api-gen.config.json"
      encoding: "utf-8",
    });
    configJSON = JSON.parse(config);
  } catch (error) {
    console.error(
      c.red(
        `Error while parsing config file api-gen.config.json. Check whether the file is correct JSON file.\n`,
      ),
      error,
    );
    process.exit(1);
  }

  const rulesToProcess = (configJSON?.rules || []) as Array<
    keyof typeof validationRules
  >;

  if (!rulesToProcess.length) {
    console.error(
      c.red(
        `No rules to process. Check your ${c.bold("api-gen.config.json")} file.`,
      ),
    );
    process.exit(1);
  }

  const errors: string[] = [];

  Object.entries(fileContentAsJson.components?.schemas || {}).forEach(
    (schema) => {
      rulesToProcess.forEach((ruleName) => {
        if (!validationRules[ruleName]) {
          console.error(
            c.red(
              `Validation rule ${c.bold(
                ruleName,
              )} is not implemented. Check your ${c.bold("api-gen.config.json")} file.`,
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

  if (errors.length) {
    console.error(c.red("Errors found:"));
    errors.forEach((error) => {
      console.error(`\n<==== ${c.red("ERROR")}:\n${error}\n====>\n\n`);
    });
    console.error(
      c.red(`Validation failed with ${c.bold(errors.length)} errors.`),
    );
    process.exit(1);
  } else {
    console.log(c.green("Validation passed successfully."));
  }
}
