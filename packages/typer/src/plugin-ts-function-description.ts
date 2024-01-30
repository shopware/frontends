import type { Plugin } from "vite";
import { resolve } from "path";
import { existsSync } from "fs-extra";
import { normalizeString, replacer } from ".";
import { DeclarationReflection } from "typedoc";

function isFunctionDeprecated(fn: DeclarationReflection): boolean {
  return !!fn.signatures?.some((signature) =>
    signature.comment?.blockTags?.some((tag) => tag.tag === "@deprecated"),
  );
}

function getDeprecationMessage(fn: DeclarationReflection): string {
  const tag = fn.signatures
    ?.map((signature) => signature.comment?.blockTags)
    .flat()
    .find((tag) => tag?.tag === "@deprecated");
  return tag?.content?.find((c) => c.kind == "text")?.text || "";
}

export function TableOfFunctions(): Plugin {
  return {
    name: "vueuse-md-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null;
      const [pkg, fileName] = id.split("/").slice(-2);
      const composableName = fileName.replace(/\.md$/, "");

      if (pkg !== "packages") {
        return code;
      }

      if (
        !existsSync(resolve(`../../packages/${composableName}/src/index.ts`))
      ) {
        return code;
      }

      const TypeDoc = await import("typedoc");
      if (!TypeDoc) {
        return code;
      }

      const app = await TypeDoc.Application.bootstrap(
        {
          basePath: "../../",
          entryPoints: [
            resolve(`../../packages/${composableName}/src/index.ts`),
          ],
          tsconfig: resolve(`../../packages/${composableName}/tsconfig.json`),
          categoryOrder: ["*", "Endpoints", "Other"],
          exclude: [
            "**/*+(.test|.spec|.e2e).ts",
            "**/node_modules/**",
            "**/types/**",
            "**/cms/**",
            "**/internal/**",
          ],
          blockTags: ["@public", "@deprecated"],
        },
        [new TypeDoc.TSConfigReader()],
      );

      const project = await app.convert();

      if (!project) {
        return code;
      }

      const description = "\n";
      // get functions from the project only with "isPublic" flag (@public)
      const functions = project.children?.filter((fn) => fn.flags?.isPublic);
      const categories = project?.categories || [];

      let table = "";
      for (const category of categories) {
        table += `
## ${category.title} \n\n
| name        |      description     |
| ------------- | ------------ |\n`;

        for (const child of category.children) {
          let hasNoLinkLabel = false;

          const functionFound = functions?.find((fn) => fn.id === child.id);
          if (functionFound) {
            hasNoLinkLabel =
              !!functionFound?.signatures?.[0]?.comment?.blockTags.find(
                ({ tag }) => tag === "@nolink",
              );

            const summary =
              functionFound.signatures
                ?.find((signature) => signature?.comment?.summary)
                ?.comment?.summary?.find((summary) => summary.kind === "text")
                ?.text || "";

            const description = isFunctionDeprecated(functionFound)
              ? getDeprecationMessage(functionFound)
              : normalizeString(
                  summary.replace(/(\r\n|\n|\r|Returns|Options\ \-)/gm, ""),
                );
            const functionName = hasNoLinkLabel
              ? functionFound.name
              : `[${functionFound.name}](./${composableName}/${functionFound.name})`;
            table += `| ${functionName} ${
              isFunctionDeprecated(functionFound) ? "`deprecated`" : ""
            }| ${description} |\n`;
          }
        }
      }

      code = replacer(code, `${description + table}\n`, "API", "tail");
      return code;
    },
  };
}
