// @ts-nocheck
import type { Plugin } from "vite";
import { resolve } from "path";
import { readFileSync, existsSync } from "node:fs";
import { prepareGithubPermalink } from "./utils";

export async function ReadmeLoader(): Promise<Plugin> {
  return {
    name: "readme-loader-md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;

      const pattern = /<!--\s*load:\s*([^ ]+)\s*-->/;

      const match = code.match(pattern);
      if (match) {
        const path = match[1];

        const filePath = resolve(__dirname, path);

        if (!existsSync(filePath) || !filePath.endsWith(".md")) {
          throw new Error(
            `File ${filePath} does not exist or it's not a markdown file.`,
          );
        }

        let content =
          "\n:::\n" +
          readFileSync(filePath, "utf-8") +
          "\n\n---\n\n" +
          ":::info Auto-generated\n" +
          "This page is generated from an external markdown file. \nIn case of any issues or dead links, please \n" +
          prepareGithubPermalink({
            path,
            label: "visit the source file.",
            project: "shopware/frontends",
            inlineStyle: "",
          }) +
          "\n\n";

        code = code.replace(pattern, content);
      }

      return code;
    },
  };
}
