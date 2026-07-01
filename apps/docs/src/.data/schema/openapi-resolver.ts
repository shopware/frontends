import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type ApiType = "store" | "admin";

export type OpenApiSchema = {
  paths: Record<string, Partial<Record<HttpMethod, Operation>>>;
  components: {
    schemas: Record<string, SchemaNode>;
    responses?: Record<string, ResponseNode>;
  };
};

export type HttpMethod =
  | "delete"
  | "get"
  | "head"
  | "options"
  | "patch"
  | "post"
  | "put"
  | "trace";

export type Operation = {
  operationId?: string;
  requestBody?: RequestBodyNode | ReferenceNode;
  responses?: Record<string, ResponseNode | ReferenceNode>;
};

export type RequestBodyNode = {
  content?: Record<string, { schema?: SchemaNode }>;
};

export type ResponseNode = {
  description?: string;
  headers?: Record<string, { description?: string; schema?: SchemaNode }>;
  content?: Record<string, { schema?: SchemaNode }>;
};

export type ReferenceNode = {
  $ref: string;
};

export type SchemaNode = {
  $ref?: string;
  type?: string;
  format?: string;
  description?: string;
  enum?: string[];
  required?: string[];
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  oneOf?: SchemaNode[];
  allOf?: SchemaNode[];
  anyOf?: SchemaNode[];
};

export type OpenApiResolver = ReturnType<typeof createOpenApiResolver>;

type CreateOpenApiResolverOptions = {
  apiType?: ApiType;
  schemaPath?: string;
};

const httpMethods: HttpMethod[] = [
  "delete",
  "get",
  "head",
  "options",
  "patch",
  "post",
  "put",
  "trace",
];

export function createOpenApiResolver({
  apiType = "store",
  schemaPath,
}: CreateOpenApiResolverOptions = {}) {
  const schema = loadDocsOpenApiSchema({
    apiType,
    schemaPath,
  });
  const operations = indexOperations(schema);

  function getOperation(operationKey: string) {
    const operation = operations.get(operationKey);
    if (!operation) {
      throw new Error(`OpenAPI operation "${operationKey}" was not found.`);
    }

    return {
      body(contentType = "application/json") {
        return getJsonSchema(schema, operation.requestBody, contentType);
      },
      response(statusCode = 200) {
        const response = operation.responses?.[String(statusCode)];
        return resolveResponse(schema, response);
      },
      responseBody(statusCode = 200, contentType = "application/json") {
        return getJsonSchema(
          schema,
          operation.responses?.[String(statusCode)],
          contentType,
        );
      },
      raw() {
        return operation;
      },
    };
  }

  function getSchema(schemaName: string) {
    const node = schema.components.schemas[schemaName];
    if (!node) {
      throw new Error(`OpenAPI schema "${schemaName}" was not found.`);
    }

    return node;
  }

  return {
    schema,
    operation: getOperation,
    operationEntries: () => [...operations.entries()],
    operationKeys: () => [...operations.keys()],
    componentSchema: getSchema,
    formatType: (node?: SchemaNode) => formatType(schema, node),
    getJsonSchema: (
      node: ResponseNode | ReferenceNode | RequestBodyNode | undefined,
      contentType = "application/json",
    ) => getJsonSchema(schema, node, contentType),
    resolveResponse: (response?: ResponseNode | ReferenceNode) =>
      resolveResponse(schema, response),
    resolveSchema: (node?: SchemaNode) => resolveSchema(schema, node),
    resolveRef: (ref: string) => resolveRef(schema, ref),
  };
}

function loadDocsOpenApiSchema({
  apiType,
  schemaPath,
}: Required<Pick<CreateOpenApiResolverOptions, "apiType">> &
  Pick<CreateOpenApiResolverOptions, "schemaPath">): OpenApiSchema {
  const filename =
    apiType === "store" ? "storeApiSchema.json" : "adminApiSchema.json";
  const resolvedSchemaPath = schemaPath ?? join(getSchemaDir(), filename);

  return JSON.parse(readFileSync(resolvedSchemaPath, "utf8")) as OpenApiSchema;
}

