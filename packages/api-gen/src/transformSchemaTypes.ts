import ts from "typescript";
import { createVirtualFiles } from "./virtualFileCreator";
import {
  getDeepProperty,
  getDeepPropertyCode,
  getTypePropertyNames,
} from "./utils";
import type {
  GenerationMap,
  OverridesMap,
  TransformedElements,
} from "./generateFile";

export function transformSchemaTypes(schema: string): TransformedElements {
  const {
    typeChecker,
    sourceFiles: [sourceFile],
  } = createVirtualFiles([{ name: "_openApi.d.ts", content: schema }]);

  let overridesMap: OverridesMap = {};
  let componentsMap: Record<string, string> = {};

  let existingTypes: string[][] = [];

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

      if (typeName === "schemas") {
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
        // wrong types are parsed as code, irgore them
        typeName.includes(" ")
      ) {
        existingTypes.push([typeName, nodeText]);
      }
    }

    node.forEachChild((child) => traverseThroughFileNodes(child));
  }

  traverseThroughFileNodes(sourceFile!);

  return [overridesMap, componentsMap, existingTypes];
}
