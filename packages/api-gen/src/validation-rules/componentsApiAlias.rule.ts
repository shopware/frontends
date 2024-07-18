import { snakeCase, pascalCase } from "scule";
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

  const bodyValue = body.properties?.apiAlias as ObjectSubtype;

  // skip if apiAlias is not defined
  if (!bodyValue) {
    return null;
  }

  const result = equals(properAliasDefinition, bodyValue);
  if (!result) {
    let additionalMessage = "";
    const bodyEnumValue = bodyValue?.enum?.[0] as string | undefined;
    if (bodyEnumValue && properAliasDefinition.enum[0] !== bodyEnumValue) {
      additionalMessage = `It's also possible, that the schema component name is not correct and apiApias is proper. In that case schema component name should be ${c.bold(pascalCase(bodyEnumValue))}. Confirm proper solution with the source code.`;
    }

    return `Component ${c.bold(componentName)} has invalid ${c.bold("apiAlias")} definition. Diff:\n ${diff(
      properAliasDefinition,
      bodyValue,
      {
        aColor: c.green,
        bColor: c.red,
      },
    )}${additionalMessage.length ? `\n${additionalMessage}` : ""}`;
  }

  // check if apiAlias is required
  if (!body.required?.includes("apiAlias")) {
    return `Component ${c.bold(componentName)} has invalid ${c.bold("apiAlias")} definition. This field should be required.`;
  }

  return null;
};
