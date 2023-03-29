import {
  extract,
  TsDoxClass,
  TsDoxFile,
  TsDoxFunction,
  TsDoxParameter,
} from "ts-dox";
import { find, FindResult } from "find-in-files";
import { existsSync } from "fs-extra";
import { basename, resolve } from "path";
import {
  getTypesTable as _getTypesTable,
  getFunctionDescription as _getFunctionDescription,
  getFunctionReturnType as _getFunctionReturnType,
  getFunctionReturnTypeSignature as _getFunctionReturnTypeSignature,
  getFunctionSignature as _getFunctionSignature,
  getFunctionData as _getFunctionData,
  getExportedAPIs,
} from "./extractor";
import { Property, PropertyMdTableRow } from "./types";

export type SourcePath = {
  autogenExampleAlias?: string;
  functions: string;
  types: string;
};

export type SourceResolverReturn = {
  typesMetadata: TsDoxFunction | TsDoxFile | undefined;
  activeConfig: SourcePath;
  getExportedTypes(type: string): Promise<
    | (Pick<FindResult[string], "count" | "line" | "matches"> & {
        path: string;
      })
    | undefined
  >;
  linkExternalTypes(input: string, types: string[]): Promise<string>;
};
export async function SourceResolver({
  filename,
  rootDir,
  sourcePaths,
}: {
  filename: string;
  rootDir: string;
  sourcePaths: SourcePath[];
}): Promise<SourceResolverReturn> {
  const metadata = await getTypesMetadata();
  if (!metadata?.activeConfig || !metadata?.typesMetadata) {
    return {} as any;
  }
  const { activeConfig, typesMetadata } = metadata;

  async function getTypesMetadata(): Promise<
    | {
        activeConfig: SourcePath;
        typesMetadata: any;
      }
    | undefined
  > {
    for (const sourcePath of sourcePaths) {
      let path = `${sourcePath.functions}/${filename}.ts`;

      if (filename === "index" || !existsSync(path)) {
        // try to resolve index file

        const definitionFound = await find(
          `function\ ${filename}`,
          resolve(sourcePath.functions),
          ".ts$"
        );

        if (!Object.keys(definitionFound)?.length) {
          continue;
        }

        path = Object.keys(definitionFound)[0];
      }

      const typesMetadata = extract(path);

      if (typesMetadata)
        return {
          typesMetadata: typesMetadata,
          activeConfig: sourcePath,
        };
    }

    return;
  }

  async function getExportedTypes(type: string): Promise<
    | (Pick<FindResult[string], "count" | "line" | "matches"> & {
        path: string;
      })
    | undefined
  > {
    try {
      const typePath = await find(
        `export type ${type} =`,
        resolve(activeConfig.types),
        ".d.ts$"
      );

      const relativeTypePath = Object.keys(typePath)[0];

      return { ...Object.values(typePath)?.[0], path: relativeTypePath };
    } catch (error) {
      console.error("error", error);
    }
    return;
  }

  async function linkExternalTypes(input: string, types: string[]) {
    const uniqueTypes = removeRedundantItems(types);
    let output = input;
    for (const i in uniqueTypes) {
      const typeName = uniqueTypes[i];
      const filePath = await getExportedTypes(typeName);
      if (filePath?.path) {
        const typeMetaData = extract(resolve(filePath.path));
        const typeDef = typeMetaData?.types?.[typeName];

        const patternToReplace = new RegExp(`\\b${typeName}\\b`, "gm");

        output = output.replaceAll(
          new RegExp(patternToReplace, "gm"),
          prepareGithubPermalink({
            label: typeName,
            project: "shopware/frontends",
            path: removeRelativePath(filePath?.path),
            line: typeDef?.location?.line + 1,
          })
        );
      }
    }

    return output;
  }

  function removeRelativePath(path: string) {
    return path.replace(rootDir, "");
  }

  return {
    activeConfig,
    typesMetadata,
    getExportedTypes,
    linkExternalTypes,
  };
}

export type TypesParserReturn = {
  getFunctionParameters(functionName: string): TsDoxParameter[] | undefined;
  getMultipleFunctions(metadata: TsDoxFile): [string, TsDoxFunction][];
  getFunctionSignature(functionName: string): string | undefined;
  getFunctionReturnType(functionName: string): string | undefined;
  getFunctionReturnTypeSignature(returnType: string): string | undefined;
  getFunctionDescription(functionName: string): string | undefined;
  getTypesTable(
    accessor: "properties" | "methods",
    transformRow?: (propertyData: Property) => Promise<PropertyMdTableRow>
  ): Promise<string>;
  hasProperties(): boolean;
  hasMethods(): boolean;
  hasMultipleFunctions(): boolean;
  hasFunctionDefinition(): boolean;
  getUsageCodeBlock(): string;
};

