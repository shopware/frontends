// @ts-nocheck
import type { Plugin } from "vite";
import { resolve } from "path";
import { readFileSync, existsSync } from "node:fs";

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

        if (!existsSync(filePath)) {
          throw new Error(`File ${filePath} does not exist`);
        }

        const content = readFileSync(filePath, "utf-8");
        code = code.replace(pattern, content);
      }

      return code;
    },
  };
}
