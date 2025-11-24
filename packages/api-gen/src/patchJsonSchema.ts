import { equals } from "@vitest/expect";
import { diff } from "@vitest/utils/diff";
import { createDefu } from "defu";
import json5 from "json5";
import type {
  OpenAPI3,
  PathItemObject,
  SchemaObject,
} from "openapi-typescript";
import c from "picocolors";

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

const COMPOSITION_KEYWORDS = ["oneOf", "anyOf", "allOf", "not"] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasCompositionKeyword(obj: Record<string, unknown>): boolean {
  return COMPOSITION_KEYWORDS.some((keyword) => keyword in obj);
}

function hasRef(obj: Record<string, unknown>): boolean {
  return "$ref" in obj;
}

export const extendedDefu = createDefu((obj, key, value) => {
  // Handle array merging: concat arrays but skip duplicates
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    // @ts-expect-error - we know that obj[key] is an array as we're inside this if statement
    obj[key] = [...new Set([...obj[key], ...value])].sort();
    return true;
  }

  // If there is no key in object, add it
  if (obj[key] === undefined) {
    obj[key] = extendedDefu(value, value);
  }

  // Feature to delete key from object
  if (value === "_DELETE_") {
    delete obj[key];
    return true;
  }

  // Handle conflicts between $ref and composition keywords
  if (!isPlainObject(obj)) {
    return false;
  }

  const objRecord = obj as Record<string, unknown>;

  // Handle composition keyword replacement: if original has a different composition keyword or $ref,
  // delete the old one(s) and the new composition keyword will be merged in
  //
  // Example 1 - Composition keyword replacing $ref:
  // Original: { "$ref": "#/components/schemas/Media" }
  // Override: { "oneOf": [{ "$ref": "#/components/schemas/Media" }, { "$ref": "#/components/schemas/ProductMedia" }] }
  // Result:   { "oneOf": [{ "$ref": "#/components/schemas/Media" }, { "$ref": "#/components/schemas/ProductMedia" }] }
  //
  // Example 2 - Different composition keyword:
  // Original: { "oneOf": [{ "$ref": "#/components/schemas/Media" }] }
  // Override: { "anyOf": [{ "$ref": "#/components/schemas/ProductMedia" }] }
  // Result:   { "anyOf": [{ "$ref": "#/components/schemas/ProductMedia" }] }
  //
  // Example 3 - Same composition keyword (replacement):
  // Original: { "oneOf": [{ "$ref": "#/components/schemas/Media" }, { "$ref": "#/components/schemas/ProductMedia" }] }
  // Override: { "oneOf": [{ "$ref": "#/components/schemas/Media" }] }
  // Result:   { "oneOf": [{ "$ref": "#/components/schemas/Media" }] }
  if (
    typeof key === "string" &&
    COMPOSITION_KEYWORDS.includes(key as (typeof COMPOSITION_KEYWORDS)[number])
  ) {
    // Remove all other composition keywords (different from the one being set)
    for (const keyword of COMPOSITION_KEYWORDS) {
      if (keyword !== key && keyword in objRecord) {
        delete objRecord[keyword];
      }
    }
    // Remove $ref if present (composition keywords take precedence)
    if (hasRef(objRecord)) {
      // biome-ignore lint/performance/noDelete: delete $ref
      delete objRecord.$ref;
    }
  }

  // Handle $ref replacing composition keywords: replace entire object with $ref
  //
  // Example:
  // Original: { "oneOf": [{ "$ref": "#/components/schemas/Media" }, { "$ref": "#/components/schemas/ProductMedia" }] }
  // Override: { "$ref": "#/components/schemas/Media" }
  // Result:   { "$ref": "#/components/schemas/Media" }
  if (
    isPlainObject(value) &&
    hasRef(value) &&
    typeof key === "string" &&
    key in objRecord
  ) {
    const originalValue = objRecord[key];
    if (isPlainObject(originalValue) && hasCompositionKeyword(originalValue)) {
      objRecord[key] = value;
      return true;
    }
  }

  return false;
});

