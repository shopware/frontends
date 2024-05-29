import ts from "typescript";
import { createVirtualFiles } from "./virtualFileCreator";
import { getDeepPropertyCode, getTypePropertyNames } from "./utils";
import type { OverridesMap, TransformedElements } from "./generateFile";

export function transformSchemaTypes(schema: string): TransformedElements {
  const {
    typeChecker,
    sourceFiles: [sourceFile],
  } = createVirtualFiles([{ name: "_openApi.d.ts", content: schema }]);

  let overridesMap: OverridesMap = {};
  let componentsMap: Record<string, string> = {};

  let existingTypes: string[][] = [];

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

        allOperations.forEach((currentOperationName) => {
          const code = getDeepPropertyCode({
            type,
            names: [currentOperationName],
            node,
            typeChecker,
          });

          overridesMap[currentOperationName] = code!;
        });
      }

      if (typeName === "Schemas") {
        // const allSchemas = getDeepProperty({
        //   type,
        //   names: ["schemas"],
        //   node,
        // });

        // if (allSchemas) {
        const schemaNames = getTypePropertyNames(type);

        schemaNames.forEach((schemaName) => {
          componentsMap[schemaName] = getDeepPropertyCode({
            type: type,
            names: [schemaName],
            node,
            typeChecker,
          })!;
        });
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

  traverseThroughFileNodes(sourceFile!);

  return [overridesMap, componentsMap, existingTypes];
}