function indexOperations(schema: OpenApiSchema) {
  const operations = new Map<string, Operation>();

  for (const [path, pathItem] of Object.entries(schema.paths)) {
    for (const method of httpMethods) {
      const operation = pathItem[method];
      if (!operation) {
        continue;
      }

      const operationKey = operation.operationId
        ? `${operation.operationId} ${method} ${path}`
        : `${method} ${path}`;

      operations.set(operationKey, operation);
    }
  }

  return operations;
}

function getSchemaDir() {
  return dirname(fileURLToPath(import.meta.url));
}

function getJsonSchema(
  schema: OpenApiSchema,
  node: ResponseNode | ReferenceNode | RequestBodyNode | undefined,
  contentType = "application/json",
) {
  if (!node) {
    return undefined;
  }

  if (isReference(node)) {
    return getJsonSchema(schema, resolveResponse(schema, node), contentType);
  }

  if ("content" in node) {
    return node.content?.[contentType]?.schema;
  }

  return undefined;
}

function resolveResponse(
  schema: OpenApiSchema,
  response: ResponseNode | ReferenceNode | undefined,
): ResponseNode | undefined {
  if (!response) {
    return undefined;
  }

  if (isReference(response)) {
    return resolveRef(schema, response.$ref) as ResponseNode | undefined;
  }

  return response;
}

function resolveSchema(schema: OpenApiSchema, node?: SchemaNode): SchemaNode {
  if (!node) {
    return {};
  }

  if (node.$ref) {
    return resolveSchema(schema, resolveRef(schema, node.$ref) as SchemaNode);
  }

  if (node.allOf?.length) {
    return mergeComposedSchemas(
      schema,
      node.allOf.map((schemaNode) => resolveSchema(schema, schemaNode)),
    );
  }

  return node;
}

function mergeComposedSchemas(
  schema: OpenApiSchema,
  nodes: SchemaNode[],
): SchemaNode {
  return nodes.reduce<SchemaNode>((mergedNode, node) => {
    const resolvedNode = resolveSchema(schema, node);

    return {
      ...mergedNode,
      ...resolvedNode,
      properties: {
        ...mergedNode.properties,
        ...resolvedNode.properties,
      },
      required: [
        ...new Set([
          ...(mergedNode.required ?? []),
          ...(resolvedNode.required ?? []),
        ]),
      ],
    };
  }, {});
}

function resolveRef(schema: OpenApiSchema, ref: string) {
  return ref
    .replace("#/", "")
    .split("/")
    .reduce<unknown>((current, segment) => {
      if (current && typeof current === "object" && segment in current) {
        return (current as Record<string, unknown>)[segment];
      }

      return undefined;
    }, schema);
}

function formatType(schema: OpenApiSchema, node?: SchemaNode): string {
  const resolvedNode = resolveSchema(schema, node);

  if (node?.$ref) {
    return node.$ref.split("/").at(-1) ?? "object";
  }

  if (resolvedNode.oneOf?.length) {
    return resolvedNode.oneOf
      .map((item) => formatType(schema, item))
      .join(" | ");
  }

  if (resolvedNode.anyOf?.length) {
    return resolvedNode.anyOf
      .map((item) => formatType(schema, item))
      .join(" | ");
  }

  if (resolvedNode.type === "array") {
    return `${formatType(schema, resolvedNode.items)}[]`;
  }

  if (resolvedNode.enum?.length) {
    return resolvedNode.enum.map((value) => `"${value}"`).join(" | ");
  }

  if (resolvedNode.format) {
    return `${resolvedNode.type ?? "unknown"}:${resolvedNode.format}`;
  }

  return resolvedNode.type ?? "object";
}

function isReference(node: unknown): node is ReferenceNode {
  return (
    Boolean(node) &&
    typeof node === "object" &&
    "$ref" in node &&
    typeof (node as ReferenceNode).$ref === "string"
  );
}
