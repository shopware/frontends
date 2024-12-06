import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { findSync } from "find-in-files";
import { extract } from "ts-dox";
// @ts-nocheck
import type { Plugin } from "vite";
import {
  getToggleContainer,
  getWrappedCodeBlock,
  normalizeAnchorText,
  normalizeString,
  prepareGithubPermalink,
  replacer,
} from "./utils";

export async function ComposablesBuilder({
  projectRootDir,
  relativeDir,
  mountPoint,
}: {
  projectRootDir: string;
  relativeDir: string;
  mountPoint: string;
}): Promise<Plugin> {
  return {
    name: "composables-builder",
    enforce: "pre",
    async transform(sourceCode, id) {
      if (!id.match(/\.md\b/)) return null;

      let transformedCode = sourceCode;
      const [pkg, type, fileName] = id.split("/").slice(-3);

      const composableName = fileName.replace(".md", "");

      if (pkg !== "packages" || type !== "composables") {
        return transformedCode;
      }

      if (composableName === "index") {
        transformedCode = transformedCode.replace(
          "{{INTRO}}",
          normalizeString(
            readFileSync(
              resolve(`${projectRootDir}/${relativeDir}/../README.md`),
              "utf8",
            ),
          ),
        );

        return transformedCode;
      }
      // Build name
      transformedCode = transformedCode.replace("{{NAME}}", composableName);

      let astJson = "";

      try {
        astJson = extract(
          resolve(
            `${projectRootDir}/${relativeDir}/${composableName}/${composableName}.ts`,
          ),
        );
      } catch (e) {
        console.error(e);
        return transformedCode;
      }

      const description = astJson?.functions[composableName]?.summary || "";
      const returnType = astJson?.functions[composableName]?.returnType || "";

      // Building meta data
      // Only category
      const category =
        astJson?.functions[composableName]?.docs?.category ||
        astJson?.functions[`${composableName}Function`]?.docs?.category;

      if (category) {
        transformedCode = transformedCode.replace(
          "{{META}}",
          `<div>Category:</div> <a href="${mountPoint}/packages/composables/#${normalizeAnchorText(category)}"><div class="bg-red">${category}</div></a>`,
        );
      }

      // Building interfaces block

      let interfacesBlock = "";
      for (const key of Object.keys(astJson.functions)) {
        interfacesBlock += getWrappedCodeBlock(
          normalizeString(`${astJson?.functions[key]?.signature || ""}`),
        );

        interfacesBlock += prepareGithubPermalink({
          label: "source code",
          path: `${relativeDir}/${composableName}/${composableName}.ts`,
          project: "shopware/frontends",
          line: astJson?.functions[key]?.location?.line + 1,
        });
      }

      // Building types block
      let typesBlock = "";
      for (const key of Object.keys(astJson.types)) {
        typesBlock += getWrappedCodeBlock(
          normalizeString(`${astJson?.types[key]?.signature || ""}`),
        );

        typesBlock += prepareGithubPermalink({
          label: "source code",
          path: `${relativeDir}/${composableName}/${composableName}.ts`,
          project: "shopware/frontends",
          line: astJson?.types[key]?.location?.line + 1,
        });
      }

      transformedCode = transformedCode
        .replace("{{DESCRIPTION}}", description)
        .replace("{{RETURN_TYPES_CONTENT}}", typesBlock)
        .replace("{{INTERFACE_CONTENT}}", interfacesBlock);

      // Loading additional MD file
      try {
        const additionalMd = readFileSync(
          resolve(
            `${projectRootDir}/${relativeDir}/${composableName}/${composableName}.md`,
          ),
          "utf8",
        );
        transformedCode = transformedCode.replace(
          "{{ADDITIONAL_README}}",
          additionalMd,
        );
      } catch (e) {
        transformedCode = transformedCode.replace("{{ADDITIONAL_README}}", "");
      }

      // Demo static
      try {
        const codeBlock = readFileSync(
          resolve(
            `${projectRootDir}/${relativeDir}/${composableName}/${composableName}.demo.vue`,
          ),
          "utf8",
        );

        transformedCode = transformedCode.replace(
          "{{DEMO_BLOCK}}",
          `
## Demo
\`\`\`vue
${codeBlock}
\`\`\`
          `,
        );
      } catch (e) {
        transformedCode = transformedCode.replace("{{DEMO_BLOCK}}", "");
      }
      return transformedCode;
    },
  };
}
