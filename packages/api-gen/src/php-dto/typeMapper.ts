import type { SchemaObject } from "./openApiTypes";

export type { SchemaObject };

export interface PhpTypeResult {
  phpType: string;
  isArray: boolean;
  arrayItemType?: string;
  nullable: boolean;
}

export function hasTypeNull(schema: SchemaObject): boolean {
  return Array.isArray(schema.type) && schema.type.includes("null");
}

export function getSchemaType(schema: SchemaObject): string | undefined {
  if (typeof schema.type === "string") return schema.type;
  if (Array.isArray(schema.type)) {
    const nonNull = schema.type.filter((t) => t !== "null");
    return nonNull.length === 1 ? nonNull[0] : undefined;
  }
  return undefined;
}

const PRIMITIVE_TYPE_MAP: Record<string, string> = {
  string: "string",
  integer: "int",
  number: "float",
  boolean: "bool",
};

export function resolveRefName(ref: string): string {
  const parts = ref.split("/");
  return parts.at(-1) ?? ref;
}

export function toPascalCase(str: string): string {
  return str
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

const PHP_CLASS_NAME_REGEX = /^[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*$/;

export function isValidPhpClassName(name: string): boolean {
  return PHP_CLASS_NAME_REGEX.test(name);
}

export function toDtoClassName(schemaName: string): string {
  return `${schemaName}DTO`;
}

export function mapOpenApiTypeToPhp(schema: SchemaObject): PhpTypeResult {
  if (schema.$ref) {
    const refName = resolveRefName(schema.$ref);
    return {
      phpType: toDtoClassName(refName),
      isArray: false,
      nullable: false,
    };
  }

  if (schema.oneOf || schema.anyOf) {
    const variants = schema.oneOf ?? schema.anyOf ?? [];
    const nonNullVariants = variants.filter(
      (v) =>
        v.type !== "null" &&
        !(Array.isArray(v.type) && v.type.includes("null")),
    );
    const hasNull = variants.length > nonNullVariants.length;

    if (nonNullVariants.length === 1 && nonNullVariants[0]) {
      const result = mapOpenApiTypeToPhp(nonNullVariants[0]);
      return { ...result, nullable: hasNull || result.nullable };
    }

    return { phpType: "mixed", isArray: false, nullable: false };
  }

  if (schema.allOf) {
    const first = schema.allOf[0];
    if (schema.allOf.length === 1 && first) {
      return mapOpenApiTypeToPhp(first);
    }
    const refVariant = schema.allOf.find((s) => s.$ref);
    if (refVariant) {
      return mapOpenApiTypeToPhp(refVariant);
    }
    return { phpType: "mixed", isArray: false, nullable: false };
  }

  const nullable = hasTypeNull(schema);
  const typeValue = getSchemaType(schema);

  if (!typeValue) {
    if (
      Array.isArray(schema.type) &&
      schema.type.filter((t) => t !== "null").length > 1
    ) {
      return { phpType: "mixed", isArray: false, nullable };
    }
    return { phpType: "mixed", isArray: false, nullable: false };
  }

  if (typeValue === "array") {
    if (schema.items) {
      if (schema.items.$ref) {
        const refName = resolveRefName(schema.items.$ref);
        return {
          phpType: "array",
          isArray: true,
          arrayItemType: toDtoClassName(refName),
          nullable,
        };
      }
      const itemType = mapOpenApiTypeToPhp(schema.items);
      if (itemType.phpType !== "mixed" && itemType.phpType !== "array") {
        return {
          phpType: "array",
          isArray: true,
          arrayItemType: itemType.phpType,
          nullable,
        };
      }
    }
    return { phpType: "array", isArray: true, nullable };
  }

  if (typeValue === "object") {
    return { phpType: "array", isArray: false, nullable };
  }

  if (PRIMITIVE_TYPE_MAP[typeValue]) {
    return {
      phpType: PRIMITIVE_TYPE_MAP[typeValue],
      isArray: false,
      nullable,
    };
  }

  return { phpType: "mixed", isArray: false, nullable: false };
}
