import * as fs from "node:fs";
import * as path from "node:path";

import { Ajv } from "ajv";
import semver from "semver";

/**
 * Fails when templates/manifest.json drifts from templates/ on disk, or from
 * its own schema.
 *
 * The template list used to live in five places that had already drifted apart.
 * The manifest is now the single source of truth, so this check exists to stop
 * it silently going stale the next time a template is added or removed.
 *
 * Not verified: supportLevel, deployable, devPort and env contents are human
 * judgements with no authority on disk.
 */

type Template = {
  id: string;
  packageName: string;
  framework: "nuxt" | "astro" | "vite";
  buildCommand: string;
  devCommand: string;
  node: string;
  docsUrl: string | null;
  issueUrl: string;
  scaffoldable: boolean;
  scaffoldCommand: string | null;
  devcontainer: boolean;
  typeGeneration: {
    env: Record<string, { description: string }>;
    loadSchemaCommand: string;
    script: string;
  } | null;
};

const rootDir = path.resolve(__dirname, "..");
const templatesDir = path.join(rootDir, "templates");
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

/** A JSON syntax error should name the file in the report, not crash as a stack trace. */
function readJson(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(
      `${path.relative(rootDir, filePath)} is not valid JSON: ${(error as Error).message}`,
    );
    return undefined;
  }
}

const manifest = readJson(manifestPath) as { templates: Template[] };
const schema = readJson(schemaPath);
if (!manifest || !schema) report();

// The schema is the definition. Validate against it rather than restating the
// rules here, so the two cannot drift apart. Ajv's default strict mode also
// rejects a typo'd keyword in the schema itself.
const ajv = new Ajv({ allErrors: true });
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
  const templateDir = path.join(templatesDir, template.id);
  const packageJsonPath = path.join(templateDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    // A missing directory is already reported above.
    if (fs.existsSync(templateDir)) {
      problems.push(`templates/${template.id}/ has no package.json`);
    }
    continue;
  }

  const packageJson = readJson(packageJsonPath) as {
    name?: string;
    scripts?: Record<string, string>;
    engines?: { node?: string };
  };
  if (!packageJson) continue;

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
    ["devCommand", "dev"],
  ];

  for (const [field, script] of mirrored) {
    if (scripts[script] !== template[field]) {
      problems.push(
        `"${template.id}" has ${field} "${template[field]}", but ${where} has "${script}": "${scripts[script] ?? "(missing)"}"`,
      );
    }
  }

  const engines = packageJson.engines?.node;
  if (engines !== template.node) {
    problems.push(
      `"${template.id}" has node "${template.node}", but ${where} has engines.node ${engines ? `"${engines}"` : "(missing)"}`,
    );
  }

  if (template.typeGeneration) {
    if (!scripts[template.typeGeneration.script]) {
      problems.push(
        `"${template.id}" has typeGeneration.script "${template.typeGeneration.script}", but ${where} has no such script`,
      );
    }
  } else if (scripts["generate-types"]) {
    problems.push(
      `"${template.id}" has typeGeneration null, but ${where} has a "generate-types" script`,
    );
  }

  // engines.node itself can lie: it must not admit versions the framework
  // rejects. Stricter than the framework is fine (dropping an EOL major).
  const frameworkPkgPath = path.join(
    templateDir,
    "node_modules",
    template.framework,
    "package.json",
  );
  if (!semver.validRange(template.node)) {
    problems.push(
      `"${template.id}" has node "${template.node}", which is not a valid semver range`,
    );
  } else if (fs.existsSync(frameworkPkgPath)) {
    const frameworkPkg = readJson(frameworkPkgPath) as {
      engines?: { node?: string };
    };
    const frameworkRange = frameworkPkg?.engines?.node;
    if (frameworkRange && !semver.subset(template.node, frameworkRange)) {
      problems.push(
        `"${template.id}" has node "${template.node}", which admits versions ${template.framework} rejects (its engines.node is "${frameworkRange}")`,
      );
    }
  } else {
    // A green result must mean the check ran, so a skip is a problem too.
    problems.push(
      `"${template.id}" node range could not be checked against ${template.framework}: run pnpm install first`,
    );
  }
}

// A docsUrl that 404s is worse than no docsUrl, so resolve each one back to the
// markdown file the docs site builds it from.
const DOCS_BASE = "https://developer.shopware.com/frontends/";
const docsRoot = path.resolve(rootDir, "apps", "docs", "src");

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

// Prefix-not-substring on the decoded title, or an id that is a prefix of
// another id (vue-starter-template-extended) slips through.
for (const template of manifest.templates) {
  const title = new URL(template.issueUrl).searchParams.get("title") ?? "";
  if (!title.startsWith(`[${template.id}]`)) {
    problems.push(
      `"${template.id}" has an issueUrl whose title is not prefixed with [${template.id}]: ${template.issueUrl}`,
    );
  }
}

// The lookahead stops templates/vue-starter-template from matching inside
// templates/vue-starter-template-extended.
for (const template of manifest.templates) {
  if (template.scaffoldable) {
    if (template.scaffoldCommand === null) {
      problems.push(
        `"${template.id}" is scaffoldable but has no scaffoldCommand`,
      );
    } else if (
      !new RegExp(`templates/${template.id}(?![a-z0-9-])`).test(
        template.scaffoldCommand,
      )
    ) {
      problems.push(
        `"${template.id}" has a scaffoldCommand that does not copy templates/${template.id}: ${template.scaffoldCommand}`,
      );
    }
  } else if (template.scaffoldCommand !== null) {
    problems.push(
      `"${template.id}" is not scaffoldable, so its scaffoldCommand must be null, not "${template.scaffoldCommand}"`,
    );
  }
}

const devcontainersDir = path.join(rootDir, ".devcontainer");
for (const template of manifest.templates) {
  const exists = fs.existsSync(
    path.join(devcontainersDir, template.id, "devcontainer.json"),
  );
  if (exists !== template.devcontainer) {
    problems.push(
      `"${template.id}" has devcontainer ${template.devcontainer}, but .devcontainer/${template.id}/devcontainer.json ${exists ? "exists" : "does not exist"}`,
    );
  }
}

if (fs.existsSync(devcontainersDir)) {
  for (const entry of fs.readdirSync(devcontainersDir, {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    // Shared config folders without a devcontainer.json are not containers.
    const isContainer = fs.existsSync(
      path.join(devcontainersDir, entry.name, "devcontainer.json"),
    );
    if (isContainer && !inManifest.includes(entry.name)) {
      problems.push(
        `.devcontainer/${entry.name}/ exists but "${entry.name}" is not a template in manifest.json`,
      );
    }
  }
}

report();

console.log(
  `templates/manifest.json matches templates/ and its schema (${onDisk.length} templates).`,
);
