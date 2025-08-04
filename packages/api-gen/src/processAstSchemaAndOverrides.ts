import { join } from "node:path";
import { defu } from "defu";
import {
  type GenerationMap,
  type TransformedElements,
  generateFile,
} from "./generateFile";
// import { transformOpenApiTypes } from "./transformOpenApiTypes";
import { transformSchemaTypes } from "./transformSchemaTypes";
import { createVirtualFiles } from "./virtualFileCreator";

export async function processAstSchemaAndOverrides(
  [opMap, opComponents, opExistingTypes, opParameters]: TransformedElements,
  overridingSchema: string,
  type: "store" | "admin",
  options: { version: string },
) {
  const {
    sourceFiles: [sourceFile, overridesSourceFile],
  } = createVirtualFiles([
    // { name: "_main.d.ts", content: schema },
    { name: "_main.d.ts", content: "" },
    { name: "_overrides.d.ts", content: overridingSchema },
  ]);

  if (!sourceFile) {
    console.error("source file not found");
    return;
  }

  // const [opMap, opComponents, opExistingTypes] = transformOpenApiTypes(schema);

  if (!overridesSourceFile) {
    console.error("Overriding source file not found");
    return;
  }
  // recursivelyGetOverrides(overridesSourceFile);
  const [oOperationsMap, oComponetsMap] =
    transformSchemaTypes(overridingSchema);

  const operationsMap: GenerationMap = defu(
    oOperationsMap,
    opMap as GenerationMap,
  );
  const componentsMap = defu(oComponetsMap, opComponents);
  const existingTypes = opExistingTypes;
  const parametersMap = opParameters;

  const filePath = join("api-types", `${type}ApiTypes.d.ts`);
  await generateFile(
    filePath,
    operationsMap,
    existingTypes,
    componentsMap,
    parametersMap,
    options,
  );
}
