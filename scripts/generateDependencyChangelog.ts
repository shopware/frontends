import { getChangedFilesSince } from "@changesets/git";
import type { PackageJSON } from "@changesets/types";
import writeChangeset from "@changesets/write";
import { getPackages } from "@manypkg/get-packages";
import spawn from "spawndamnit";
import fs from "fs/promises";

const IGNORED_PACKAGE_PATTERNS = [
  // all in examples directory regex
  /examples\/.*/,
];

async function getJsonFileBaseVersion(
  filename: string,
  cwd: string,
): Promise<PackageJSON> {
  const { stdout, code } = await spawn("git", ["show", `main:./${filename}`], {
    cwd,
  });

  const packageJSON = JSON.parse(stdout.toString());
  return packageJSON;
}

async function getExistingDependencyChangesetsFiles(
  cwd: string,
  packageName: string,
): Promise<Record<string, string>> {
  // read all .md filenames from .changeset directory
  const dirFiles = await fs.readdir(`${cwd}/.changeset`, {
    withFileTypes: true,
  });
  const filenames = dirFiles
    .filter((dirent) => dirent.isFile() && dirent.name !== "README.md")
    .map((dirent) => dirent.name);

  // load all content to map
  const resultMap: Record<string, string> = {};
  for (const filename of filenames) {
    const content = await fs.readFile(`${cwd}/.changeset/${filename}`, "utf-8");

    // content needs to be for packageName: "vue-vite-blank": patch
    if (content.includes(`---\n"${packageName}": patch\n---\n`)) {
      // content needs to contain: "Dependency changes:\n"
      if (content.includes("Dependency changes:\n")) {
        resultMap[filename] = content;
      }
    }
  }
  return resultMap;
}

function createLineDescription(
  name: string,
  type: "dependency" | "peerDependency" | "devDependency",
  from: string | undefined,
  to: string | undefined,
): string {
  if (from && to) {
    return ` - Changed ${type} _${name}_ from **${from}** to **${to}**`;
  }
  if (from) {
    return ` - Removed ${type} _${name}_`;
  }
  return ` - Added ${type} _${name}_ with version **${to}**`;
}

async function run() {
  const repoInfo = await getPackages(__dirname);
  const rootDir = repoInfo.root.dir;
  let dependenciesChanged = false;

  const packages = repoInfo.packages
    .filter((pkg) => {
      return !IGNORED_PACKAGE_PATTERNS.some((pattern) => pattern.test(pkg.dir));
    })
    .map((pkg) => {
      const relativeDir = `${pkg.dir.replace(`${rootDir}/`, "")}/package.json`;

      return {
        ...pkg,
        relativeDir,
      };
    });

  const changedFiles = await getChangedFilesSince({
    cwd: rootDir,
    ref: "main",
  });

  const updatedPackages = packages.filter((pkg) => {
    return changedFiles.includes(pkg.relativeDir);
  });

  for (const pkg of updatedPackages) {
    const updatedEntries: string[] = [];
    const baseVersion = await getJsonFileBaseVersion(pkg.relativeDir, rootDir);
    // find dependencies which changed and list them
    const baseDependencies = baseVersion.dependencies || {};
    const basePeerDependencies = baseVersion.peerDependencies || {};
    const baseDevDependencies = baseVersion.devDependencies || {};
    const currentDependencies = pkg.packageJson.dependencies || {};
    const currentPeerDependencies = pkg.packageJson.peerDependencies || {};
    const currentDevDependencies = pkg.packageJson.devDependencies || {};

    const allDependenciesChanged = Object.keys(baseDependencies)
      .concat(Object.keys(currentDependencies))
      .reduce((acc, key) => {
        acc.includes(key) ? acc : acc.push(key);
        return acc;
      }, [] as string[]);
    for (const dep of allDependenciesChanged) {
      if (baseDependencies[dep] !== currentDependencies[dep]) {
        updatedEntries.push(
          createLineDescription(
            dep,
            "dependency",
            baseDependencies[dep],
            currentDependencies[dep],
          ),
        );
      }
    }
    const allPeerDependenciesChanged = Object.keys(basePeerDependencies)
      .concat(Object.keys(currentPeerDependencies))
      .reduce((acc, key) => {
        acc.includes(key) ? acc : acc.push(key);
        return acc;
      }, [] as string[]);
    for (const dep of allPeerDependenciesChanged) {
      if (basePeerDependencies[dep] !== currentPeerDependencies[dep]) {
        updatedEntries.push(
          createLineDescription(
            dep,
            "peerDependency",
            basePeerDependencies[dep],
            currentPeerDependencies[dep],
          ),
        );
      }
    }

    const allDevDependencyChanged = Object.keys(baseDevDependencies)
      .concat(Object.keys(currentDevDependencies))
      .reduce((acc, key) => {
        acc.includes(key) ? acc : acc.push(key);
        return acc;
      }, [] as string[]);
    for (const dep of allDevDependencyChanged) {
      if (baseDevDependencies[dep] !== currentDevDependencies[dep]) {
        updatedEntries.push(
          createLineDescription(
            dep,
            "devDependency",
            baseDevDependencies[dep],
            currentDevDependencies[dep],
          ),
        );
      }
    }

    if (updatedEntries.length) {
      dependenciesChanged = true;
      const id = await writeChangeset(
        {
          summary: `Dependency changes:\n${updatedEntries.join("\n")}`,
          releases: [{ name: pkg.packageJson.name, type: "patch" }],
        },
        rootDir,
      );
      console.log(
        "Saved dependency changeset: ",
        id,
        "for package",
        pkg.packageJson.name,
      );
    }
  }

  if (!dependenciesChanged) {
    console.log("No dependency changes found");
  }
}

run();
