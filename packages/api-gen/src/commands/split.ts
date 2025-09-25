import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { bundle, lint, loadConfig } from "@redocly/openapi-core";
import { format } from "prettier";
import {
  createNewSchema,
  filterPathsByTag,
  getTags,
  getTagsFromPath,
  getUniquePaths,
  getUsedComponents,
  removeUnusedComponents,
} from "../utils/schemaSplitter";

export type SplitOptions = {
  outputDir?: string;
  schemaFile: string;
  filterBy?: string;
  splitBy?: "tags" | "paths";
  verboseLinting?: boolean;
  list?: "tags" | "paths";
};

export async function split(options: SplitOptions): Promise<void> {
  const { outputDir, schemaFile, filterBy, splitBy, verboseLinting, list } =
    options;

  if (!schemaFile) {
    throw new Error(`Schema file not found: ${schemaFile}`);
  }

  const finalSplitBy = splitBy || "tags";

  const config = await loadConfig({
    // TODO: add config if needed
  });

  const document = await bundle({
    ref: schemaFile,
    config,
    dereference: false,
  });

  const problems = await lint({
    ref: schemaFile,
    config,
  });

  const errors = problems.filter((p) => p.severity === "error");
  const warnings = problems.filter((p) => p.severity === "warn");

  if (errors.length > 0 || warnings.length > 0) {
    console.error(
      `Schema has ${errors.length} errors and ${warnings.length} warnings.\n`,
    );
    if (verboseLinting) {
      console.error("Details:", problems);
    }
  }

  const paths = getUniquePaths(document.bundle.parsed);
  const tags = getTags(document.bundle.parsed);

  if (list) {
    if (list === "tags") {
      console.log(
        tags
          .map((t) => `"${t.name.toLowerCase()}"`)
          .sort()
          .join(", "),
      );
    } else if (list === "paths") {
      console.log(
        paths
          .map((p) => `"${p}"`)
          .sort()
          .join(", "),
      );
    } else {
      throw new Error(`Invalid list option: ${list}`);
    }
    return;
  }

  if (finalSplitBy !== "tags" && finalSplitBy !== "paths") {
    throw new Error(`Invalid splitBy option: ${finalSplitBy}`);
  }

  console.log(`Splitting by ${finalSplitBy}...`);

  if (finalSplitBy === "tags") {
    for (const tag of tags) {
      if (filterBy && tag.name.toLowerCase() !== filterBy.toLowerCase()) {
        continue;
      }

      const newSchema = createNewSchema(document.bundle.parsed);
      newSchema.paths = filterPathsByTag(document.bundle.parsed, tag.name);
      if (newSchema.info) {
        newSchema.info.title = `${newSchema.info.title} - ${tag.name}`;
      }
      newSchema.tags = [tag];

      const usedComponents = getUsedComponents(newSchema);
      const finalSchema = removeUnusedComponents(newSchema, usedComponents);

      const fileName = `${tag.name.replace(/ /g, "-")}.json`.toLowerCase();
      const outputPath = resolve(outputDir || "output", fileName);

      mkdirSync(outputDir || "output", { recursive: true });
      const formattedSchema = await format(
        JSON.stringify(finalSchema, null, 2),
        {
          parser: "json",
        },
      );
      writeFileSync(outputPath, formattedSchema);
      console.log(`Generated ${outputPath}`);
    }
  } else if (finalSplitBy === "paths") {
    for (const path of paths) {
      if (filterBy && path !== filterBy) {
        continue;
      }

      const newSchema = createNewSchema(document.bundle.parsed);
      newSchema.paths = {
        [path]: document.bundle.parsed.paths?.[path],
      };
      if (newSchema.info) {
        newSchema.info.title = `${newSchema.info.title} - ${path.replace(
          "/",
          "_",
        )}`;
      }
      newSchema.tags = getTagsFromPath(document.bundle.parsed, path);

      const usedComponents = getUsedComponents(newSchema);
      const finalSchema = removeUnusedComponents(newSchema, usedComponents);

      const fileName = `${path
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/^-/, "")}.json`.toLowerCase();
      const outputPath = resolve(outputDir || "output", fileName);

      mkdirSync(outputDir || "output", { recursive: true });
      const formatedSchema = await format(
        JSON.stringify(finalSchema, null, 2),
        {
          parser: "json",
        },
      );
      writeFileSync(outputPath, formatedSchema);
      console.log(`Generated ${outputPath}`);
    }
  }
}
