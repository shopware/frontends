import * as fs from "node:fs";
import * as path from "node:path";

import {
  cacheableReadRoutes,
  postOnlyReads,
} from "../packages/composables/src/useCacheableRead/routes";

/**
 * Fails when code calls a cacheable Store API read outside `invokeRead`, or
 * branches on the `cacheableReads` flag. Next.js templates have no
 * `invokeRead`, so there it fails when a cacheable read is called with POST
 * instead of its GET twin.
 *
 * This is a root script, not a package test, so it runs on every PR. Turbo
 * only runs a package's tests when that package or a dependency changed, so
 * a template-only PR would never run a test that scans the templates.
 */

const rootDir = path.resolve(__dirname, "..");

type Template = { id: string; framework: string; supportLevel: string };

const manifest: { templates: Template[] } = JSON.parse(
  fs.readFileSync(path.join(rootDir, "templates/manifest.json"), "utf8"),
);

const isNext = (template: Template) => template.framework === "next";

// deprecated templates, like vue-demo-store (#2667), are out of scope
function templateDirs(include: (template: Template) => boolean): string[] {
  return manifest.templates
    .filter((template) => template.supportLevel !== "deprecated")
    .filter(include)
    .map((template) => `templates/${template.id}`);
}

const invokeReadDirs = [
  "packages/composables/src",
  "packages/cms-base-layer/app",
  ...templateDirs((template) => !isNext(template)),
];

const nextDirs = templateDirs(isNext);

// tests, generated types, the helper itself and the files that define the flag
const skippedFiles =
  /\.(test|spec)\.ts$|\.d\.ts$|useCacheableRead[/\\]|createShopwareContext\.ts$|useShopwareContext\.ts$/;

const skippedDirs = new Set([
  "node_modules",
  ".nuxt",
  ".next",
  ".output",
  "dist",
]);

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return skippedDirs.has(entry.name) ? [] : sourceFiles(file);
    }
    return /\.(tsx?|vue|astro)$/.test(file) && !skippedFiles.test(file)
      ? [file]
      : [];
  });
}

const getTwin = (post: string) => post.replace(/^(\w+) post /, "$1Get get ");

// no GET twin may be called directly, because that sends GET for every session
const twinKeys = [
  ...Object.keys(cacheableReadRoutes),
  ...Object.keys(postOnlyReads),
].map(getTwin);

// a registered POST read must go through invokeRead
const forbiddenKeys = [...Object.keys(cacheableReadRoutes), ...twinKeys];

const isServerFile = (file: string) => /[/\\]server[/\\]/.test(file);

const quotes = ['"', "'", "`"];

const quotedKeys = (source: string, keys: string[]) =>
  keys.filter((key) =>
    quotes.some((quote) => source.includes(quote + key + quote)),
  );

function readSource(file: string): string {
  return (
    fs
      .readFileSync(file, "utf8")
      // drop comment lines, so commented-out code does not count
      .replace(/^\s*(\/\/|\/\*|\*).*$/gm, "")
  );
}

function scan(
  dirs: string[],
  findKeys: (source: string, file: string) => string[],
): string[] {
  return dirs
    .flatMap((dir) => sourceFiles(path.join(rootDir, dir)))
    .flatMap((file) =>
      findKeys(readSource(file), file).map(
        (key) => `${path.relative(rootDir, file)}: ${key}`,
      ),
    );
}

function findBypasses(source: string, file: string): string[] {
  const rest = source.replace(
    /(invokeRead\(|operations\[)\s*["'`][^"'`]+["'`]/g,
    "",
  );
  const bypasses = quotedKeys(
    rest,
    isServerFile(file) ? twinKeys : forbiddenKeys,
  );
  // a read of the flag, not the `cacheableReads: true` setting
  if (/\bcacheableReads\b(?!\s*\??:)/.test(source)) {
    bypasses.push("cacheableReads");
  }
  return bypasses;
}

const bypasses = scan(invokeReadDirs, findBypasses);

const nextPostReads = scan(nextDirs, (source) =>
  quotedKeys(source, Object.keys(cacheableReadRoutes)),
);

if (bypasses.length) {
  console.error("Cacheable reads called outside invokeRead:\n");
  for (const bypass of bypasses) {
    console.error(`  - ${bypass}`);
  }
  console.error(
    "\nRegister the route in cacheableReadRoutes. Call invokeRead with its POST operation. Never branch on cacheableReads.\n",
  );
}

if (nextPostReads.length) {
  console.error("Next.js templates calling a cacheable read with POST:\n");
  for (const postRead of nextPostReads) {
    console.error(`  - ${postRead}`);
  }
  console.error("\nCall the GET twin of the read instead.\n");
}

if (bypasses.length || nextPostReads.length) {
  process.exit(1);
}

console.log(
  `Every cacheable read goes through invokeRead (${invokeReadDirs.length} dirs scanned) or its GET twin (${nextDirs.length} Next.js dirs scanned).`,
);
