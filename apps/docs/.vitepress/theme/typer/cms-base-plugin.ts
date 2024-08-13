// @ts-nocheck
import type { Plugin } from "vite";
import { resolve } from "path";
import { findSync } from "find-in-files";

import {
  getToggleContainer,
  getWrappedCodeBlock,
  prepareGithubPermalink,
  replacer,
} from "./utils";
import { readdirSync, readFileSync } from "node:fs";

export async function CmsBaseReference(): Promise<Plugin> {
  return {
    name: "cms-base-reference-md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;
      const [pkg, fileName] = id.split("/").slice(-2);
      const packageName = fileName.replace(/\.md$/, "");

      if (pkg !== "packages" || packageName !== "cms-base") {
        return code;
      }

      let API = "\n\n## Available components\n\n";

      const files = readdirSync(
        resolve("../../packages/cms-base/components/public/cms"),
        {
          withFileTypes: true,
          recursive: true,
        },
      );
      for (const component of files) {
        if (component.isDirectory() || !component.name.endsWith(".vue"))
          continue;

        API += `### \`${component.name.replace(".vue", "")}\`\n`;
        API += prepareGithubPermalink({
          label: `source code`,
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
      code = replacer(code, API, "", "tail");

      return code;
    },
  };
}
