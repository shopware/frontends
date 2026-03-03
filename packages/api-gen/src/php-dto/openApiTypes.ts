export interface SchemaObject {
  type?: string | string[];
  $ref?: string;
  items?: SchemaObject;
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  allOf?: SchemaObject[];
  properties?: Record<string, SchemaObject>;
  required?: string[];
  description?: string;
  pattern?: string;
  format?: string;
  enum?: unknown[];
  additionalProperties?: boolean | SchemaObject;
}

export interface ParameterObject {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  schema?: SchemaObject;
}

export interface OperationObject {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: ParameterObject[];
  requestBody?: {
    required?: boolean;
    content?: Record<
      string,
      {
        schema?: SchemaObject;
      }
    >;
  };
  responses?: Record<
    string,
    {
      description?: string;
      content?: Record<
        string,
        {
          schema?: SchemaObject;
        }
      >;
    }
  >;
}

export interface OpenApiSchema {
  components?: {
    schemas?: Record<string, SchemaObject>;
  };
  paths?: Record<string, Record<string, OperationObject>>;
}
