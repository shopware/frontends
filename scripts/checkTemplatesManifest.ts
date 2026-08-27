import * as fs from "node:fs";
import * as path from "node:path";

import { Ajv } from "ajv";

/**
 * Fails when templates/manifest.json drifts from templates/ on disk, or from
 * its own schema.
 *
 * The template list used to live in five places that had already drifted apart.
 * The manifest is now the single source of truth, so this check exists to stop
 * it silently going stale the next time a template is added or removed.
 */

type Template = {
  id: string;
  packageName: string;
  buildCommand: string;
  startCommand: string;
  docsUrl: string | null;
  issueUrl: string;
};

const templatesDir = path.join(__dirname, "..", "templates");
const manifestPath = path.join(templatesDir, "manifest.json");
const schemaPath = path.join(templatesDir, "manifest.schema.json");

const problems: string[] = [];

/** Print whatever has been collected and exit. Never returns when there is a problem. */
function report(): void {
  if (problems.length) {
    console.error("templates/manifest.json is out of sync:\n");
    for (const problem of problems) {
      console.error(`  - ${problem}`);
    }
    console.error(
      `\nUpdate templates/manifest.json so it matches templates/ on disk and templates/manifest.schema.json.`,
    );
    process.exit(1);
  }
}

const manifest: { templates: Template[] } = JSON.parse(
  fs.readFileSync(manifestPath, "utf8"),
);
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

// The schema is the definition. Validate against it rather than restating the
// rules here, so the two cannot drift apart.
const ajv = new Ajv({ allErrors: true, strict: false });
if (!ajv.validate(schema, manifest)) {
  for (const error of ajv.errors ?? []) {
    const where = error.instancePath || "/";
    problems.push(`${where} ${error.message}`);
  }
  // Everything below reads manifest.templates. If the schema rejected the file
  // there is no point guessing at a shape we already know is wrong, and doing so
  // would throw before these errors ever reach the reader.
  report();
}

const onDisk = fs
  .readdirSync(templatesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const inManifest = manifest.templates.map((template) => template.id).sort();

for (const id of onDisk) {
  if (!inManifest.includes(id)) {
    problems.push(
      `templates/${id}/ exists on disk but is missing from manifest.json`,
    );
  }
}

for (const id of inManifest) {
  if (!onDisk.includes(id)) {
    problems.push(
      `manifest.json lists "${id}" but templates/${id}/ does not exist`,
    );
  }
}

const reportedDuplicates: string[] = [];
for (const id of inManifest) {
  const isDuplicate = inManifest.indexOf(id) !== inManifest.lastIndexOf(id);
  if (isDuplicate && !reportedDuplicates.includes(id)) {
    reportedDuplicates.push(id);
    problems.push(`manifest.json lists "${id}" more than once`);
  }
}

// Everything below is copied from each template's package.json, so it goes stale
// silently the moment someone edits that file. A generator reading a stale
// buildCommand emits a command that does not work.
for (const template of manifest.templates) {
  const packageJsonPath = path.join(templatesDir, template.id, "package.json");
  if (!fs.existsSync(packageJsonPath)) continue;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const where = `templates/${template.id}/package.json`;

  // packageName is what workspace filters match on, and it does not always
  // equal the directory name, so a wrong value here breaks those filters.
  if (packageJson.name !== template.packageName) {
    problems.push(
      `"${template.id}" has packageName "${template.packageName}", but ${where} says "${packageJson.name}"`,
    );
  }

  const scripts: Record<string, string> = packageJson.scripts ?? {};
  const mirrored: Array<[keyof Template & string, string]> = [
    ["buildCommand", "build"],
    ["startCommand", "dev"],
  ];

  for (const [field, script] of mirrored) {
    if (scripts[script] !== template[field]) {
      problems.push(
        `"${template.id}" has ${field} "${template[field]}", but ${where} has "${script}": "${scripts[script] ?? "(missing)"}"`,
      );
    }
  }
}

// A docsUrl that 404s is worse than no docsUrl, so resolve each one back to the
// markdown file the docs site builds it from.
const DOCS_BASE = "https://developer.shopware.com/frontends/";
const docsRoot = path.resolve(__dirname, "..", "apps", "docs", "src");

for (const template of manifest.templates) {
  if (template.docsUrl === null) continue;

  const page = template.docsUrl.slice(DOCS_BASE.length).replace(/\.html$/, "");
  const source = path.resolve(docsRoot, `${page}.md`);

  // `page` comes from a URL, so `..` segments would otherwise let the lookup
  // wander outside the docs tree and find an unrelated file that happens to
  // exist, which would make this check pass on a broken link.
  if (!source.startsWith(docsRoot + path.sep)) {
    problems.push(
      `"${template.id}" has a docsUrl that resolves outside apps/docs/src/: ${template.docsUrl}`,
    );
    continue;
  }

  if (!fs.existsSync(source)) {
    problems.push(
      `"${template.id}" has docsUrl ${template.docsUrl}, but apps/docs/src/${page}.md does not exist`,
    );
  }
}

// Six near-identical URLs are easy to copy and forget to edit, and a wrong one
// files the report against the wrong template.
for (const template of manifest.templates) {
  if (!template.issueUrl.includes(encodeURIComponent(template.id))) {
    problems.push(
      `"${template.id}" has an issueUrl that does not mention its own id: ${template.issueUrl}`,
    );
  }
}

report();

console.log(
  `templates/manifest.json matches templates/ and its schema (${onDisk.length} templates).`,
);
