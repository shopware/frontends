import {
  GenerationMap,
  TransformedElements,
  generateFile,
} from "./generateFile";
import { createVirtualFiles } from "./virtualFileCreator";
// import { transformOpenApiTypes } from "./transformOpenApiTypes";
import { transformSchemaTypes } from "./transformSchemaTypes";
import { defu } from "defu";
import { join } from "node:path";

export async function processAstSchemaAndOverrides(
  [opMap, opComponents, opExistingTypes]: TransformedElements,
  overridingSchema: string,
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
  const [oOperationsMap, oComponetsMap, oExistingTypes] =
    transformSchemaTypes(overridingSchema);

  const operationsMap: GenerationMap = defu(
    oOperationsMap,
    opMap as GenerationMap,
  );
  const componentsMap = defu(oComponetsMap, opComponents);
  const existingTypes = opExistingTypes;

  const filePath = join("api-types", "apiTypes.d.ts");
  generateFile(filePath, operationsMap, existingTypes, componentsMap);
}
