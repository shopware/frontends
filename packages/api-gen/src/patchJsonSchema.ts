import type { OpenAPI3, PathItemObject } from "openapi-typescript";
import { createDefu } from "defu";
import c from "picocolors";
import { equals } from "@vitest/expect";
import { diff } from "@vitest/utils/diff";
import json5 from "json5";

export type OverridesSchema = {
  components?: {
    [key: string]: JSON[];
  };
  paths?: {
    [key: string]: {
      [key: string]: JSON[];
    };
  };
};

export const extendedDefu = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    // concat arrays but skip duplicates
    // @ts-expect-error - we know that obj[key] is an array as we're inside this if statement
    obj[key] = [...new Set([...obj[key], ...value])].sort();
    return true;
  }

  // if there is no key in object, add it
  if (obj[key] === undefined) {
    obj[key] = extendedDefu(value, value);
  }

  // Feature to delete key from object
  if (value === "_DELETE_") {
    delete obj[key];
    return true;
  }
});

export function patchJsonSchema({
  openApiSchema,
  jsonOverrides,
}: {
  openApiSchema: OpenAPI3;
  jsonOverrides?: OverridesSchema;
}) {
  const patchedSchema = json5.parse(json5.stringify(openApiSchema));
  let alreadyApliedPatches = 0;
  const outdatedPatches: string[][] = [];
  let appliedPatches = 0;
  const todosToFix: string[][] = [];
  const schemaPaths: Array<{
    path: string;
    method: string;
  }> = [];

  for (const [schemaName, schema] of Object.entries(
    openApiSchema.components?.schemas || {},
  )) {
    if (jsonOverrides?.components?.[schemaName]) {
      const overridePatches = jsonOverrides?.components[schemaName];
      const patches = Array.isArray(overridePatches)
        ? overridePatches
        : [overridePatches];
      for (const patch of patches) {
        const mergedPatch = extendedDefu(patch, schema);

        patchedSchema.components.schemas[schemaName] = extendedDefu(
          patch,
          patchedSchema.components.schemas[schemaName],
        );
        appliedPatches++;
        const matchResult = equals(mergedPatch, schema);

        if (matchResult) {
          outdatedPatches.push([
            `${c.gray(
              `\n${c.bold("Info")}: Patch for ${c.bold(schemaName)} is already applied in schema. You can remove it from overrides.`,
            )}`,
            c.red(json5.stringify(patch)),
          ]);
          alreadyApliedPatches++;
        } else {
          todosToFix.push([
            `Patch for ${c.cyan(
              c.bold(schemaName),
            )} is missing in schema. \nPatch:\n${c.cyan(
              json5.stringify(patch),
            )}`,
            diff(mergedPatch, schema, {
              aColor: c.green,
              bColor: c.red,
            }) || "",
          ]);
        }
      }
    }
  }

  // finds not existing components and add them, mostly for backwards compatibility
  for (const [schemaName, schema] of Object.entries(
    jsonOverrides?.components || {},
  )) {
    if (!openApiSchema.components?.schemas?.[schemaName]) {
      const patches = Array.isArray(schema) ? schema : [schema];
      for (const patch of patches) {
        patchedSchema.components.schemas[schemaName] = extendedDefu(
          patch,
          patchedSchema.components.schemas[schemaName],
        );
        appliedPatches++;
      }
    }
  }

  for (const [pathName, pathObject] of Object.entries(
    openApiSchema?.paths || {},
  )) {
    for (const [httpMethod, singlePath] of Object.entries(pathObject)) {
      schemaPaths.push({
        path: pathName,
        method: httpMethod.toUpperCase(),
      });

      if (jsonOverrides?.paths?.[pathName]?.[httpMethod]) {
        const overridePatches = jsonOverrides?.paths[pathName][httpMethod];

        const patches = Array.isArray(overridePatches)
          ? overridePatches
          : [overridePatches];
        for (const patch of patches) {
          const mergedPatch = extendedDefu(
            patch,
            singlePath[1] as PathItemObject,
          );

          patchedSchema.paths[pathName][httpMethod] = extendedDefu(
            patch,
            patchedSchema.paths[pathName][httpMethod],
          );
          appliedPatches++;

          const matchResult = equals(mergedPatch, singlePath[1]);

          if (matchResult) {
            outdatedPatches.push([
              `${c.gray(
                `\n${c.bold("Info")}: Patch for "${c.bold(pathName)} ${c.bold(httpMethod)}" is already applied in schema. You can remove it from overrides.`,
              )}`,
              c.red(json5.stringify(patch)),
            ]);
            alreadyApliedPatches++;
          } else {
            todosToFix.push([
              `Patch for ${c.cyan(
                c.bold(pathName),
              )} ${httpMethod} is missing in schema. \nPatch:\n${c.cyan(
                json5.stringify(patch),
              )}`,
              diff(mergedPatch, singlePath[1], {
                aColor: c.green,
                bColor: c.red,
              }) || "",
              "\n\n",
            ]);
          }
        }
      }

      // require requestBody by default, optional only when explicitly set to false
      const requestBody = patchedSchema.paths[pathName][httpMethod].requestBody;
      if (requestBody) {
        requestBody.required = requestBody.required !== false;
      }
    }
  }
  return {
    patchedSchema,
    alreadyApliedPatches,
    todosToFix,
    appliedPatches,
    outdatedPatches,
    schemaPaths,
  };
}
