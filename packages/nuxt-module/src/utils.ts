import { promises as fs, constants as FS_CONSTANTS } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Nuxt } from "@nuxt/schema";
import type { ShopwareNuxtOptions } from ".";

type DEPENDENCY = "@shopware/composables";

const distDir = dirname(fileURLToPath(import.meta.url));
const pkgDir = resolve(distDir, "..");
const pkgModulesDir = resolve(pkgDir, "./node_modules");

export async function isDependencyInstalledLocally(
  rootDir: string,
  dependency: DEPENDENCY,
) {
  try {
    const projectPackageJsonPath = resolve(rootDir, "package.json");
    const packageJson = JSON.parse(
      await fs.readFile(projectPackageJsonPath, "utf8"),
    );

    if (
      packageJson?.dependencies?.[dependency] ||
      packageJson?.devDependencies?.[dependency]
    ) {
      return true;
    }
  } catch (error) {
    console.error(
      "Shopware[nuxt-module]: unable to check local dependencies",
      error,
    );
  }
  return false;
}

export async function isExists(path: string) {
  try {
    await fs.access(path, FS_CONSTANTS.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function resolveOwnDependency(dependency: DEPENDENCY, nuxt: Nuxt) {
  const { rootDir, workspaceDir } = nuxt.options;
  const modulePath = `${dependency}/dist/index.mjs`;

  const targets = [
    resolve(rootDir, "node_modules", modulePath),
    resolve(pkgModulesDir, modulePath),
    resolve(workspaceDir, "node_modules", modulePath),
  ];

  for (const target of targets) {
    if (await isExists(target)) {
      return target;
    }
  }
  return null;
}

export function isConfigDeprecated(config: ShopwareNuxtOptions) {
  return Boolean(config?.shopwareEndpoint || config?.shopwareAccessToken);
}
