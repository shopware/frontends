import type {
  OpenApiSchema,
  OperationObject,
  SchemaObject,
} from "./openApiTypes";
import {
  type PhpTypeResult,
  getSchemaType,
  hasTypeNull,
  mapOpenApiTypeToPhp,
  resolveRefName,
  toDtoClassName,
} from "./typeMapper";

export interface DtoProperty {
  name: string;
  phpType: string;
  nullable: boolean;
  required: boolean;
  description?: string;
  pattern?: string;
  enum?: string[];
  defaultValue?: string | number | boolean;
  isArray: boolean;
  arrayItemType?: string;
}

export interface DtoDefinition {
  name: string;
  description?: string;
  properties: DtoProperty[];
}

type SchemaRegistry = Record<string, SchemaObject>;

const HTTP_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
];

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function dereferenceSchema(
  schema: SchemaObject,
  registry: SchemaRegistry,
): SchemaObject {
  if (schema.$ref) {
    const refName = resolveRefName(schema.$ref);
    const resolved = registry[refName];
    if (resolved) return resolved;
  }
  return schema;
}

function resolveDefaultValue(
  schema: SchemaObject,
): string | number | boolean | undefined {
  const raw = schema.default;
  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  ) {
    return raw;
  }
  if (raw === undefined && schema.enum && schema.enum.length === 1) {
    const single = schema.enum[0];
    if (
      typeof single === "string" ||
      typeof single === "number" ||
      typeof single === "boolean"
    ) {
      return single;
    }
  }
  return undefined;
}

function isInlineObject(schema: SchemaObject): boolean {
  return (
    getSchemaType(schema) === "object" &&
    schema.properties !== undefined &&
    Object.keys(schema.properties).length > 0 &&
    !schema.$ref
  );
}

function stripDtoSuffix(name: string): string {
  return name.endsWith("DTO") ? name.slice(0, -3) : name;
}

function buildNestedDtoName(parentDtoName: string, propName: string): string {
  return `${stripDtoSuffix(parentDtoName)}${capitalizeFirst(propName)}DTO`;
}

interface ExtractResult {
  properties: DtoProperty[];
  nestedDtos: DtoDefinition[];
}

function extractPropertiesFromSchema(
  schema: SchemaObject,
  requiredFields: string[],
  parentDtoName: string,
  registry: SchemaRegistry,
): ExtractResult {
  const properties: DtoProperty[] = [];
  const nestedDtos: DtoDefinition[] = [];

  if (!schema.properties) return { properties, nestedDtos };

  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    const isRequired = requiredFields.includes(propName);

    const enumValues = propSchema.enum?.every((v) => typeof v === "string")
      ? (propSchema.enum as string[])
      : undefined;

    if (isInlineObject(propSchema)) {
      const nestedName = buildNestedDtoName(parentDtoName, propName);
      const nestedResolved = resolveSchemaProperties(propSchema, registry);
      const nested = extractPropertiesFromSchema(
        { properties: nestedResolved.properties },
        nestedResolved.required,
        nestedName,
        registry,
      );

      nestedDtos.push({
        name: nestedName,
        description: propSchema.description,
        properties: nested.properties,
      });
      nestedDtos.push(...nested.nestedDtos);

      properties.push({
        name: propName,
        phpType: nestedName,
        nullable: hasTypeNull(propSchema),
        required: isRequired,
        description: propSchema.description,
        pattern: propSchema.pattern,
        enum: enumValues,
        defaultValue: resolveDefaultValue(propSchema),
        isArray: false,
        arrayItemType: undefined,
      });
      continue;
    }

    if (
      getSchemaType(propSchema) === "array" &&
      propSchema.items &&
      isInlineObject(propSchema.items)
    ) {
      const nestedName = buildNestedDtoName(parentDtoName, propName);
      const nestedResolved = resolveSchemaProperties(
        propSchema.items,
        registry,
      );
      const nested = extractPropertiesFromSchema(
        { properties: nestedResolved.properties },
        nestedResolved.required,
        nestedName,
        registry,
      );

      nestedDtos.push({
        name: nestedName,
        description: propSchema.items.description,
        properties: nested.properties,
      });
      nestedDtos.push(...nested.nestedDtos);

      properties.push({
        name: propName,
        phpType: "array",
        nullable: hasTypeNull(propSchema),
        required: isRequired,
        description: propSchema.description,
        pattern: propSchema.pattern,
        enum: enumValues,
        defaultValue: resolveDefaultValue(propSchema),
        isArray: true,
        arrayItemType: nestedName,
      });
      continue;
    }

    const typeResult: PhpTypeResult = mapOpenApiTypeToPhp(propSchema);

    properties.push({
      name: propName,
      phpType: typeResult.phpType,
      nullable: typeResult.nullable,
      required: isRequired,
      description: propSchema.description,
      pattern: propSchema.pattern,
      enum: enumValues,
      defaultValue: resolveDefaultValue(propSchema),
      isArray: typeResult.isArray,
      arrayItemType: typeResult.arrayItemType,
    });
  }

  return { properties, nestedDtos };
}

