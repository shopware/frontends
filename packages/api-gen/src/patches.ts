// @ts-nocheck
import type { OpenAPI3 } from "openapi-typescript";

/**
 * To add new patch define version (using semver) and patch function which modifies JSON schema and saves it back to file.
 */
export const patches = {
  ">=5.0": {
    /**
     * Fixes the problem  with schema >=5.0 where ContextTokenResponse is not defined
     */
    name: "ContextTokenResponse",
    patch: (schema: OpenAPI3) => {
      schema.components ??= {};
      schema.components.schemas ??= {};
      schema.paths ??= {};

      schema.components.schemas.ContextTokenResponse ??= {
        type: "object",
        properties: {
          contextToken: {
            description: "Context token identifying the current user session.",
            type: "string",
          },
        },
      };

      schema.paths["/context"].patch ??= {};
      if ("responses" in schema.paths["/context"].patch) {
        schema.paths["/context"].patch.responses ??= {};
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
      }

      schema.paths["/account/login"].post ??= {};
      if ("responses" in schema.paths["/account/login"].post) {
        schema.paths["/account/login"].post.responses ??= {};
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
      }

      schema.paths["/account/logout"].post ??= {};
      if ("responses" in schema.paths["/account/logout"].post) {
        schema.paths["/account/logout"].post.responses ??= {};
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
      }

      return schema;
    },
  },
};
