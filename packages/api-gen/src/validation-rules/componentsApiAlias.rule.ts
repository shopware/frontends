import { equals } from "@vitest/expect";
import { diff } from "@vitest/utils/diff";
import type { ObjectSubtype } from "openapi-typescript";
import c from "picocolors";
import { pascalCase, snakeCase } from "scule";

export default (componentName: string, body: ObjectSubtype) => {
  // aliast needs to be in snake case. Examples:
  // - "Category" is "category"
  // - "CmsBlock" is "cms_block"
  const properEnumAliasDefinition = {
    type: "string",
    enum: [snakeCase(componentName)],
  };
  const properConstAliasDefinition = {
    type: "string",
    const: snakeCase(componentName),
  };

  const bodyValue = body?.properties?.apiAlias as ObjectSubtype;

  // skip if apiAlias is not defined
  if (!bodyValue) {
    return null;
  }

  const result =
    equals(properEnumAliasDefinition, bodyValue) ||
    equals(properConstAliasDefinition, bodyValue);
  if (!result) {
    let additionalMessage = "";
    const bodyLiteralValue = getStringLiteralValue(bodyValue);
    if (
      bodyLiteralValue &&
      properEnumAliasDefinition.enum[0] !== bodyLiteralValue
    ) {
      additionalMessage = `It's also possible, that the schema component name is not correct and apiApias is proper. In that case schema component name should be ${c.bold(pascalCase(bodyLiteralValue))}. Confirm proper solution with the source code.`;
    }
    const expectedAliasDefinition =
      "const" in bodyValue
        ? properConstAliasDefinition
        : properEnumAliasDefinition;

    return `Component ${c.bold(componentName)} has invalid ${c.bold("apiAlias")} definition. Diff:\n ${diff(
      expectedAliasDefinition,
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

function getStringLiteralValue(bodyValue: ObjectSubtype) {
  const enumValue = bodyValue?.enum?.[0];
  if (typeof enumValue === "string") {
    return enumValue;
  }

  const constValue = (bodyValue as { const?: unknown })?.const;
  if (typeof constValue === "string") {
    return constValue;
  }

  return undefined;
}
