import ts from "typescript";
import { createVirtualFiles } from "./virtualFileCreator";
import {
  getDeepProperty,
  getDeepPropertyCode,
  getTypePropertyNames,
  isOptional,
} from "./utils";
import {
  GenerationMap,
  MethodDefinition,
  TransformedElements,
} from "./generateFile";

export function transformOpenApiTypes(schema: string): TransformedElements {
  const {
    // program,
    typeChecker,
    sourceFiles: [sourceFile],
  } = createVirtualFiles([{ name: "_openApi.d.ts", content: schema }]);

  let operationsMap: GenerationMap = {};
  // let overridesMap: OverridesMap = {};
  let componentsMap: Record<string, string> = {};

  let existingTypes: string[][] = [];

  function traverseThroughFileNodes(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
      const nodeText = node.getText(sourceFile);
      const type = typeChecker.getTypeAtLocation(node);
      const typeName =
        (node as ts.TypeAliasDeclaration).name.escapedText ||
        typeChecker.typeToString(type, node, ts.TypeFormatFlags.NoTruncation);

      if (typeName === "paths") {
        const allPaths = getTypePropertyNames(type);

        for (const currentPath of allPaths) {
          const getUpdateContextPath = getDeepProperty({
            type,
            names: [currentPath],
            node,
            typeChecker,
          });

          if (getUpdateContextPath) {
            const restMethodNames = getTypePropertyNames(getUpdateContextPath);

            restMethodNames.forEach((restMethodName) => {
              const operationReferenceCode = getDeepPropertyCode({
                type: getUpdateContextPath,
                names: [restMethodName],
                node,
                typeChecker,
              });
              const operationId =
                operationReferenceCode?.match(/operations\["(.+)"\]/)?.[1];

              const operationKey = `${operationId} ${restMethodName} ${currentPath}`;

              const operationGenerationMap: MethodDefinition = {
                body: [],
                query: undefined,
                pathParams: undefined,
                responses: [],
                headers: undefined,
                operationId: operationId!,
              };

              const operation = getDeepProperty({
                type: getUpdateContextPath,
                names: [restMethodName],
                node,
                typeChecker,
              });

              if (operation) {
                const operationRequestBodyContent = getDeepProperty({
                  type: operation,
                  names: ["requestBody", "content"],
                  node,
                  typeChecker,
                });

                const requestBodyProp = operation.getProperty("requestBody");
                if (requestBodyProp) {
                  operationGenerationMap.bodyOptional =
                    isOptional(requestBodyProp);
                }

                if (operationRequestBodyContent) {
                  const contentTypes = getTypePropertyNames(
                    operationRequestBodyContent,
                  );

                  contentTypes.forEach((contentType) => {
                    const code = getDeepPropertyCode({
                      // const code = getDeepPropertyCode({
                      type: operationRequestBodyContent,
                      names: [contentType],
                      node,
                      typeChecker,
                    });

                    operationGenerationMap.body.push({
                      contentType,
                      // code: typeChecker.typeToString(
                      //   code,
                      //   undefined,
                      //   ts.TypeFormatFlags.NoTruncation,
                      // ),
                      code: code!,
                    });
                  });
                }

                const operationResponses = getDeepProperty({
                  type: operation,
                  names: ["responses"],
                  node,
                  typeChecker,
                });
                if (operationResponses) {
                  const responseCodes =
                    getTypePropertyNames(operationResponses);

                  responseCodes.forEach((responseCode) => {
                    if (responseCode.toString().startsWith("2")) {
                      const contents = getDeepProperty({
                        type: operationResponses,
                        names: [responseCode, "content"],
                        node,
                        typeChecker,
                      });

                      if (contents) {
                        const contentNames = getTypePropertyNames(contents);

                        if (!contentNames.length) {
                          // on response there is no content
                          operationGenerationMap.responses.push({
                            responseCode: parseInt(responseCode),
                            contentType: "application/json", // TODO: use default content type
                            code: "never",
                          });
                        } else {
                          contentNames.forEach((contentType) => {
                            const code = getDeepPropertyCode({
                              // const code = getDeepProperty({
                              type: contents,
                              names: [contentType],
                              node,
                              typeChecker,
                            });

                            operationGenerationMap.responses.push({
                              responseCode: parseInt(responseCode),
                              contentType,
                              // code: typeChecker.typeToString(
                              //   code,
                              //   undefined,
                              //   ts.TypeFormatFlags.NoTruncation,
                              // ),
                              code: code!,
                            });
                          });
                        }
                      }
                    }
                  });
                }

                // query parameters
                const operationQueryParams = getDeepProperty({
                  type: operation,
                  names: ["parameters"],
                  node,
                  typeChecker,
                });
                if (operationQueryParams) {
                  const queryParam = getDeepProperty({
                    type: operationQueryParams,
                    names: ["query"],
                    node,
                    typeChecker,
                  });
                  if (queryParam) {
                    const allQueryParams = queryParam.getProperties(); //(queryParam);
                    const areAllQueryParamsOptional = allQueryParams.every(
                      (param) => isOptional(param),
                    );
                    operationGenerationMap.queryOptional =
                      areAllQueryParamsOptional;

                    operationGenerationMap.query = getDeepPropertyCode({
                      type: operationQueryParams,
                      names: ["query"],
                      node,
                      typeChecker,
                    })!;
                  }

                  operationGenerationMap.pathParams = getDeepPropertyCode({
                    type: operationQueryParams,
                    names: ["path"],
                    node,
                    typeChecker,
                  })!;

                  const headersParam = getDeepProperty({
                    type: operationQueryParams,
                    names: ["header"],
                    node,
                    typeChecker,
                  });
                  if (headersParam) {
                    const allHeaders = headersParam.getProperties();
                    const areAllHeadersOptional = allHeaders.every((param) =>
                      isOptional(param),
                    );
                    operationGenerationMap.headersOptional =
                      areAllHeadersOptional;

                    operationGenerationMap.headers = getDeepPropertyCode({
                      type: operationQueryParams,
                      names: ["header"],
                      node,
                      typeChecker,
                    })!;
                  }
                }
              }

              // TODO create code from operationGenerationMap
              operationsMap[operationKey] = operationGenerationMap;
            });
          }
        }
      }

      if (typeName === "components") {
        const allSchemas = getDeepProperty({
          type,
          names: ["schemas"],
          node,
          typeChecker,
        });

        if (allSchemas) {
          const schemaNames = getTypePropertyNames(allSchemas);

          schemaNames.forEach((schemaName) => {
            componentsMap[schemaName] = getDeepPropertyCode({
              type: allSchemas,
              names: [schemaName],
              node,
              typeChecker,
            })!;
          });
        }
      }

      const doNotMoveTypes = [
        "$defs",
        "components",
        "external",
        "operationPaths",
        "operations",
        "paths",
        "webhooks",
      ];
      if (!doNotMoveTypes.includes(typeName)) {
        existingTypes.push([typeName, nodeText]);
      }
    }

    node.forEachChild((child) => traverseThroughFileNodes(child));
  }

  traverseThroughFileNodes(sourceFile!);

  return [operationsMap, componentsMap, existingTypes];
}
