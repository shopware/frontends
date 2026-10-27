import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

import {
  DYNAMIC_MARKDOWN_PLACEHOLDER,
  prepareGithubPermalink,
  replacer,
} from "./utils";

export async function transformCmsBaseReference(
  code: string,
  id: string,
  context: { projectRootDir: string; relativeDir: string },
): Promise<string> {
  if (!id.match(/\.md\b/)) return code;
  const { projectRootDir, relativeDir } = context;
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
    if (component.isDirectory() || !component.name.endsWith(".vue")) continue;

    API += `### \`${component.name.replace(".vue", "")}\`\n`;

    const componentPath =
      component.parentPath ||
      component.path ||
      resolve(`${projectRootDir}/${relativeDir}`);

    // DevHub mounts the repo at <cwd>/src/frontends/_source, so splitting on
    // "frontends/" leaves a "_source/" segment in the permalink. Derive the path
    // from projectRootDir instead, and keep the old heuristic as a fallback.
    const fromRoot = relative(projectRootDir, componentPath);
    const normalizedPath = (
      fromRoot && !fromRoot.startsWith("..")
        ? fromRoot
        : componentPath
            .replace(/\/vercel\/path0\//g, "")
            .split("frontends/")
            .pop() || ""
    )
      .replaceAll(sep, "/")
      .replace(/^_source\//, "");

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
        API += `\n${readme.toString()}\n`;
      }
    } catch {
      // A component without a sibling markdown file stays a heading and permalink.
    }

    API += "\n\n---\n";
  }
  API += "\n\n";

  // place it before the changelog
  transformedCode = replacer(transformedCode, API, "", "tail");
  // for LLM training
  transformedCode += DYNAMIC_MARKDOWN_PLACEHOLDER;

  return transformedCode;
}
