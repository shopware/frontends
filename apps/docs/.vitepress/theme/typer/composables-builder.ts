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
        console.error(e);
        return code;
      }

      const description = astJson?.functions[composableName]?.summary || "";
      const returnType = astJson?.functions[composableName]?.returnType || "";

      // Building meta data
      // Only category
      if (astJson?.functions[composableName]?.docs?.category) {
        const conmposableCategory =
          astJson.functions[composableName].docs.category;
        code = code.replace(
          "{{META}}",
          `<div>Category:</div> <a href="/packages/composables/?category=${conmposableCategory}"><div class="bg-red">${conmposableCategory}</div></a>`,
        );
      }

      // Building interfaces block
      let interfacesBlock = `// packages/composables/src/${composableName}/${composableName}.ts`;
      for (const key of Object.keys(astJson.functions)) {
        interfacesBlock = `${interfacesBlock} \n\n ${astJson?.functions[key]?.signature || ""}`;
      }

      // Building types block
      let typesBlock = `// packages/composables/src/${composableName}/${composableName}.ts`;
      for (const key of Object.keys(astJson.types)) {
        typesBlock = `${typesBlock} \n\n ${astJson?.types[key]?.signature || ""}`;
      }

      code = code
        .replace("{{DESCRIPTION}}", description)
        .replace(
          "{{RETURN_TYPES_CONTENT}}",
          getWrappedCodeBlock(normalizeString(typesBlock)),
        )
        .replace(
          "{{INTERFACE_CONTENT}}",
          getWrappedCodeBlock(normalizeString(interfacesBlock)),
        );

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
        console.error(e);
        code = code.replace("{{ADDITIONAL_README}}", "");
      }

      //       // Demo dynamic
      //       try {
      //         const demoPath = resolve(
      //           `../../packages/composables/src/${composableName}/${composableName}.demo.vue`,
      //         );
      //         const demoExists = existsSync(demoPath);
      //         if (demoExists) {
      //           code = code.replace(
      //             "{{DEMO_BLOCK}}",
      //             `<script setup>
      // import { defineAsyncComponent } from 'vue'
      // const Demo = defineAsyncComponent(() => import('${demoPath}'))
      // </script>

      // ## Demo
      // <DemoBlock>
      // <CreateContext />
      // <Demo />
      // </DemoBlock>`,
      //           );
      //         }
      //       } catch (e) {
      //         console.error(e);
      //         code = code.replace("{{DEMO_BLOCK}}", "");
      //       }

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
        console.error(e);
        code = code.replace("{{DEMO_BLOCK}}", "");
      }
      return code;
    },
  };
}