function resolveSchemaProperties(
  schema: SchemaObject,
  registry: SchemaRegistry,
): {
  properties: Record<string, SchemaObject>;
  required: string[];
} {
  const deref = dereferenceSchema(schema, registry);

  if (deref.allOf) {
    let mergedProperties: Record<string, SchemaObject> = {};
    let mergedRequired: string[] = [];
    for (const sub of deref.allOf) {
      const resolved = resolveSchemaProperties(sub, registry);
      mergedProperties = { ...mergedProperties, ...resolved.properties };
      mergedRequired = [...mergedRequired, ...resolved.required];
    }
    return { properties: mergedProperties, required: mergedRequired };
  }

  return {
    properties: deref.properties || {},
    required: deref.required || [],
  };
}

function extractDtoFromSchema(
  name: string,
  schema: SchemaObject,
  registry: SchemaRegistry,
  description?: string,
): DtoDefinition[] {
  const resolved = resolveSchemaProperties(schema, registry);

  if (Object.keys(resolved.properties).length === 0) {
    return [];
  }

  const { properties, nestedDtos } = extractPropertiesFromSchema(
    { properties: resolved.properties },
    resolved.required,
    name,
    registry,
  );

  return [
    {
      name,
      description: description || schema.description,
      properties,
    },
    ...nestedDtos,
  ];
}

export function parseComponentSchemas(schema: OpenApiSchema): DtoDefinition[] {
  const dtos: DtoDefinition[] = [];
  const components = schema.components?.schemas;
  const registry: SchemaRegistry = components || {};

  if (!components) return dtos;

  for (const [schemaName, schemaObj] of Object.entries(components)) {
    const extracted = extractDtoFromSchema(
      toDtoClassName(schemaName),
      schemaObj,
      registry,
    );
    dtos.push(...extracted);
  }

  return dtos;
}

export function parseRequestBodies(schema: OpenApiSchema): DtoDefinition[] {
  const dtos: DtoDefinition[] = [];
  const paths = schema.paths;
  const registry: SchemaRegistry = schema.components?.schemas || {};

  if (!paths) return dtos;

  for (const pathMethods of Object.values(paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathMethods[method] as OperationObject | undefined;
      if (!operation?.operationId) continue;

      const dtoName = `${capitalizeFirst(operation.operationId)}RequestDTO`;

      const rawRequestSchema =
        operation.requestBody?.content?.["application/json"]?.schema;
      const requestSchema = rawRequestSchema
        ? dereferenceSchema(rawRequestSchema, registry)
        : undefined;

      const paramProperties: DtoProperty[] = [];
      if (operation.parameters) {
        for (const param of operation.parameters) {
          if (param.in === "header") continue;

          if (param.schema) {
            const typeResult = mapOpenApiTypeToPhp(param.schema);
            paramProperties.push({
              name: param.name,
              phpType: typeResult.phpType,
              nullable: typeResult.nullable,
              required: param.required === true,
              description: param.description,
              pattern: param.schema.pattern,
              defaultValue: resolveDefaultValue(param.schema),
              isArray: typeResult.isArray,
              arrayItemType: typeResult.arrayItemType,
            });
          }
        }
      }

      if (!requestSchema && paramProperties.length === 0) continue;

      let bodyProperties: DtoProperty[] = [];
      let bodyNestedDtos: DtoDefinition[] = [];
      let bodyDescription: string | undefined;

      if (requestSchema) {
        const resolved = resolveSchemaProperties(requestSchema, registry);
        const extracted = extractPropertiesFromSchema(
          { properties: resolved.properties },
          resolved.required,
          dtoName,
          registry,
        );
        bodyProperties = extracted.properties;
        bodyNestedDtos = extracted.nestedDtos;
        bodyDescription = requestSchema.description;
      }

      const allProperties = [...bodyProperties, ...paramProperties];
      if (allProperties.length === 0) continue;

      dtos.push({
        name: dtoName,
        description: bodyDescription || operation.description,
        properties: allProperties,
      });
      dtos.push(...bodyNestedDtos);
    }
  }

  return dtos;
}

export function parseResponseBodies(schema: OpenApiSchema): DtoDefinition[] {
  const dtos: DtoDefinition[] = [];
  const paths = schema.paths;
  const registry: SchemaRegistry = schema.components?.schemas || {};

  if (!paths) return dtos;

  for (const pathMethods of Object.values(paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathMethods[method] as OperationObject | undefined;
      if (!operation?.operationId) continue;

      const responses = operation.responses;
      if (!responses) continue;

      const successResponse = responses["200"] || responses["201"];
      if (!successResponse?.content) continue;

      const responseSchema =
        successResponse.content["application/json"]?.schema;
      if (!responseSchema) continue;

      if (responseSchema.$ref) continue;

      const extracted = extractDtoFromSchema(
        `${capitalizeFirst(operation.operationId)}ResponseDTO`,
        responseSchema,
        registry,
        successResponse.description,
      );

      dtos.push(...extracted);
    }
  }

  return dtos;
}

export function parseAllDtos(schema: OpenApiSchema): DtoDefinition[] {
  const components = parseComponentSchemas(schema);
  const requestBodies = parseRequestBodies(schema);
  const responseBodies = parseResponseBodies(schema);

  return [...components, ...requestBodies, ...responseBodies];
}
