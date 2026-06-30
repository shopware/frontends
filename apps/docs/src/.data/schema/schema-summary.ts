import type {
  OpenApiResolver,
  Operation,
  ReferenceNode,
  ResponseNode,
  SchemaNode,
} from "./openapi-resolver";

export type SchemaFieldSummary = {
  name: string;
  type: string;
  required: boolean;
  description?: string;
};

export type SchemaSummary = {
  label: string;
  source: string;
  description?: string;
  fields: SchemaFieldSummary[];
  hiddenFields: number;
};

export function summarizeOpenApiSchema(api: OpenApiResolver) {
  const summaries: Record<string, SchemaSummary> = {};

  for (const [operationKey, operation] of api.operationEntries()) {
    Object.assign(summaries, summarizeOperation(api, operationKey, operation));
  }

  for (const schemaName of Object.keys(api.schema.components.schemas)) {
    summaries[getSchemaKey(schemaName)] = summarizeSchema({
      label: schemaName,
      source: getSchemaKey(schemaName),
      api,
      node: api.componentSchema(schemaName),
    });
    summaries[getComponentSchemaKey(schemaName)] = summarizeSchema({
      label: schemaName,
      source: getComponentSchemaKey(schemaName),
      api,
      node: api.componentSchema(schemaName),
    });
  }

  return summaries;
}

export function summarizeResponse({
  label,
  source,
  api,
  response,
}: {
  label: string;
  source: string;
  api: OpenApiResolver;
  response?: ResponseNode | ReferenceNode;
}): SchemaSummary {
  const resolvedResponse = api.resolveResponse(response);
  const bodySummary = summarizeSchema({
    label,
    source,
    api,
    node: api.getJsonSchema(resolvedResponse),
  });

  const headerFields = Object.entries(resolvedResponse?.headers ?? {}).map(
    ([name, header]) => ({
      name,
      type: api.formatType(header.schema),
      required: false,
      description: header.description,
    }),
  );

  return {
    ...bodySummary,
    description: resolvedResponse?.description || bodySummary.description,
    fields: [...headerFields, ...bodySummary.fields],
  };
}

function summarizeOperation(
  api: OpenApiResolver,
  operationKey: string,
  operation: Operation,
) {
  const summaries: Record<string, SchemaSummary> = {};

  if (operation.requestBody) {
    const source = getOperationBodyKey(operationKey);
    summaries[source] = summarizeSchema({
      label: `${operation.operationId ?? operationKey} body`,
      source,
      api,
      node: api.operation(operationKey).body(),
    });
  }

  const response = getSuccessResponse(operation);
  if (response) {
    const source = getOperationResponseKey(operationKey);
    summaries[source] = summarizeResponse({
      label: `${operation.operationId ?? operationKey} response`,
      source,
      api,
      response,
    });
  }

  return summaries;
}

function getSuccessResponse(operation: Operation) {
  const statusCode = Object.keys(operation.responses ?? {}).find((code) =>
    code.startsWith("2"),
  );

  if (!statusCode) {
    return undefined;
  }

  return operation.responses?.[statusCode];
}

function getOperationBodyKey(operationKey: string) {
  return `operations["${operationKey}"]["body"]`;
}

function getOperationResponseKey(operationKey: string) {
  return `operations["${operationKey}"]["response"]`;
}

function getSchemaKey(schemaName: string) {
  return `Schemas["${schemaName}"]`;
}

function getComponentSchemaKey(schemaName: string) {
  return `components["schemas"]["${schemaName}"]`;
}

export function summarizeSchema({
  label,
  source,
  api,
  node,
}: {
  label: string;
  source: string;
  api: OpenApiResolver;
  node?: SchemaNode;
}): SchemaSummary {
  const resolvedNode = api.resolveSchema(node);
  const properties = Object.entries(resolvedNode.properties ?? {});
  const maxFields = 8;
  const required = new Set(resolvedNode.required ?? []);

  return {
    label,
    source,
    description: resolvedNode.description,
    fields: properties.slice(0, maxFields).map(([name, property]) => ({
      name,
      type: api.formatType(property),
      required: required.has(name),
      description: property.description,
    })),
    hiddenFields: Math.max(properties.length - maxFields, 0),
  };
}
