import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineLoader } from "vitepress";

type OpenApiSchema = {
  paths: Record<string, Record<string, Operation>>;
  components: {
    schemas: Record<string, SchemaNode>;
    responses: Record<string, ResponseNode>;
  };
};

type Operation = {
  requestBody?: {
    content?: Record<string, { schema?: SchemaNode }>;
  };
  responses?: Record<string, ResponseNode | { $ref: string }>;
};

type ResponseNode = {
  description?: string;
  headers?: Record<string, { description?: string; schema?: SchemaNode }>;
  content?: Record<string, { schema?: SchemaNode }>;
};

type SchemaNode = {
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

export interface Data {
  summaries: Record<string, SchemaSummary>;
}

declare const data: Data;
export { data };

export default defineLoader({
  load(): Data {
    const projectRootDir = getProjectRootDir();
    const schemaPath = join(
      projectRootDir,
      "packages/api-client/api-types/storeApiSchema.json",
    );
    const schema = JSON.parse(
      readFileSync(schemaPath, "utf8"),
    ) as OpenApiSchema;

    const loginOperation = schema.paths["/account/login"].post;
    const contextOperation = schema.paths["/context"].get;
    const logoutOperation = schema.paths["/account/logout"].post;

    return {
      summaries: {
        LoginBody: summarizeSchema({
          label: "LoginBody",
          source: 'operations["loginCustomer post /account/login"]["body"]',
          schema,
          node: getJsonSchema(schema, loginOperation.requestBody),
        }),
        ContextTokenResponse: summarizeResponse({
          label: "ContextTokenResponse",
          source: 'operations["loginCustomer post /account/login"]["response"]',
          schema,
          response: loginOperation.responses?.["200"],
        }),
        LogoutResponse: summarizeResponse({
          label: "LogoutResponse",
          source:
            'operations["logoutCustomer post /account/logout"]["response"]',
          schema,
          response: logoutOperation.responses?.["200"],
        }),
        SalesChannelContext: summarizeSchema({
          label: "SalesChannelContext",
          source: 'operations["readContext get /context"]["response"]',
          schema,
          node: getJsonSchema(schema, contextOperation.responses?.["200"]),
        }),
        Customer: summarizeSchema({
          label: "Customer",
          source: 'Schemas["Customer"]',
          schema,
          node: schema.components.schemas.Customer,
        }),
        Cart: summarizeSchema({
          label: "Cart",
          source: 'Schemas["Cart"]',
          schema,
          node: schema.components.schemas.Cart,
        }),
        ApiError: summarizeSchema({
          label: "ApiError",
          source: 'components["schemas"]["failure"]',
          schema,
          node: schema.components.schemas.failure,
        }),
      },
    };
  },
});

function getProjectRootDir() {
  const cwd = process.cwd();
  if (cwd.endsWith("/apps/docs")) {
    return join(cwd, "../..");
  }

  return join(cwd, "src/frontends/_source");
}

function summarizeResponse({
  label,
  source,
  schema,
  response,
}: {
  label: string;
  source: string;
  schema: OpenApiSchema;
  response?: ResponseNode | { $ref: string };
}): SchemaSummary {
  const resolvedResponse = resolveResponse(schema, response);
  const bodySummary = summarizeSchema({
    label,
    source,
    schema,
    node: getJsonSchema(schema, resolvedResponse),
  });

  const headerFields = Object.entries(resolvedResponse?.headers ?? {}).map(
    ([name, header]) => ({
      name,
      type: formatType(schema, header.schema),
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

function summarizeSchema({
  label,
  source,
  schema,
  node,
}: {
  label: string;
  source: string;
  schema: OpenApiSchema;
  node?: SchemaNode;
}): SchemaSummary {
  const resolvedNode = resolveSchema(schema, node);
  const properties = Object.entries(resolvedNode?.properties ?? {});
  const maxFields = 8;
  const required = new Set(resolvedNode?.required ?? []);

  return {
    label,
    source,
    description: resolvedNode?.description,
    fields: properties.slice(0, maxFields).map(([name, property]) => ({
      name,
      type: formatType(schema, property),
      required: required.has(name),
      description: property.description,
    })),
    hiddenFields: Math.max(properties.length - maxFields, 0),
  };
}

function getJsonSchema(
  schema: OpenApiSchema,
  node: ResponseNode | { $ref: string } | Operation["requestBody"] | undefined,
) {
  if (!node) {
    return undefined;
  }

  if ("$ref" in node) {
    return getJsonSchema(schema, resolveResponse(schema, node));
  }

  if ("content" in node) {
    return node.content?.["application/json"]?.schema;
  }

  return undefined;
}

function resolveResponse(
  schema: OpenApiSchema,
  response: ResponseNode | { $ref: string } | undefined,
): ResponseNode | undefined {
  if (!response) {
    return undefined;
  }

  if ("$ref" in response) {
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
    return resolveSchema(schema, node.allOf[0]);
  }

  return node;
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
