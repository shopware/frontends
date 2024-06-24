import { snakeCase } from "scule";
import { equals } from "@vitest/expect";
import { diff } from "@vitest/utils/diff";
import c from "picocolors";
import type { ObjectSubtype } from "openapi-typescript";

export default (componentName: string, body: ObjectSubtype) => {
  // aliast needs to be in snake case. Examples:
  // - "Category" is "category"
  // - "CmsBlock" is "cms_block"
  const properAliasDefinition = {
    type: "string",
    enum: [snakeCase(componentName)],
  };

  const bodyValue = body.properties?.apiAlias;

  // skip if apiAlias is not defined
  if (!bodyValue) {
    return null;
  }

  // check if apiAlias is required
  if (body.required && !body.required.includes("apiAlias")) {
    return `Component ${c.bold(componentName)} has invalid ${c.bold("apiAlias")} definition. This field should be required.`;
  }

  const result = equals(properAliasDefinition, bodyValue);
  if (!result) {
    return `Component ${c.bold(componentName)} has invalid ${c.bold("apiAlias")} definition. Diff:\n ${diff(
      properAliasDefinition,
      bodyValue,
      {
        aColor: c.green,
        bColor: c.red,
      },
    )}`;
  }

  return null;
};
