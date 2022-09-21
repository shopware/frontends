import { join, resolve } from "path";
import type { Plugin } from "vite";
import fs from "fs-extra";
import {
  getTypeDefinition,
  isTypeDefinitionExists,
  replacer,
} from "../../../../scripts/utils";

export function MarkdownTransform(): Plugin {
  return {
    name: "vueuse-md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;

      const [pkg, fileName] = id.split("/").slice(-2);
      const composableName = fileName.replace(/\.md$/, "");

      // If we don't have a type definition, skip
      if (!isTypeDefinitionExists(pkg, composableName)) return null;

      const frontmatterEnds = code.indexOf("---\n\n") + 4;
      const firstSubheader = code.search(/\n## \w/);
      const sliceIndex = firstSubheader < 0 ? frontmatterEnds : firstSubheader;

      const { footer } = await getFunctionMarkdown(pkg, composableName);

      code = replacer(code, footer, "FOOTER", "tail");

      return code;
    },
  };
}

const DIR_SRC = resolve(__dirname, "../..");

export async function getFunctionMarkdown(pkg: string, name: string) {
  const hasDemo = fs.existsSync(join(DIR_SRC, pkg, name, "demo.vue"));
  const types = await getTypeDefinition(pkg, name);

  let typingSection = "";

  if (types) {
    const code = `\`\`\`typescript\n${types.trim()}\n\`\`\``;
    typingSection = `
\n
## Type Declarations

:::warning
Composable types are in an early stage, public API may change in the future. Please check here regularly for updates.
:::
\n
    `;
    typingSection +=
      types.length > 1000
        ? `
<details>
<summary op50 italic>Show Type Declarations</summary>

${code}

</details>
`
        : `\n\n${code}`;
  }

  const footer = `${typingSection}\n\n`;

  return {
    footer,
  };
}
