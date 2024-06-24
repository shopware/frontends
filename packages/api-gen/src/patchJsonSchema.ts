import { OpenAPI3, PathItemObject } from "openapi-typescript";
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
    obj[key] = [...new Set([...obj[key], ...value])];
    return true;
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
  let alreadyApliedPatches: number = 0;
  const outdatedPatches: string[][] = [];
  let appliedPatches: number = 0;
  const todosToFix: string[][] = [];

  Object.entries(openApiSchema.components?.schemas || {}).forEach((schema) => {
    if (jsonOverrides?.components?.[schema[0]]) {
      const overridePatches = jsonOverrides?.components[schema[0]];
      const patches = Array.isArray(overridePatches)
        ? overridePatches
        : [overridePatches];
      patches.forEach((patch: JSON) => {
        const mergedPatch = extendedDefu(patch, schema[1]);

        patchedSchema.components.schemas[schema[0]] = extendedDefu(
          patch,
          patchedSchema.components.schemas[schema[0]],
        );
        appliedPatches++;
        const matchResult = equals(mergedPatch, schema[1]);

        if (matchResult) {
          outdatedPatches.push([
            `${c.gray(
              `\n${c.bold("Info")}: Patch for ${c.bold(schema[0])} is already applied in schema. You can remove it from overrides.`,
            )}`,
            c.red(json5.stringify(patch)),
          ]);
          alreadyApliedPatches++;
        } else {
          todosToFix.push([
            `Patch for ${c.cyan(
              c.bold(schema[0]),
            )} is missing in schema. \nPatch:\n${c.cyan(
              json5.stringify(patch),
            )}`,
            diff(mergedPatch, schema[1], {
              aColor: c.green,
              bColor: c.red,
            }) || "",
          ]);
        }
      });
    }
  });
  Object.entries(openApiSchema?.paths || {}).forEach((pathObject) => {
    const pathName = pathObject[0];
    Object.entries(pathObject[1]).forEach((singlePath) => {
      const httpMethod = singlePath[0];

      if (jsonOverrides?.paths?.[pathName]?.[httpMethod]) {
        const overridePatches = jsonOverrides?.paths[pathName][httpMethod];

        const patches = Array.isArray(overridePatches)
          ? overridePatches
          : [overridePatches];
        patches.forEach((patch: JSON) => {
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
        });
      }

      // require requestBody by default, optional only when explicitly set to false
      const requestBody = patchedSchema.paths[pathName][httpMethod].requestBody;
      if (requestBody) {
        requestBody.required = requestBody.required !== false;
      }
    });
  });
  return {
    patchedSchema,
    alreadyApliedPatches,
    todosToFix,
    appliedPatches,
    outdatedPatches,
  };
}
