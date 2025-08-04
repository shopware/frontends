import ts from "typescript";
import type { OverridesMap, TransformedElements } from "./generateFile";
import { getDeepPropertyCode, getTypePropertyNames } from "./utils";
import { createVirtualFiles } from "./virtualFileCreator";

export function transformSchemaTypes(schema: string): TransformedElements {
  const {
    typeChecker,
    sourceFiles: [sourceFile],
  } = createVirtualFiles([{ name: "_openApi.d.ts", content: schema }]);

  const overridesMap: OverridesMap = {};
  const componentsMap: Record<string, string> = {};
  const parametersMap: Record<string, string> = {};

  const existingTypes: string[][] = [];

  const skipTypeNames = ["operations", "Schemas", "components"];

  function traverseThroughFileNodes(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
      const nodeText = node.getText(sourceFile);
      const type = typeChecker.getTypeAtLocation(node);
      const typeName = typeChecker.typeToString(
        type,
        node,
        ts.TypeFormatFlags.NoTruncation,
      );

      if (typeName === "operations") {
        const allOperations = getTypePropertyNames(type);

        for (const currentOperationName of allOperations) {
          const code = getDeepPropertyCode({
            type,
            names: [currentOperationName],
            node,
            typeChecker,
          });
          if (code) {
            overridesMap[currentOperationName] = code;
          }
        }
      }

      if (typeName === "Schemas") {
        // const allSchemas = getDeepProperty({
        //   type,
        //   names: ["schemas"],
        //   node,
        // });

        // if (allSchemas) {
        const schemaNames = getTypePropertyNames(type);

        for (const schemaName of schemaNames) {
          const code = getDeepPropertyCode({
            type: type,
            names: [schemaName],
            node,
            typeChecker,
          });
          if (code) {
            componentsMap[schemaName] = code;
          }
        }
        // }
      }

      if (
        !existingTypes.some((t) => t[0] === typeName) &&
        !skipTypeNames.includes(typeName)
        // &&
        // wrong types are parsed as code, ignore them
        // typeName.includes(" ")
      ) {
        existingTypes.push([typeName, nodeText]);
      }
    }

    node.forEachChild((child) => traverseThroughFileNodes(child));
  }

  if (sourceFile) {
    traverseThroughFileNodes(sourceFile);
  }

  return [overridesMap, componentsMap, existingTypes, parametersMap];
}
