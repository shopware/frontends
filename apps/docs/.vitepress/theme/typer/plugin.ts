import { existsSync, readFileSync } from "node:fs";
import { BlockList } from "node:net";
import { resolve } from "node:path";
import { findSync } from "find-in-files";
import { extract } from "ts-dox";
import { expCollector } from "unplugin-export-collector/core";
// @ts-nocheck
import type { Plugin } from "vite";
import {
  getToggleContainer,
  getWrappedCodeBlock,
  normalizeString,
  prepareGithubPermalink,
  replacer,
} from "./utils";

const packagesMap = {
  // "api-client": "api-client-next",
};

export async function ReadmeBasedReference({
  projectRootDir,
  relativeDir,
}: {
  projectRootDir: string;
  relativeDir: string;
}): Promise<Plugin> {
  return {
    name: "packages-reference-md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;
      const [pkg, fileName] = id.split("/").slice(-2);
      const packageDirName = fileName.replace(/\.md$/, "");
      const packageName = packagesMap[packageDirName] || packageDirName;

      let transformedCode = code;

      if (
        pkg !== "packages" ||
        packageName === "composables" ||
        !existsSync(
          resolve(`${projectRootDir}/${relativeDir}/${packageName}/README.md`),
        )
      ) {
        return transformedCode;
      }

      transformedCode = replacer(
        transformedCode,
        normalizeString(
          readFileSync(
            resolve(
              `${projectRootDir}/${relativeDir}/${packageName}/README.md`,
            ),
            "utf8",
          ),
        ),
        "API",
        "tail",
      );

      const indexAstJson = extract(
        resolve(`${projectRootDir}/${relativeDir}/${packageName}/src/index.ts`),
      );

      const exportedList: string[] = await expCollector(
        resolve(`${projectRootDir}/${relativeDir}/${packageName}/src/index.ts`),
      );

      if (!exportedList.length) {
        return transformedCode;
      }

      let API = "\n\n## API\n\n";
      let astJson = indexAstJson;

      for (const exportedOne of exportedList) {
        if (!astJson.functions?.[exportedOne]?.signature) {
          try {
            astJson = extract(
              resolve(
                `${projectRootDir}/${relativeDir}/${packageName}/src/${exportedOne.replace("Function", "")}.ts`,
              ),
            );
          } catch (error) {
            try {
              const definitionFound = await findSync(
                `function\ ${exportedOne}`,
                resolve(`${projectRootDir}/${relativeDir}/${packageName}/src`),
                ".ts$",
              );
              if (Object.keys(definitionFound)?.length) {
                astJson = extract(resolve(Object.keys(definitionFound)[0]));
              }
            } catch (error) {}
          }
        }

        const functionDefinition =
          astJson.functions?.[exportedOne] ||
          astJson.types[exportedOne] ||
          astJson;

        const availableTypes = astJson.types || {};

        if (functionDefinition.signature && functionDefinition.isExported) {
          API += `\n\n### \`${exportedOne}\`\n\n`;
          if (typeof functionDefinition.docs.deprecated === "string") {
            API += `\n<span style="font-size:0.8em;">⚠️ deprecated - ${functionDefinition.docs.deprecated}</span>\n\n`;
          }
          API += normalizeString(functionDefinition.summary);

          API += getWrappedCodeBlock(
            normalizeString(functionDefinition.signature),
          );

          API += prepareGithubPermalink({
            label: "source code",
            path: functionDefinition?.location?.file.replace("../../", ""),
            project: "shopware/frontends",
            line: functionDefinition?.location?.line + 1,
          });

          if (availableTypes[functionDefinition?.returnType]?.signature) {
            API += getToggleContainer(
              getWrappedCodeBlock(
                availableTypes[functionDefinition?.returnType]?.signature,
              ),
              `<span style="color:#9f6c0f;font-size:0.8em;cursor:pointer;">expand ${functionDefinition?.returnType}</span>`,
            );
          }
        }
      }

      // place it before the changelog
      transformedCode = replacer(transformedCode, API, "", "tail");
      // for LLM training
      transformedCode += '\n<div data-placeholder="dynamic-markdown"></div>\n';

      return transformedCode;
    },
  };
}
