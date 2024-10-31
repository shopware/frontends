import { Project } from "ts-morph";
import { format } from "prettier";

export type MethodDefinition = {
  operationId: string;
  headers?: string;
  headersOptional?: boolean;
  query?: string;
  queryOptional?: boolean;
  pathParams?: string;
  body: {
    contentType: string;
    code: string;
  }[];
  bodyOptional?: boolean;
  responses: {
    responseCode: number;
    contentType: string;
    code: string;
  }[];
};

export type GenerationMap = {
  [routePath: string]: MethodDefinition;
};

export type OverridesMap = Record<string, string>;

export type TransformedElements = [
  OverridesMap | GenerationMap,
  Record<string, string>,
  string[][],
];

export async function generateFile(
  filepath: string,
  operationsMap: OverridesMap | GenerationMap,
  existingTypes: string[][],
  schemasMap: Record<string, string>,
  options: { version: string },
) {
  const project = await prepareFileContent({
    filepath,
    operationsMap,
    existingTypes,
    componentsMap: schemasMap,
    options,
  });

  await project.save();
}

export async function prepareFileContent({
  filepath,
  operationsMap,
  existingTypes,
  componentsMap,
  options,
}: {
  filepath: string;
  operationsMap: OverridesMap | GenerationMap;
  existingTypes: string[][];
  componentsMap: Record<string, string>;
  options: { version: string };
}) {
  const project = new Project({});

  const combinedKeys = Object.keys(operationsMap);
  const sortedMapKeys = combinedKeys.sort((a, b) => {
    const aValue = a.includes(" ") ? a.split(" ")[2] : a;
    const bValue = b.includes(" ") ? b.split(" ")[2] : b;

    return aValue.localeCompare(bValue);
  });

  const defaultContentType = "application/json";
  const defaultAcceptType = "application/json";

  const sortedSchemaKeys = Object.keys(componentsMap).sort();

  const sourceFile = project.createSourceFile(
    filepath,
    (writer) => {
      existingTypes.forEach((type) => {
        writer.writeLine(type[1]);
      });

      // components
      writer.write("export type components =").block(() => {
        writer.writeLine("schemas: Schemas;");
      });

      writer.write("export type Schemas =").block(() => {
        sortedSchemaKeys.forEach((key) => {
          writer.write(`${key}:`).write(componentsMap[key]); //.write(";");
        });
      });

      writer.write("export type operations =").block(() => {
        for (const routePath of sortedMapKeys) {
          const method = operationsMap[routePath];

          if (typeof method === "string") {
            writer.write(`"${routePath}":`).write(method);
          } else {
            const methodHeaders = method.headers;

            type RequestType = {
              contentType?: string;
              accept?: string;
              headers?: string;
              headersOptional?: boolean;
              query?: string;
              queryOptional?: boolean;
              pathParams?: string;
              body: string | null;
              bodyOptional?: boolean;
              response: string;
              responseCode: number;
            };

            const requests: RequestType[] = [];
            if (!method.body.length) {
              // no body definition
              // requests.push({
              //   headers: { ...methodHeaders },
              //   body: null,
              //   response: null,
              // });
              for (const response of method.responses) {
                requests.push({
                  contentType: defaultContentType,
                  accept: response.contentType,
                  headers: methodHeaders,
                  headersOptional: method.headersOptional,
                  query: method.query,
                  queryOptional: method.queryOptional,
                  pathParams: method.pathParams,
                  body: null,
                  bodyOptional: method.bodyOptional,
                  response: response.code,
                  responseCode: response.responseCode,
                });
              }
            } else {
              for (const body of method.body) {
                // const isDefaultContentType =
                //   body.contentType === defaultContentType;
                for (const response of method.responses) {
                  requests.push({
                    contentType: body.contentType,
                    accept: response.contentType,
                    headers: methodHeaders,
                    headersOptional: method.headersOptional,
                    query: method.query,
                    queryOptional: method.queryOptional,
                    pathParams: method.pathParams,
                    body: body.code,
                    bodyOptional: method.bodyOptional,
                    response: response.code,
                    responseCode: response.responseCode,
                  });
                }
              }
            }

            if (requests.length) {
              const operationIdentifier = routePath; //`${method.operationId} ${methodName} ${routePath}`;

              writer.write(`"${operationIdentifier}":`);
              // .inlineBlock(() => {
              // writer.write("request:");
              requests.forEach((singleRequest, index) => {
                writer.conditionalWrite(index > 0, "| ").block(() => {
                  // add contentType
                  const isDefaultContentType =
                    singleRequest.contentType === defaultContentType;
                  writer.writeLine(
                    `contentType${isDefaultContentType ? "?" : ""}: "${singleRequest.contentType}",`,
                  );

                  const isDefaultAcceptType =
                    singleRequest.accept === defaultAcceptType;
                  writer.writeLine(
                    `accept${isDefaultAcceptType ? "?" : ""}: "${singleRequest.accept}",`,
                  );

                  if (singleRequest.headers?.length) {
                    writer
                      .write(
                        `headers${singleRequest.headersOptional ? "?" : ""}:`,
                      )
                      .write(singleRequest.headers);
                  }

                  if (singleRequest.query) {
                    writer
                      .write(`query${singleRequest.queryOptional ? "?" : ""}:`)
                      .write(singleRequest.query);
                  }

                  if (singleRequest.pathParams) {
                    writer.write(`pathParams:`).write(singleRequest.pathParams);
                  }

                  if (singleRequest.body) {
                    writer
                      .write(`body${singleRequest.bodyOptional ? "?" : ""}:`)
                      .write(singleRequest.body)
                      // .write(";")
                      .newLine();
                    // writer
                    //   .write(`"${body.contentType}":`)
                    //   .write(body.code)
                    //   .write(",");
                  }

                  if (singleRequest.response) {
                    writer
                      .write("response:")
                      .write(singleRequest.response)
                      // .write(";")
                      .newLine();
                  }
                  if (singleRequest.responseCode) {
                    writer
                      .write("responseCode:")
                      .write(singleRequest.responseCode.toString())
                      .write(";")
                      .newLine();
                  }
                });
              });
              // writer.write("responses:").block(() => {
              //   for (const response of method.responses) {
              //     writer.write(`"${response.responseCode}":`).block(() => {
              //       writer.write(`contentType: "${response.contentType}",`);
              //       writer.write(`code: ${response.code},`);
              //     });
              //   }
              // });
              // })
              writer.write(";").newLine();
            } else {
              // console.error(
              //   "No requests for method",
              //   routePath,
              //   // "method",
              //   // method,
              // );
            }
          }
        }
      });
    },
    { overwrite: true },
  );

  // sourceFile.formatText({
  //   indentSize: 2,
  //   placeOpenBraceOnNewLineForFunctions: true,
  // });
  let x = `
/**
* This file is auto-generated. Do not make direct changes to the file.
* Instead override it in your shopware.d.ts file.
*
* Shopware API version: ${options.version}
*
*/
  `;

  x += sourceFile.getFullText();

  const formatted = await format(x, {
    parser: "typescript",
  });
  sourceFile.replaceWithText(formatted);

  return project;
}
