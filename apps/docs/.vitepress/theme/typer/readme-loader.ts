import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
// @ts-nocheck
import type { Plugin } from "vite";
import { prepareGithubPermalink } from "./utils";

/**
 * Transforms relative links (./path) in markdown content to full GitHub URLs.
 * This is needed because when README files are loaded into VitePress,
 * relative links would otherwise be resolved in the VitePress docs context
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

export async function ReadmeLoader(): Promise<Plugin> {
  return {
    name: "readme-loader-md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;

      let transformedCode = code;

      const pattern = /<!--\s*load:\s*([^ ]+)\s*-->/;

      const match = transformedCode.match(pattern);
      if (match) {
        const path = match[1];

        const filePath = resolve(__dirname, path);

        if (!existsSync(filePath) || !filePath.endsWith(".md")) {
          throw new Error(
            `File ${filePath} does not exist or it's not a markdown file.`,
          );
        }

        let fileContent = readFileSync(filePath, "utf-8");

        // Transform relative links to GitHub URLs
        fileContent = transformRelativeLinksToGithub(fileContent, path);

        const content = `\n:::\n${fileContent}\n\n---\n\n:::info Auto-generated\nThis page is generated from an external markdown file. \nIn case of any issues or dead links, please \n${prepareGithubPermalink(
          {
            path,
            label: "visit the source file.",
            project: "shopware/frontends",
            inlineStyle: "",
          },
        )}\n\n`;

        transformedCode = transformedCode.replace(pattern, content);
        // for LLM training
        transformedCode +=
          '\n<div data-placeholder="dynamic-markdown"></div>\n';
      }

      return transformedCode;
    },
  };
}
