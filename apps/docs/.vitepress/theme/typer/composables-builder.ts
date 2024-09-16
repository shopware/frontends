// @ts-nocheck
import type { Plugin } from "vite";
import { resolve } from "path";
import { findSync } from "find-in-files";
import { extract } from "ts-dox";
import {
  getToggleContainer,
  getWrappedCodeBlock,
  prepareGithubPermalink,
  replacer,
  normalizeString,
  normalizeAnchorText,
} from "./utils";
import { readdirSync, readFileSync, existsSync } from "node:fs";

export async function ComposablesBuilder(): Promise<Plugin> {
  return {
    name: "composables-builder",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;

      const [pkg, type, fileName] = id.split("/").slice(-3);

      const composableName = fileName.replace(".md", "");

      if (pkg !== "packages" || type !== "composables") {
        return code;
      }

      if (composableName === "index") {
        code = code.replace(
          "{{INTRO}}",
          normalizeString(
            readFileSync(
              resolve(`../../packages/composables/README.md`),
              "utf8",
            ),
          ),
        );

        return code;
      }
      // Build name
      code = code.replace("{{NAME}}", composableName);

      let astJson = "";

      try {
        astJson = extract(
          resolve(
            `../../packages/composables/src/${composableName}/${composableName}.ts`,
          ),
        );
      } catch (e) {
        return code;
      }

      const description = astJson?.functions[composableName]?.summary || "";
      const returnType = astJson?.functions[composableName]?.returnType || "";

      // Building meta data
      // Only category
      const category =
        astJson?.functions[composableName]?.docs?.category ||
        astJson?.functions[`${composableName}Function`]?.docs?.category;

      if (category) {
        code = code.replace(
          "{{META}}",
          `<div>Category:</div> <a href="/packages/composables/#${normalizeAnchorText(category)}"><div class="bg-red">${category}</div></a>`,
        );
      }

      // Building interfaces block

      let interfacesBlock = ``;
      for (const key of Object.keys(astJson.functions)) {
        interfacesBlock += getWrappedCodeBlock(
          normalizeString(`${astJson?.functions[key]?.signature || ""}`),
        );

        interfacesBlock += prepareGithubPermalink({
          label: `source code`,
          path: `packages/composables/src/${composableName}/${composableName}.ts`,
          project: "shopware/frontends",
          line: astJson?.functions[key]?.location?.line + 1,
        });
      }

      // Building types block
      let typesBlock = ``;
      for (const key of Object.keys(astJson.types)) {
        typesBlock += getWrappedCodeBlock(
          normalizeString(`${astJson?.types[key]?.signature || ""}`),
        );

        typesBlock += prepareGithubPermalink({
          label: `source code`,
          path: `packages/composables/src/${composableName}/${composableName}.ts`,
          project: "shopware/frontends",
          line: astJson?.types[key]?.location?.line + 1,
        });
      }

      code = code
        .replace("{{DESCRIPTION}}", description)
        .replace("{{RETURN_TYPES_CONTENT}}", typesBlock)
        .replace("{{INTERFACE_CONTENT}}", interfacesBlock);

      // Loading additional MD file
      try {
        const additionalMd = readFileSync(
          resolve(
            `../../packages/composables/src/${composableName}/${composableName}.md`,
          ),
          "utf8",
        );
        code = code.replace("{{ADDITIONAL_README}}", additionalMd);
      } catch (e) {
        code = code.replace("{{ADDITIONAL_README}}", "");
      }

      // Demo static
      try {
        const codeBlock = readFileSync(
          resolve(
            `../../packages/composables/src/${composableName}/${composableName}.demo.vue`,
          ),
          "utf8",
        );

        code = code.replace(
          "{{DEMO_BLOCK}}",
          `
## Demo
\`\`\`vue
${codeBlock}
\`\`\`
          `,
        );
      } catch (e) {
        code = code.replace("{{DEMO_BLOCK}}", "");
      }
      return code;
    },
  };
}
