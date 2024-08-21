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
import { readdirSync, readFileSync } from "node:fs";

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
      const apiBlock = astJson?.types[returnType]?.signature
        ? getWrappedCodeBlock(
            normalizeString(astJson?.types[returnType].signature),
          )
        : "";

      code = code
        .replace("{{DESCRIPTION}}", description)
        .replace("{{API_CONTENT}}", apiBlock);

      console.log("astJson", astJson);

      return code;
    },
  };
}
