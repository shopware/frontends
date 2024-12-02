import ts from "typescript";
import { createVirtualFiles } from "./virtualFileCreator";
import {
  getDeepProperty,
  getDeepPropertyCode,
  getTypePropertyNames,
  isNeverType,
  isOptional,
} from "./utils";
import type {
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

  const operationsMap: GenerationMap = {};
  // let overridesMap: OverridesMap = {};
  const componentsMap: Record<string, string> = {};

  const existingTypes: string[][] = [];

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

            for (const restMethodName of restMethodNames) {
              const operationReferenceCode = getDeepPropertyCode({
                type: getUpdateContextPath,
                names: [restMethodName],
                node,
                typeChecker,
              });
              const operationId =
                operationReferenceCode?.match(/operations\["(.+)"\]/)?.[1];

              if (!operationId) {
                // if operationId does not exist or is undefined, we omit the operation
                continue;
              }

              const operationKey = `${operationId} ${restMethodName} ${currentPath}`;

              const operationGenerationMap: MethodDefinition = {
                body: [],
                query: undefined,
                pathParams: undefined,
                responses: [],
                headers: undefined,
                operationId,
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

                  for (const contentType of contentTypes) {
                    const code = getDeepPropertyCode({
                      type: operationRequestBodyContent,
                      names: [contentType],
                      node,
                      typeChecker,
                    });
                    if (code) {
                      operationGenerationMap.body.push({
                        contentType,
                        code,
                      });
                    }
                  }
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

                  for (const responseCode of responseCodes) {
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
                            responseCode: Number.parseInt(responseCode),
                            contentType: "application/json", // TODO: use default content type
                            code: "never",
                          });
                        } else {
                          for (const contentType of contentNames) {
                            const code = getDeepPropertyCode({
                              type: contents,
                              names: [contentType],
                              node,
                              typeChecker,
                            });
                            if (code) {
                              operationGenerationMap.responses.push({
                                responseCode: Number.parseInt(responseCode),
                                contentType,
                                code,
                              });
                            }
                          }
                        }
                      }
                    }
                  }
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
                  if (queryParam && !isNeverType(queryParam)) {
                    const allQueryParams = queryParam.getProperties(); //(queryParam);
                    const areAllQueryParamsOptional = allQueryParams.every(
                      (param) => isOptional(param),
                    );
                    operationGenerationMap.queryOptional =
                      areAllQueryParamsOptional;

                    const queryCode = getDeepPropertyCode({
                      type: operationQueryParams,
                      names: ["query"],
                      node,
                      typeChecker,
                    });
                    if (queryCode) {
                      operationGenerationMap.query = queryCode;
                    }
                  }

                  const pathParamProperty = getDeepProperty({
                    type: operationQueryParams,
                    names: ["path"],
                    node,
                    typeChecker,
                  });
                  if (!isNeverType(pathParamProperty)) {
                    const pathCode = getDeepPropertyCode({
                      type: operationQueryParams,
                      names: ["path"],
                      node,
                      typeChecker,
                    });
                    if (pathCode) {
                      operationGenerationMap.pathParams = pathCode;
                    }
                  }

                  const headersParam = getDeepProperty({
                    type: operationQueryParams,
                    names: ["header"],
                    node,
                    typeChecker,
                  });
                  if (headersParam && !isNeverType(headersParam)) {
                    const allHeaders = headersParam.getProperties();
                    const areAllHeadersOptional = allHeaders.every((param) =>
                      isOptional(param),
                    );
                    operationGenerationMap.headersOptional =
                      areAllHeadersOptional;

                    const headersCode = getDeepPropertyCode({
                      type: operationQueryParams,
                      names: ["header"],
                      node,
                      typeChecker,
                    });
                    if (headersCode) {
                      operationGenerationMap.headers = headersCode;
                    }
                  }
                }
              }

              // TODO create code from operationGenerationMap
              operationsMap[operationKey] = operationGenerationMap;
            }
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

          for (const schemaName of schemaNames) {
            const schemaCode = getDeepPropertyCode({
              type: allSchemas,
              names: [schemaName],
              node,
              typeChecker,
            });
            if (schemaCode) {
              componentsMap[schemaName] = schemaCode;
            }
          }
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

  if (sourceFile) {
    traverseThroughFileNodes(sourceFile);
  }

  return [operationsMap, componentsMap, existingTypes];
}
