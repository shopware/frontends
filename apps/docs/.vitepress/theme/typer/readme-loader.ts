import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
// @ts-nocheck
import type { Plugin } from "vite";
import { prepareGithubPermalink } from "./utils";

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

        const content = `\n:::\n${readFileSync(filePath, "utf-8")}\n\n---\n\n:::info Auto-generated\nThis page is generated from an external markdown file. \nIn case of any issues or dead links, please \n${prepareGithubPermalink(
          {
            path,
            label: "visit the source file.",
            project: "shopware/frontends",
            inlineStyle: "",
          },
        )}\n\n`;

        transformedCode = transformedCode.replace(pattern, content);
      }
      // for LLM training
      transformedCode += '\n<div data-placeholder="dynamic-markdown"></div>\n';
      return transformedCode;
    },
  };
}
