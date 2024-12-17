import { resolve } from "node:path";
import { findSync } from "find-in-files";
// @ts-nocheck
import type { Plugin } from "vite";

import { readFileSync, readdirSync } from "node:fs";
import {
  getToggleContainer,
  getWrappedCodeBlock,
  prepareGithubPermalink,
  replacer,
} from "./utils";

export async function CmsBaseReference({
  projectRootDir,
  relativeDir,
}: {
  projectRootDir: string;
  relativeDir: string;
}): Promise<Plugin> {
  return {
    name: "cms-base-reference-md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;
      const [pkg, fileName] = id.split("/").slice(-2);
      const packageName = fileName.replace(/\.md$/, "");

      let transformedCode = code;

      if (pkg !== "packages" || packageName !== "cms-base") {
        return transformedCode;
      }

      let API = "\n\n## Available components\n\n";

      const files = readdirSync(resolve(`${projectRootDir}/${relativeDir}`), {
        withFileTypes: true,
        recursive: true,
      });
      for (const component of files) {
        if (component.isDirectory() || !component.name.endsWith(".vue"))
          continue;

        API += `### \`${component.name.replace(".vue", "")}\`\n`;
        API += prepareGithubPermalink({
          label: "source code",
          path: `${component.path.split("frontends/").pop().replace("/vercel/path0/", "")}/${component.name}`,
          project: "shopware/frontends",
        });

        try {
          //try to load associated readme
          const readme = readFileSync(
            `${component.path}/${component.name.replace(".vue", ".md")}`,
            "utf8",
          );
          if (readme) {
            // API += "\n\n";
            API += `\n${readme.toString()}\n`;
          }
        } catch (error) {}

        API += "\n\n---\n";
      }
      API += "\n\n";

      // place it before the changelog
      transformedCode = replacer(transformedCode, API, "", "tail");

      return transformedCode;
    },
  };
}
