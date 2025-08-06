import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { prepareFileContent } from "../src/generateFile";
import { transformOpenApiTypes } from "../src/transformOpenApiTypes";

describe("transformOpenApiTypes", async () => {
  const inputFileNames = readdirSync(
    join(__dirname, "./snapshots-transformOpenApiTypes"),
  )
    .filter((name) => name.endsWith(".example.ts"))
    .map((filename) => filename.replace(".example.ts", ""));

  for (const exampleName of inputFileNames) {
    it(`transform should match snapshot for file: ${exampleName}`, async () => {
      const exampleFileContent = readFileSync(
        join(
          __dirname,
          `./snapshots-transformOpenApiTypes/${exampleName}.example.ts`,
        ),
        "utf-8",
      );

      const [operationsMap, componentsMap, existingTypes, parametersMap] =
        transformOpenApiTypes(exampleFileContent);

      await expect(operationsMap).toMatchFileSnapshot(
        `./snapshots-transformOpenApiTypes/${exampleName}.operationsMap.txt`,
        `${exampleName} does not match operationsMap`,
      );
      await expect(componentsMap).toMatchFileSnapshot(
        `./snapshots-transformOpenApiTypes/${exampleName}.componentsMap.txt`,
        `${exampleName} does not match componentsMap`,
      );
      await expect(existingTypes).toMatchFileSnapshot(
        `./snapshots-transformOpenApiTypes/${exampleName}.existingTypes.txt`,
        `${exampleName} does not match existingTypes`,
      );

      const project = await prepareFileContent({
        filepath: "_tmp.ts",
        operationsMap,
        existingTypes,
        componentsMap: componentsMap,
        parametersMap,
        options: {
          version: "0.0.0",
        },
      });

      const sourceFile = await project.getSourceFile("_tmp.ts");

      const result = sourceFile?.getFullText();

      await expect(result).toMatchFileSnapshot(
        `./snapshots-transformOpenApiTypes/${exampleName}.result.ts`,
      );
    });
  }
});
