import type {
  Oas3Components,
  Oas3Definition,
  Oas3PathItem,
} from "@redocly/openapi-core";

const ALLOWED_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
] as const;

export const getUniquePaths = (schema: Oas3Definition): string[] => {
  return Object.keys(schema.paths ?? {});
};

export const getTags = (schema: Oas3Definition): { name: string }[] => {
  return schema.tags ?? [];
};

export const filterPathsByTag = (schema: Oas3Definition, tag: string) => {
  const paths = schema.paths ?? {};
  const newPaths: typeof paths = {};

  for (const path in paths) {
    const pathItem = paths[path];
    if (!pathItem || "$ref" in pathItem) {
      continue;
    }
    for (const method of ALLOWED_METHODS) {
      const operation = pathItem[method as keyof Oas3PathItem];
      if (
        operation &&
        typeof operation === "object" &&
        "tags" in operation &&
        operation.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      ) {
        if (!newPaths[path]) {
          newPaths[path] = {};
        }
        (newPaths[path] as Oas3PathItem)[method] = operation;
      }
    }
  }

  return newPaths;
};

export const createNewSchema = (schema: Oas3Definition): Oas3Definition => {
  return {
    ...schema,
    paths: {},
    tags: [],
  };
};

export const getTagsFromPath = (schema: Oas3Definition, path: string) => {
  const pathItem = schema.paths?.[path];
  if (!pathItem || "$ref" in pathItem) {
    return [];
  }

  const tags = new Set<string>();
  for (const method of ALLOWED_METHODS) {
    const operation = pathItem[method as keyof Oas3PathItem];
    if (
      operation &&
      typeof operation === "object" &&
      "tags" in operation &&
      operation.tags
    ) {
      for (const tag of operation.tags) {
        tags.add(tag);
      }
    }
  }

  return Array.from(tags).map((name) => ({ name }));
};

const findRefs = <T>(obj: T, refs: string[] = []): string[] => {
  if (!obj || typeof obj !== "object") {
    return refs;
  }

  if ("$ref" in obj && typeof obj.$ref === "string") {
    refs.push(obj.$ref);
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      findRefs(obj[key], refs);
    }
  }

  return refs;
};

export const getUsedComponents = (schema: Oas3Definition): string[] => {
  const refs = findRefs(schema.paths);
  return refs.map((ref) => ref.replace("#/components/", ""));
};

export const removeUnusedComponents = (
  schema: Oas3Definition,
  usedComponents: string[],
): Oas3Definition => {
  const newSchema = { ...schema };
  if (newSchema.components) {
    for (const componentType in newSchema.components) {
      const componentTypeKey = componentType as keyof Oas3Components;
      const components = newSchema.components[componentTypeKey];
      if (components) {
        for (const componentName in components) {
          if (!usedComponents.includes(`${componentType}/${componentName}`)) {
            delete (components as Record<string, unknown>)[componentName];
          }
        }
      }
    }
  }
  return newSchema;
};