export function patchJsonSchema({
  openApiSchema,
  jsonOverrides,
}: {
  openApiSchema: OpenAPI3;
  jsonOverrides?: OverridesSchema;
}) {
  const patchedSchema = json5.parse(json5.stringify(openApiSchema));
  patchedSchema.components ??= {};
  patchedSchema.components.schemas ??= {};
  patchedSchema.paths ??= {};

  let alreadyApliedPatches = 0;
  const outdatedPatches: string[][] = [];
  let appliedPatches = 0;
  const todosToFix: string[][] = [];
  const schemaPaths: Array<{
    path: string;
    method: string;
  }> = [];

  function _applyPatches(
    initialObject: JSON,
    schemaName: string,
    overridePatches: JSON[],
    originalSchema: JSON | SchemaObject,
  ) {
    let patchedObject = initialObject;
    const patches = Array.isArray(overridePatches)
      ? overridePatches
      : [overridePatches];
    for (const patch of patches) {
      patchedObject = extendedDefu(patch, patchedObject);
    }

    const matchResult = equals(patchedObject, originalSchema);

    if (matchResult) {
      outdatedPatches.push([
        `${c.gray(
          `\n${c.bold("Info")}: Patch for ${c.bold(schemaName)} is already applied in schema. You can remove it from overrides.`,
        )}`,
        c.red(json5.stringify(patches)),
      ]);
      alreadyApliedPatches++;
    } else {
      appliedPatches++;
      todosToFix.push([
        `Patch for "${c.cyan(schemaName)}" is missing in schema. \nPatched object:\n${c.cyan(
          json5.stringify(patchedObject),
        )}`,
        diff(patchedObject, originalSchema, {
          aColor: c.green,
          bColor: c.red,
        }) || "",
      ]);
    }

    return patchedObject;
  }

  function _applyPathPatches(
    pathName: string,
    httpMethod: keyof PathItemObject,
    overridePatches: JSON[],
  ) {
    patchedSchema.paths[pathName] ??= {};
    patchedSchema.paths[pathName][httpMethod] ??= {};

    patchedSchema.paths[pathName][httpMethod] = _applyPatches(
      patchedSchema.paths[pathName][httpMethod],
      `${pathName} ${httpMethod}`,
      overridePatches,
      (openApiSchema.paths?.[pathName] as PathItemObject)?.[httpMethod],
    );
  }

  function _applyComponentsPatches(
    pathName: string,
    // httpMethod: string,
    overridePatches: JSON[],
  ) {
    patchedSchema.components.schemas[pathName] ??= {} as SchemaObject;

    patchedSchema.components.schemas[pathName] = _applyPatches(
      patchedSchema.components.schemas[pathName],
      pathName,
      overridePatches,
      openApiSchema.components?.schemas?.[pathName] as SchemaObject,
    );
  }

  for (const schemaName of Object.keys(
    openApiSchema.components?.schemas || {},
  )) {
    if (jsonOverrides?.components?.[schemaName]) {
      const overridePatches = jsonOverrides?.components[schemaName];

      _applyComponentsPatches(schemaName, overridePatches);
    }
  }

  // finds not existing components and add them, mostly for backwards compatibility
  for (const [schemaName, patches] of Object.entries(
    jsonOverrides?.components || {},
  )) {
    if (!openApiSchema.components?.schemas?.[schemaName]) {
      _applyComponentsPatches(schemaName, patches);
    }
  }

  // find non existing paths and add them to schema
  for (const [pathName, methodObject] of Object.entries(
    jsonOverrides?.paths || {},
  )) {
    for (const [httpMethod, overridePatches] of Object.entries(
      methodObject || {},
    )) {
      if (
        !(openApiSchema.paths?.[pathName] as PathItemObject)?.[
          httpMethod as keyof PathItemObject
        ]
      ) {
        _applyPathPatches(
          pathName,
          httpMethod as keyof PathItemObject,
          overridePatches,
        );
      }
    }
  }

  for (const [pathName, pathObject] of Object.entries(
    openApiSchema?.paths || {},
  )) {
    for (const httpMethod of Object.keys(pathObject as PathItemObject)) {
      if (!(httpMethod in pathObject)) continue;

      schemaPaths.push({
        path: pathName,
        method: httpMethod.toUpperCase(),
      });

      if (jsonOverrides?.paths?.[pathName]?.[httpMethod]) {
        const overridePatches = jsonOverrides?.paths[pathName][httpMethod];
        _applyPathPatches(
          pathName,
          httpMethod as keyof PathItemObject,
          overridePatches,
        );
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