export function TypesParser({
  metadata,
}: {
  metadata: TsDoxFunction | TsDoxFile;
}): TypesParserReturn {
  function hasProperties(): boolean {
    return metadata.hasOwnProperty("properties");
  }

  function hasMethods(): boolean {
    return metadata.hasOwnProperty("methods");
  }

  function hasMultipleFunctions() {
    return (
      metadata.hasOwnProperty("functions") &&
      Object.entries((metadata as TsDoxFile).functions).length > 1
    );
  }

  function hasFunctionDefinition() {
    return (
      metadata.hasOwnProperty("functions") &&
      Object.entries((metadata as TsDoxFile).functions).length === 1
    );
  }

  function getUsageCodeBlock(): string {
    if (!hasProperties() && !hasMethods()) {
      return "";
    }

    const functionName = basename(metadata.name, ".ts");
    const exportedApiList = getExportedApiList();
    if (!exportedApiList.length) {
      return "";
    }

    const breakLine = exportedApiList.length > 2;
    const parametersList = getFunctionParameters(functionName)?.map(
      ({ name }) => name
    );

    return `\`\`\`ts
const { ${breakLine ? "\n" : ""} ${
      breakLine ? exportedApiList.join(",\n ") : exportedApiList.join(", ")
    } ${breakLine ? "\n" : ""}} = ${functionName}(${parametersList?.join(
      ", "
    )});
\`\`\``;
  }

  function getExportedApiList(): string[] {
    const functionName = basename(metadata.name, ".ts");

    const returnTypeSignature = getFunctionReturnTypeSignature(
      getFunctionReturnType(functionName) || ""
    );
    // filter out properties that are not present in the return signature (BUG)
    const exportedApiList = getExportedAPIs(metadata as any)?.filter(
      (property) =>
        returnTypeSignature?.includes(` ${property}:`) ||
        returnTypeSignature?.includes(` ${property}(`)
    );

    return exportedApiList;
  }

  async function getTypesTable(
    accessor: "properties" | "methods",
    transformRow?: (propertyData: Property) => Promise<PropertyMdTableRow>
  ): Promise<string> {
    return _getTypesTable(
      metadata as any,
      accessor,
      getExportedApiList(),
      transformRow
    );
  }

  function getFunctionDescription(functionName: string): string | undefined {
    return _getFunctionDescription(metadata as TsDoxFile, functionName);
  }

  function getFunctionSignature(functionName: string): string | undefined {
    return _getFunctionSignature(metadata as TsDoxFile, functionName);
  }

  function getFunctionReturnType(functionName?: string): string | undefined {
    const functionData = _getFunctionData(metadata as TsDoxFile, functionName);
    if (!functionData) {
      return;
    }
    return _getFunctionReturnType(functionData);
  }

  function getFunctionReturnTypeSignature(
    returnType: string
  ): string | undefined {
    return _getFunctionReturnTypeSignature(
      returnType,
      metadata as unknown as TsDoxFile
    );
  }

  function getFunctionParameters(
    functionName: string
  ): TsDoxParameter[] | undefined {
    const functionData = _getFunctionData(metadata as TsDoxFile, functionName);
    return functionData?.parameters;
  }

  function getMultipleFunctions(): [string, TsDoxFunction][] {
    return Object.entries((metadata as TsDoxFile)?.functions);
  }

  return {
    getFunctionParameters,
    getMultipleFunctions,
    getFunctionReturnType,
    getFunctionReturnTypeSignature,
    getFunctionSignature,
    getFunctionDescription,
    getTypesTable,
    getUsageCodeBlock,
    hasProperties,
    hasMethods,
    hasMultipleFunctions,
    hasFunctionDefinition,
  };
}

export function extractType(returnType?: string | null) {
  if (!returnType) {
    return;
  }
  return returnType.match(
    /(?!(Id|Partial|Array|Promise|Computed|ComputedRef|Ref))([A-Z][a-zA-Z0-9]+)/gm
  );
}

export function prepareGithubPermalink({
  label,
  project,
  path,
  line,
}: {
  label: string;
  project: string;
  path: string;
  line?: number;
}) {
  return `<a href="https://github.com/${project}/tree/main${path}#L${line}" target="_blank">${label}</a>`;
}

export function prepareGithubUrl({
  project,
  path,
  line,
}: {
  project: string;
  path: string;
  line?: number;
}) {
  return `https://github.com/${project}/tree/main${path}#L${line}`;
}
export function removeRedundantItems(arrayToClean?: string[] | null): string[] {
  if (!arrayToClean) {
    return [];
  }
  return [...new Set(arrayToClean)];
}

export function isFunctionDefinition(
  metadata: TsDoxFile | TsDoxClass | TsDoxFunction
): metadata is TsDoxFunction {
  return metadata.hasOwnProperty("parameters");
}

export function isFileDefinition(
  metadata: TsDoxFile | TsDoxClass | TsDoxFunction
): metadata is TsDoxFile {
  return metadata.hasOwnProperty("types");
}
