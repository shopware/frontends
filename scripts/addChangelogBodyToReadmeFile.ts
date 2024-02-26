import path from "path";
import parseChangelog from "changelog-parser";
import fs from "fs/promises";

/**
 * This script adds the latest changelog entry to the README.md file of each package.
 */

export const packagesDir = path.join(__dirname, "..", "packages");

const CHANGELOG_SEPARATOR_LINE = "<!-- AUTO GENERATED CHANGELOG -->";
const CHANGELOG_FILENAME = "CHANGELOG.md";

export async function getAllPackageNames() {
  const dir = await fs.readdir(packagesDir, { withFileTypes: true });
  return dir
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export async function addChangelogBodyToReadmeFile(packageName: string) {
  const packagePath = path.join(__dirname, "..", "packages", packageName);

  // changelog from package
  try {
    await fs.access(path.join(packagePath, CHANGELOG_FILENAME));

    const parsed = await parseChangelog(
      path.join(packagePath, CHANGELOG_FILENAME),
    );

    const lastPackageReadmeFile = await fs.readFile(
      path.join(packagePath, "README.md"),
      "utf-8",
    );

    const contentWithoutChangelog = lastPackageReadmeFile.split(
      CHANGELOG_SEPARATOR_LINE,
    )[0];

    const toAdd = [
      CHANGELOG_SEPARATOR_LINE,
      "",
      "## Changelog",
      "",
      `Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/${packageName}/${CHANGELOG_FILENAME})`,
      "",
      `### Latest changes: ${parsed.versions[0].title}`,
      "",
      parsed.versions[0].body,
      "",
    ];

    const finalContent = contentWithoutChangelog + toAdd.join("\n");

    await fs.writeFile(path.join(packagePath, "README.md"), finalContent);

    console.log(`+ Changelog for package ${packageName} added.`);
  } catch (e) {
    console.log(`- Changelog for package ${packageName} omitted.`);
  }
}

async function run() {
  const packageNames = await getAllPackageNames();
  for (const packageName of packageNames) {
    await addChangelogBodyToReadmeFile(packageName);
  }
}

run();
