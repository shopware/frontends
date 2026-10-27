import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  DYNAMIC_MARKDOWN_PLACEHOLDER,
  prepareGithubPermalink,
  stripTrailingDynamicPlaceholder,
} from "./utils";

const LOAD_REGION = /<!--\s*load:\s*([^ ]+)\s*-->[\s\S]*?<!--\s*\/load\s*-->/;
const LOAD_BARE = /<!--\s*load:\s*([^ ]+)\s*-->/;

/**
 * Transforms relative links (./path) in markdown content to full GitHub URLs.
 * This is needed because when README files are loaded into docs pages,
 * relative links would otherwise be resolved in the docs context
 * instead of pointing to the original package location.
 */
function transformRelativeLinksToGithub(
  content: string,
  sourceFilePath: string,
): string {
  // Get the directory of the source file relative to repo root
  // sourceFilePath is like "../../../../../examples/amazon-pay-button-example/README.md"
  const normalizedPath = sourceFilePath.replaceAll("../", "");
  const sourceDir = dirname(normalizedPath);

  const githubBaseUrl = "https://github.com/shopware/frontends/blob/main";

  // Transform markdown-style links: [text](./path)
  let result = content.replace(
    /\[([^\]]*)\]\(\.\/([^)]+)\)/g,
    (_, text, relativePath) => {
      return `[${text}](${githubBaseUrl}/${sourceDir}/${relativePath})`;
    },
  );

  // Transform HTML-style links: href="./path" or href='./path'
  result = result.replace(
    /href=(["'])\.\/([^"']+)\1/g,
    (_, quote, relativePath) => {
      return `href=${quote}${githubBaseUrl}/${sourceDir}/${relativePath}${quote}`;
    },
  );

  return result;
}

export async function transformReadmeLoader(
  code: string,
  id: string,
  context: { readmeLoaderDir: string },
): Promise<string> {
  if (!id.match(/\.md\b/)) return code;

  const regionMatch = code.match(LOAD_REGION);
  const bareMatch = regionMatch ? null : code.match(LOAD_BARE);
  const match = regionMatch ?? bareMatch;
  if (!match) return code;

  const loadPath = match[1];
  const pattern = regionMatch ? LOAD_REGION : LOAD_BARE;
  let transformedCode = stripTrailingDynamicPlaceholder(code);

  const filePath = resolve(context.readmeLoaderDir, loadPath);

  if (!existsSync(filePath) || !filePath.endsWith(".md")) {
    throw new Error(
      `File ${filePath} does not exist or it's not a markdown file.`,
    );
  }

  let fileContent = readFileSync(filePath, "utf-8");

  // Transform relative links to GitHub URLs
  fileContent = transformRelativeLinksToGithub(fileContent, loadPath);

  const content = `\n:::\n${fileContent}\n\n---\n\n:::info Auto-generated\nThis page is generated from an external markdown file. \nIn case of any issues or dead links, please \n${prepareGithubPermalink(
    {
      path: loadPath,
      label: "visit the source file.",
      project: "shopware/frontends",
      inlineStyle: "",
    },
  )}\n\n`;

  // Keep the load directive so a later dump can replace this region.
  transformedCode = transformedCode.replace(
    pattern,
    `<!-- load: ${loadPath} -->${content}<!-- /load -->`,
  );
  // for LLM training
  transformedCode += DYNAMIC_MARKDOWN_PLACEHOLDER;

  return transformedCode;
}
