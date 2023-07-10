import type { PackageJSON } from "@changesets/types";
import { getPackages } from "@manypkg/get-packages";
import { getChangedFilesSince } from "@changesets/git";
import spawn from "spawndamnit";
import writeChangeset from "@changesets/write";

async function getJsonFileBaseVersion(
  filename: string,
  cwd: string
): Promise<PackageJSON> {
  const { stdout, code } = await spawn("git", ["show", `HEAD:./${filename}`], {
    cwd,
  });

  const packageJSON = JSON.parse(stdout.toString());
  return packageJSON;
}

function createLineDescription(
  name: string,
  type: "dependency" | "peerDependency",
  from: string | undefined,
  to: string | undefined
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

  const packages = repoInfo.packages.map((pkg) => {
    const relativeDir = pkg.dir.replace(rootDir + "/", "") + "/package.json";

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
    const currentDependencies = pkg.packageJson.dependencies || {};
    const currentPeerDependencies = pkg.packageJson.peerDependencies || {};

    const allDependenciesChanged = Object.keys(baseDependencies)
      .concat(Object.keys(currentDependencies))
      .reduce((acc, key) => {
        acc.includes(key) ? acc : acc.push(key);
        return acc;
      }, [] as string[]);
    allDependenciesChanged.forEach((dep) => {
      if (baseDependencies[dep] !== currentDependencies[dep]) {
        updatedEntries.push(
          createLineDescription(
            dep,
            "dependency",
            baseDependencies[dep],
            currentDependencies[dep]
          )
        );
      }
    });
    const allPeerDependenciesChanged = Object.keys(basePeerDependencies)
      .concat(Object.keys(currentPeerDependencies))
      .reduce((acc, key) => {
        acc.includes(key) ? acc : acc.push(key);
        return acc;
      }, [] as string[]);
    allPeerDependenciesChanged.forEach((dep) => {
      if (basePeerDependencies[dep] !== currentPeerDependencies[dep]) {
        updatedEntries.push(
          createLineDescription(
            dep,
            "peerDependency",
            basePeerDependencies[dep],
            currentPeerDependencies[dep]
          )
        );
      }
    });

    if (updatedEntries.length) {
      dependenciesChanged = true;
      const id = await writeChangeset(
        {
          summary: `Dependency changes:\n${updatedEntries.join("\n")}`,
          releases: [{ name: pkg.packageJson.name, type: "patch" }],
        },
        rootDir
      );
      console.log("Saved dependency changeset: ", id);
    }
  }

  if (!dependenciesChanged) {
    console.log("No dependency changes found");
  }
}

run();
