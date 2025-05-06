import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createDefu } from "defu";
import json5 from "json5";
import { ofetch } from "ofetch";
import c from "picocolors";
import { type OverridesSchema, extendedDefu } from "./patchJsonSchema";
import { loadLocalJSONFile } from "./utils";
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

/**
 * Resolve single path to JSON file.
 * Resolving order:
 * 1. Direct path - url or file path
 * 2. check in `api-types` folder for file name
 * 3. check in node_modules api-client package for file name
 * 4. check at github external resource for file name
 *
 * Displays warning if file is not found.
 */
export async function resolveSinglePath<T = JSON>(
  pathToResolve: string,
): Promise<T | undefined> {
  try {
    if (isURL(pathToResolve)) {
      const response = await ofetch(pathToResolve, {
        responseType: "json",
        parseResponse: json5.parse,
      });
      console.log("Resolved file from", pathToResolve);
      return response;
    }

    // 1. direct local path
    const localFile = await loadLocalJSONFile(pathToResolve);
    if (localFile) {
      console.log("Resolved file from", pathToResolve);
      return localFile as T;
    }

    // 2. check in `api-types` folder for file name
    const apiTypesFolder = join(process.cwd(), "api-types");
    const apiTypesFile = join(apiTypesFolder, pathToResolve);
    const localApiTypesFile = await loadLocalJSONFile(apiTypesFile);
    if (localApiTypesFile) {
      console.log("Resolved file from", apiTypesFile);
      return localApiTypesFile as T;
    }

    // 3. check in node_modules api-client package for file name
    const nodeModulesFolder = resolve(
      `node_modules/@shopware/api-client/api-types/${pathToResolve}`,
    );
    const localNodeModulesFile = await loadLocalJSONFile(nodeModulesFolder);
    if (localNodeModulesFile) {
      console.log("Resolved file from", nodeModulesFolder);
      return localNodeModulesFile as T;
    }

    // 4. check at github external resource for file name
    const githubFile = `https://raw.githubusercontent.com/shopware/frontends/main/packages/api-client/api-types/${pathToResolve}`;
    const localGithubFile = await loadLocalJSONFile(githubFile);
    if (localGithubFile) {
      console.log("Resolved file from", githubFile);
      return localGithubFile as T;
    }
  } catch (error) {
    console.warn(
      c.yellow(
        `Problem with resolving file at address ${pathToResolve}. Check whether you configured it properly in your ${API_GEN_CONFIG_FILENAME}\n`,
      ),
      error,
    );
  }
  return undefined;
}

export async function loadJsonOverrides({
  paths,
  apiType,
}: {
  paths?: string | string[];
  apiType: string;
}): Promise<OverridesSchema> {
  const localPath = `./api-types/${apiType}ApiSchema.overrides.json`;

  const localNodePath = resolve(
    `node_modules/@shopware/api-client/api-types/${apiType}ApiSchema.overrides.json`,
  );

  const fallbackPath = existsSync(localPath)
    ? localPath
    : existsSync(localNodePath)
      ? localNodePath
      : `https://raw.githubusercontent.com/shopware/frontends/main/packages/api-client/api-types/${apiType}ApiSchema.overrides.json`;

  const patchesToResolve: string[] = Array.isArray(paths)
    ? paths
    : paths
      ? [paths]
      : [];

  if (!patchesToResolve?.length) {
    patchesToResolve.push(fallbackPath);
  }

  console.log("Loading overrides from:", patchesToResolve);

  try {
    const results = await Promise.allSettled(
      patchesToResolve.map(resolveSinglePath),
    );
    // merge results from correctly settled promises
    return mergeJsonOverrides(
      {},
      ...results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value || {}),
    );
  } catch (error) {
    console.warn(
      c.yellow(
        `Problem with resolving overrides "patches". Check whether you configured it properly in your ${API_GEN_CONFIG_FILENAME}\n`,
      ),
      error,
    );
    return {};
  }
}

export const mergeJsonOverrides = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    // concat arrays but skip duplicates
    // @ts-expect-error - we know that obj[key] is an array as we're inside this if statement
    obj[key] = [...new Set([...obj[key], ...value])].sort();
    return true;
  }

  // if one is array and the second not combine them in array
  if (Array.isArray(obj[key]) && !Array.isArray(value) && value) {
    // @ts-expect-error - we know that obj[key] is an array as we're inside this if statement
    obj[key] = [...new Set([value, ...obj[key]])].sort();
    return true;
  }
  if (obj[key] && !Array.isArray(obj[key]) && Array.isArray(value)) {
    // @ts-expect-error - we know that obj[key] is an array as we're inside this if statement
    obj[key] = [...new Set([...value, obj[key]])].sort();
    return true;
  }

  // if there is no key in object, add it
  if (obj[key] === undefined) {
    obj[key] = extendedDefu(value, value);
  }
  return false;
});

export function displayPatchingSummary({
  todosToFix,
  outdatedPatches,
  alreadyApliedPatches,
  errors,
  displayPatchedLogs,
}: {
  todosToFix: string[][];
  outdatedPatches: string[][];
  alreadyApliedPatches: number;
  errors?: string[];
  displayPatchedLogs?: boolean;
}) {
  if (displayPatchedLogs && !errors?.length && todosToFix.length) {
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
