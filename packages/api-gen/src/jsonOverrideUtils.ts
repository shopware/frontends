import { existsSync, readFileSync } from "node:fs";
import json5 from "json5";
import { ofetch } from "ofetch";
import c from "picocolors";
import type { OverridesSchema } from "./patchJsonSchema";
import type { validationRules } from "./validation-rules";

export type ApiGenConfig = {
  rules: Array<keyof typeof validationRules>;
  /**
   * URL or path to the JSON file with overrides
   */
  patches: string;
};

export const API_GEN_CONFIG_FILENAME = "api-gen.config.json";

export async function loadApiGenConfig(
  params: {
    silent?: boolean;
  } = {},
): Promise<ApiGenConfig | null> {
  try {
    const config = await readFileSync(API_GEN_CONFIG_FILENAME, {
      // TODO: use c12 library for that
      // name: "api-gen", // file should be "api-gen.config.json"
      encoding: "utf-8",
    });
    return json5.parse<ApiGenConfig>(config);
  } catch (error) {
    if (!params.silent) {
      console.error(
        c.red(
          `Error while parsing config file ${API_GEN_CONFIG_FILENAME}. Check whether the file is correct JSON file.\n`,
        ),
        error,
      );
    }
    return null;
  }
}

function isURL(str: string) {
  return str.startsWith("http");
}

export async function loadJsonOverrides({
  path,
  apiType,
}: {
  path?: string;
  apiType: string;
}): Promise<OverridesSchema | undefined> {
  const localPath = `./api-types/${apiType}ApiSchema.overrides.json`;

  const fallbackPath = existsSync(localPath)
    ? localPath
    : `https://raw.githubusercontent.com/shopware/frontends/main/packages/api-client/api-types/${apiType}ApiSchema.overrides.json`;

  const pathToResolve = path || fallbackPath;
  console.log("Loading overrides from:", pathToResolve);

  try {
    if (isURL(pathToResolve)) {
      const response = await ofetch(pathToResolve, {
        responseType: "json",
        parseResponse: json5.parse,
      });
      return response;
    }

    const jsonOverridesFile = await readFileSync(pathToResolve, {
      encoding: "utf-8",
    });
    const content = json5.parse(jsonOverridesFile);
    return content;
  } catch (error) {
    console.warn(
      c.yellow(
        `Problem with resolving overrides "patches" at address ${pathToResolve}. Check whether you configuret it properly in your ${API_GEN_CONFIG_FILENAME}\n`,
      ),
      error,
    );
  }
}

export function displayPatchingSummary({
  todosToFix,
  outdatedPatches,
  alreadyApliedPatches,
  errors,
}: {
  todosToFix: string[][];
  outdatedPatches: string[][];
  alreadyApliedPatches: number;
  errors?: string[];
}) {
  if (!errors?.length && todosToFix.length) {
    console.log(c.yellow("Warnings to fix in the schema:"));
    for (const todo of todosToFix) {
      console.log(`${c.yellow("WARNING")}: ${todo[0]}`);
      console.log("Diff:\n", todo[1], "\n\n");
    }
  }

  if (errors?.length) {
    console.log(c.red("Errors found:"));
    for (const error of errors) {
      console.log(`\n<==== ${c.red("ERROR")}:\n${error}\n====>\n\n`);
    }
  }

  if (outdatedPatches.length) {
    console.log(c.yellow("Info: Outdated patches:"));
    console.log(
      c.gray(
        "No action needed. Patches are already applied. You can remove them from the overrides file to clean it up.",
      ),
    );
    for (const todo of outdatedPatches) {
      console.log(`${todo[0]}`);
      console.log("Patch to remove:\n", todo[1], "\n\n");
    }
  }

  console.log("\n\n===== Summary =====");
  if (alreadyApliedPatches) {
    console.log(
      c.gray(
        ` ✔️ Already fixed patches: ${c.bold(alreadyApliedPatches)} They can be removed now from the overrides file.`,
      ),
    );
  }
  const formatColor = todosToFix.length ? c.yellow : c.green;
  console.log(
    formatColor(
      `We've found ${c.bold(todosToFix.length)} warning(s) in the schema.${todosToFix.length ? " Apply patches to fix them in the original schema." : ""}`,
    ),
  );
}
