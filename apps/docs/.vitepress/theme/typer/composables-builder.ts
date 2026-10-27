import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { extract } from "ts-dox";

import {
  DYNAMIC_MARKDOWN_PLACEHOLDER,
  getWrappedCodeBlock,
  normalizeAnchorText,
  normalizeString,
  prepareGithubPermalink,
} from "./utils";

const INTRO_REGION = /<!--\s*dump:intro\s*-->[\s\S]*?<!--\s*\/dump:intro\s*-->/;

export async function transformComposablesBuilder(
  sourceCode: string,
  id: string,
  context: {
    projectRootDir: string;
    relativeDir: string;
    mountPoint: string;
  },
): Promise<string> {
  if (!id.match(/\.md\b/)) return sourceCode;

  const { projectRootDir, relativeDir, mountPoint } = context;
  let transformedCode = sourceCode;
  const [pkg, type, fileName] = id.split("/").slice(-3);

  const composableName = fileName.replace(".md", "");

  if (pkg !== "packages" || type !== "composables") {
    return transformedCode;
  }

  if (composableName === "index") {
    const readme = normalizeString(
      readFileSync(
        resolve(`${projectRootDir}/${relativeDir}/../README.md`),
        "utf8",
      ),
    );
    const wrapped = `<!-- dump:intro -->\n${readme}\n<!-- /dump:intro -->`;
    transformedCode = INTRO_REGION.test(transformedCode)
      ? transformedCode.replace(INTRO_REGION, wrapped)
      : transformedCode.replace("{{INTRO}}", wrapped);

    return transformedCode;
  }
  // Build name
  transformedCode = transformedCode.replace("{{NAME}}", composableName);

  let astJson: ReturnType<typeof extract>;

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
  } catch {
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
  } catch {
    transformedCode = transformedCode.replace("{{DEMO_BLOCK}}", "");
  }
  // for LLM training
  transformedCode += DYNAMIC_MARKDOWN_PLACEHOLDER;

  return transformedCode;
}
