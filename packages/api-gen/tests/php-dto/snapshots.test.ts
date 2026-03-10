import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateAllFiles } from "../../src/php-dto/generator";
import { parseAllDtos } from "../../src/php-dto/schemaParser";

const FIXTURES_DIR = resolve(__dirname, "fixtures");

const fixtureFiles = readdirSync(FIXTURES_DIR).filter((f) =>
  f.endsWith(".json"),
);

describe("php-dto snapshot tests", () => {
  for (const fixtureFile of fixtureFiles) {
    describe(fixtureFile, () => {
      const schema = JSON.parse(
        readFileSync(resolve(FIXTURES_DIR, fixtureFile), "utf-8"),
      );
      const dtos = parseAllDtos(schema);
      const { files } = generateAllFiles(dtos);
      const { files: filesWithNamespace } = generateAllFiles(dtos, {
        namespace: "App\\DTO",
      });

      it("generates expected number of files", () => {
        expect(files.length).toMatchSnapshot();
      });

      it("generates expected file names", () => {
        const names = files.map((f) => f.fileName).sort();
        expect(names).toMatchSnapshot();
      });

      for (const file of files) {
        it(`generates correct content for ${file.fileName}`, () => {
          expect(file.content).toMatchSnapshot();
        });
      }

      it("generates correct content with namespace", () => {
        const firstWithNs = filesWithNamespace[0];
        if (firstWithNs) {
          expect(firstWithNs.content).toMatchSnapshot();
        }
      });
    });
  }
});
