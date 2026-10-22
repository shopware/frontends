import * as fs from "node:fs";
import * as path from "node:path";

import {
  cacheableReadRoutes,
  postOnlyReads,
} from "../packages/composables/src/useCacheableRead/routes";

/**
 * Fails when code calls a cacheable Store API read outside `invokeRead`, or
 * branches on the `cacheableReads` flag.
 *
 * This is a root script, not a package test, so it runs on every PR. Turbo
 * only runs a package's tests when that package or a dependency changed, so
 * a template-only PR would never run a test that scans the templates.
 */

const rootDir = path.resolve(__dirname, "..");

const manifest: { templates: { id: string; supportLevel: string }[] } =
  JSON.parse(
    fs.readFileSync(path.join(rootDir, "templates/manifest.json"), "utf8"),
  );

// deprecated templates, like vue-demo-store (#2667), are out of scope
const scannedDirs = [
  "packages/composables/src",
  "packages/cms-base-layer/app",
  ...manifest.templates
    .filter((template) => template.supportLevel !== "deprecated")
    .map((template) => `templates/${template.id}`),
];

// tests, generated types, the helper itself and the files that define the flag
const skippedFiles =
  /\.(test|spec)\.ts$|\.d\.ts$|useCacheableRead[/\\]|createShopwareContext\.ts$|useShopwareContext\.ts$/;

const skippedDirs = new Set(["node_modules", ".nuxt", ".output", "dist"]);

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return skippedDirs.has(entry.name) ? [] : sourceFiles(file);
    }
    return /\.(ts|vue|astro)$/.test(file) && !skippedFiles.test(file)
      ? [file]
      : [];
  });
}

const getTwin = (post: string) => post.replace(/^(\w+) post /, "$1Get get ");

// a registered POST read must go through invokeRead; no GET twin may be called
// directly, because that sends GET for every session
const forbiddenKeys = [
  ...Object.keys(cacheableReadRoutes),
  ...[...Object.keys(cacheableReadRoutes), ...Object.keys(postOnlyReads)].map(
    getTwin,
  ),
];

const quotes = ['"', "'", "`"];

function findBypasses(source: string): string[] {
  const rest = source.replace(
    /(invokeRead\(|operations\[)\s*["'`][^"'`]+["'`]/g,
    "",
  );
  const bypasses = forbiddenKeys.filter((key) =>
    quotes.some((quote) => rest.includes(quote + key + quote)),
  );
  // a read of the flag, not the `cacheableReads: true` setting
  if (/\bcacheableReads\b(?!\s*\??:)/.test(source)) {
    bypasses.push("cacheableReads");
  }
  return bypasses;
}

const bypasses = scannedDirs
  .flatMap((dir) => sourceFiles(path.join(rootDir, dir)))
  .flatMap((file) => {
    const source = fs
      .readFileSync(file, "utf8")
      // drop comment lines, so commented-out code does not count
      .replace(/^\s*(\/\/|\/\*|\*).*$/gm, "");
    return findBypasses(source).map(
      (key) => `${path.relative(rootDir, file)}: ${key}`,
    );
  });

if (bypasses.length) {
  console.error("Cacheable reads called outside invokeRead:\n");
  for (const bypass of bypasses) {
    console.error(`  - ${bypass}`);
  }
  console.error(
    "\nRegister the route in cacheableReadRoutes. Call invokeRead with its POST operation. Never branch on cacheableReads.",
  );
  process.exit(1);
}

console.log(
  `Every cacheable read goes through invokeRead (${scannedDirs.length} dirs scanned).`,
);
