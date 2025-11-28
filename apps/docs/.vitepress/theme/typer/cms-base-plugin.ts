import { resolve } from "node:path";
// @ts-nocheck
import type { Plugin } from "vite";

import { readFileSync, readdirSync } from "node:fs";
import { prepareGithubPermalink, replacer } from "./utils";

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

      if (pkg !== "packages" || packageName !== "cms-base-layer") {
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

        const componentPath =
          component.parentPath ||
          component.path ||
          resolve(`${projectRootDir}/${relativeDir}`);

        // Remove both /vercel/path0/ and extract path after frontends/
        let normalizedPath = componentPath.replace(/\/vercel\/path0\//g, "");
        const pathParts = normalizedPath.split("frontends/");
        normalizedPath =
          pathParts.length > 1
            ? pathParts.pop() || ""
            : normalizedPath.replace(projectRootDir, "").replace(/^\//, "");

        API += prepareGithubPermalink({
          label: "source code",
          path: `${normalizedPath}/${component.name}`,
          project: "shopware/frontends",
        });

        try {
          //try to load associated readme
          const readmePath =
            component.parentPath ||
            component.path ||
            resolve(`${projectRootDir}/${relativeDir}`);
          const readme = readFileSync(
            `${readmePath}/${component.name.replace(".vue", ".md")}`,
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
      // for LLM training
      transformedCode += '\n<div data-placeholder="dynamic-markdown"></div>\n';

      return transformedCode;
    },
  };
}
