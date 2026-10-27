import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { findSync } from "find-in-files";
import { extract } from "ts-dox";
import { expCollector } from "unplugin-export-collector/core";

import {
  DYNAMIC_MARKDOWN_PLACEHOLDER,
  getToggleContainer,
  getWrappedCodeBlock,
  normalizeString,
  prepareGithubPermalink,
  replacer,
} from "./utils";

const packagesMap: Record<string, string> = {
  // "api-client": "api-client-next",
};

export async function transformReadmeBasedReference(
  code: string,
  id: string,
  context: { projectRootDir: string; relativeDir: string },
): Promise<string> {
  if (!id.match(/\.md\b/)) return code;
  const { projectRootDir, relativeDir } = context;
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
        resolve(`${projectRootDir}/${relativeDir}/${packageName}/README.md`),
        "utf8",
      ),
    ),
    "API",
    "tail",
  );

  const entrypoint = resolve(
    `${projectRootDir}/${relativeDir}/${packageName}/src/index.ts`,
  );

  // packages without a TypeScript entrypoint (e.g. plain Nuxt layers)
  // expose no API to extract, keep the README-only page
  if (!existsSync(entrypoint)) {
    return transformedCode;
  }

  const indexAstJson = extract(entrypoint);

  const exportedList: string[] = (await expCollector(entrypoint)).sort();

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
      } catch {
        try {
          const definitionFound = await findSync(
            `function ${exportedOne}`,
            resolve(`${projectRootDir}/${relativeDir}/${packageName}/src`),
            ".ts$",
          );
          if (Object.keys(definitionFound)?.length) {
            astJson = extract(resolve(Object.keys(definitionFound)[0]));
          }
        } catch {
          // The symbol is exported but its definition could not be located.
        }
      }
    }

    const functionDefinition =
      astJson.functions?.[exportedOne] || astJson.types[exportedOne] || astJson;

    const availableTypes = astJson.types || {};

    if (functionDefinition.signature && functionDefinition.isExported) {
      API += `\n\n### \`${exportedOne}\`\n\n`;
      if (typeof functionDefinition.docs.deprecated === "string") {
        API += `\n<span style="font-size:0.8em;">⚠️ deprecated - ${functionDefinition.docs.deprecated}</span>\n\n`;
      }
      API += normalizeString(functionDefinition.summary);

      API += getWrappedCodeBlock(normalizeString(functionDefinition.signature));

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
  transformedCode += DYNAMIC_MARKDOWN_PLACEHOLDER;

  return transformedCode;
}
