/**
 * To add new patch define version (using semver) and patch function which modifies JSON schema and saves it back to file.
 */
export const patches = {
  ">=5.0": {
    /**
     * Fixes the problem  with schema >=5.0 where ContextTokenResponse is not defined
     */
    name: "ContextTokenResponse",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patch: (schema: any) => {
      schema.components ??= {};
      schema.components.schemas ??= {};
      schema.paths ??= {};

      schema.components.schemas["ContextTokenResponse"] ??= {
        type: "object",
        properties: {
          contextToken: {
            description: "Context token identifying the current user session.",
            type: "string",
          },
        },
      };

      schema.paths["/context"].patch.responses["200"] = {
        description:
          "Returns the context token. Use that as your `sw-context-token` header for subsequent requests. Redirect if getRedirectUrl is set.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ContextTokenResponse",
            },
          },
        },
      };

      schema.paths["/account/login"].post.responses["200"] = {
        description:
          "A successful login returns a context token which is associated with the logged in user. Use that as your `sw-context-token` header for subsequent requests.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ContextTokenResponse",
            },
          },
        },
      };

      schema.paths["/account/logout"].post.responses["200"] = {
        description:
          "A successful logout returns a context token for the anonymous user. Use that as your `sw-context-token` header for subsequent requests.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ContextTokenResponse",
            },
          },
        },
      };

      return schema;
    },
  },
};
