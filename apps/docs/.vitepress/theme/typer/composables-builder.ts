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
} from "./utils";
import { readdirSync, readFileSync } from "node:fs";

export async function ComposablesBuilder(): Promise<Plugin> {
  return {
    name: "composables-builder",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;

      const [pkg, type, fileName] = id.split("/").slice(-3);

      if (pkg !== "packages" || type !== "composables") {
        return code;
      }

      let astJson = "";

      try {
        astJson = extract(
          resolve(
            `../../packages/composables/src/${fileName.replace(".md", "")}/${fileName.replace("md", "ts")}`,
          ),
        );
      } catch (e) {
        console.error(e);
      }

      return `# ${fileName.replace(".md", "")} `;
    },
  };
}
