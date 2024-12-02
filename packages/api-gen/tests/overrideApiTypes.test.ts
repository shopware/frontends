import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { transformOpenApiTypes } from "../src/transformOpenApiTypes";
import { prepareFileContent } from "../src/generateFile";

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

      const [operationsMap, componentsMap, existingTypes] =
        transformOpenApiTypes(exampleFileContent);

      const project = await prepareFileContent({
        filepath: "_tmp.ts",
        operationsMap,
        existingTypes,
        componentsMap: componentsMap,
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
