import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { transformCmsBaseReference } from "../.vitepress/theme/typer/cms-base-plugin";
import { transformComposablesBuilder } from "../.vitepress/theme/typer/composables-builder";
import { transformReadmeBasedReference } from "../.vitepress/theme/typer/plugin";
import { transformReadmeLoader } from "../.vitepress/theme/typer/readme-loader";

const repoRoot = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../../..",
);
const docsSrc = resolve(repoRoot, "apps/docs/src");
const readmeLoaderDir = resolve(repoRoot, "apps/docs/.vitepress/theme/typer");
const projectRootDir = repoRoot;
const mountPoint = "/frontends";
const composableTemplateRel = "packages/composables/[composable].md";

const API_MARKER = "<!-- API -->";

function toId(filePath: string): string {
  return filePath.split(sep).join("/");
}

function recoverPackageTemplate(source: string): string {
  const index = source.indexOf(API_MARKER);
  if (index === -1) return source;
  return source.slice(0, index).trimEnd();
}

function prepareSource(rel: string, source: string): string {
  const match = /^packages\/([^/]+)\.md$/.exec(rel);
  if (!match || match[1] === "composables") return source;
  const readme = resolve(projectRootDir, "packages", match[1], "README.md");
  if (!existsSync(readme)) return source;
  return recoverPackageTemplate(source);
}

async function applyTransforms(code: string, id: string): Promise<string> {
  let next = code;
  next = await transformReadmeBasedReference(next, id, {
    projectRootDir,
    relativeDir: "packages",
  });
  next = await transformCmsBaseReference(next, id, {
    projectRootDir,
    relativeDir: "packages/cms-base-layer/app/components/public/cms",
  });
  next = await transformReadmeLoader(next, id, { readmeLoaderDir });
  next = await transformComposablesBuilder(next, id, {
    projectRootDir,
    relativeDir: "packages/composables/src",
    mountPoint,
  });
  return next;
}

function collectMarkdown(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdown(full));
    } else if (entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

function listComposables(): string[] {
  return readdirSync(resolve(projectRootDir, "packages/composables/src"), {
    withFileTypes: true,
  })
    .filter(
      (element) => element.isDirectory() && element.name.startsWith("use"),
    )
    .map((element) => element.name)
    .sort();
}

function isGeneratedComposablePage(rel: string): boolean {
  return /^packages\/composables\/use[^/]+\.md$/.test(rel);
}

const written: string[] = [];
const removed: string[] = [];

function writeIfChanged(filePath: string, content: string): void {
  if (existsSync(filePath) && readFileSync(filePath, "utf8") === content)
    return;
  writeFileSync(filePath, content);
  written.push(relative(repoRoot, filePath).split(sep).join("/"));
}

async function dumpFile(filePath: string): Promise<void> {
  const rel = relative(docsSrc, filePath).split(sep).join("/");
  if (rel === composableTemplateRel || isGeneratedComposablePage(rel)) return;

  const source = prepareSource(rel, readFileSync(filePath, "utf8"));
  try {
    const output = await applyTransforms(source, toId(filePath));
    writeIfChanged(filePath, output);
  } catch (error) {
    console.error(`docs:dump failed on ${rel}`);
    throw error;
  }
}

async function dumpComposablePages(names: string[]): Promise<void> {
  const template = readFileSync(
    resolve(docsSrc, composableTemplateRel),
    "utf8",
  );
  for (const name of names) {
    const outPath = resolve(docsSrc, "packages/composables", `${name}.md`);
    try {
      const output = await applyTransforms(template, toId(outPath));
      writeIfChanged(outPath, output);
    } catch (error) {
      console.error(`docs:dump failed on packages/composables/${name}.md`);
      throw error;
    }
  }
}

function removeStaleComposablePages(names: string[]): void {
  const expected = new Set(names);
  const composablesDocsDir = resolve(docsSrc, "packages/composables");
  for (const entry of readdirSync(composablesDocsDir)) {
    if (!/^use[^/]+\.md$/.test(entry)) continue;
    const name = entry.slice(0, -".md".length);
    if (expected.has(name)) continue;
    unlinkSync(resolve(composablesDocsDir, entry));
    removed.push(`apps/docs/src/packages/composables/${entry}`);
  }
}

async function main(): Promise<void> {
  // expCollector parses TypeScript only when cwd's package.json depends on
  // typescript. The repo root does not; the package workspaces do.
  process.chdir(resolve(repoRoot, "packages/composables"));

  for (const filePath of collectMarkdown(docsSrc)) {
    await dumpFile(filePath);
  }

  const names = listComposables();
  await dumpComposablePages(names);
  removeStaleComposablePages(names);

  if (written.length) {
    console.log(written.map((file) => `wrote ${file}`).join("\n"));
  }
  if (removed.length) {
    console.log(removed.map((file) => `removed ${file}`).join("\n"));
  }
  console.log(
    `docs:dump wrote ${written.length} files, removed ${removed.length} stale composable pages`,
  );
}

await main();
