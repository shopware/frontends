import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

import { transform } from "automd";

const rootDir = resolve(import.meta.dirname, "../../..");
const docsDir = join(rootDir, "apps/docs/src");
const sourceRoot = "examples/docs-code-examples";

const markdownFiles = await collectMarkdownFiles(docsDir);
const errors = [];

for (const file of markdownFiles) {
  const content = readFileSync(file, "utf8");
  ensureCodeFencesAreAutomdSourced(file, content);
  ensureAutomdSourcesExist(file, content);
  await ensureAutomdIsCurrent(file, content);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

async function collectMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
    } else if (entry.isFile() && extname(entry.name) === ".md") {
      files.push(fullPath);
    }
  }

  return files;
}

function ensureCodeFencesAreAutomdSourced(file, content) {
  const automdRanges = getAutomdRanges(content);
  const fencePattern = /^([ \t]*)```[^\n`]*$/gm;
  let match;

  while ((match = fencePattern.exec(content))) {
    if (
      !automdRanges.some(
        ([start, end]) => match.index >= start && match.index <= end,
      )
    ) {
      errors.push(
        `${relativePath(file)}:${lineNumber(content, match.index)} has an inline fenced code block. Move it to ${sourceRoot} and include it with automd:file.`,
      );
    }
  }
}

function ensureAutomdSourcesExist(file, content) {
  const automdFilePattern = /<!-- automd:file\s+([^>]*)-->/g;
  let match;

  while ((match = automdFilePattern.exec(content))) {
    const args = parseAutomdArgs(match[1]);
    if (!args.src?.startsWith(`${sourceRoot}/`)) {
      continue;
    }

    const fullPath = join(rootDir, args.src);
    if (!existsSync(fullPath)) {
      errors.push(
        `${relativePath(file)}:${lineNumber(content, match.index)} references missing source ${args.src}.`,
      );
      continue;
    }

    if (args.lines) {
      validateLineRange(
        file,
        content,
        match.index,
        args.src,
        fullPath,
        args.lines,
      );
    }
  }
}

async function ensureAutomdIsCurrent(file, content) {
  if (!content.includes("automd:")) {
    return;
  }

  const result = await transform(content, { dir: rootDir });
  if (result.hasIssues) {
    for (const update of result.updates) {
      for (const issue of update.result.issues ?? []) {
        errors.push(`${relativePath(file)}: ${issue}`);
      }
    }
  } else if (result.hasChanged) {
    errors.push(
      `${relativePath(file)} is not up to date. Run pnpm generateAutomd.`,
    );
  }
}

function validateLineRange(
  markdownFile,
  markdownContent,
  commentIndex,
  src,
  fullPath,
  lines,
) {
  const groups = /^(?<startLine>\d+)?:?(?<endLine>\d+)?$/.exec(lines)?.groups;
  if (!groups) {
    errors.push(
      `${relativePath(markdownFile)}:${lineNumber(markdownContent, commentIndex)} uses invalid lines="${lines}" for ${src}.`,
    );
    return;
  }

  const sourceLines = readFileSync(fullPath, "utf8").split("\n");
  const start = Number(groups.startLine) || 1;
  const end = Number(groups.endLine) || sourceLines.length;

  if (start < 1 || end < start || end > sourceLines.length) {
    errors.push(
      `${relativePath(markdownFile)}:${lineNumber(markdownContent, commentIndex)} uses out-of-range lines="${lines}" for ${src}.`,
    );
  }
}

function getAutomdRanges(content) {
  const ranges = [];
  const startPattern = /<!-- automd:[\s\S]*?-->/g;
  let match;

  while ((match = startPattern.exec(content))) {
    const end = content.indexOf("<!-- /automd -->", match.index);
    if (end >= 0) {
      ranges.push([match.index, end + "<!-- /automd -->".length]);
    }
  }

  return ranges;
}

function parseAutomdArgs(rawArgs) {
  const args = {};
  const argPattern = /(\w[\w-]*)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let match;

  while ((match = argPattern.exec(rawArgs))) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? true;
    args[key] = value;
  }

  return args;
}

function lineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

function relativePath(file) {
  return file.startsWith(rootDir) ? file.slice(rootDir.length + 1) : file;
}
