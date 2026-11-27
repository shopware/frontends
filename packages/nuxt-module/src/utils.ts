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

/**
 * Tells whether a config key looks like a secret that must never reach the
 * browser, such as Admin API integration credentials.
 *
 * Matches case-insensitively and ignores `_` and `-`, so `client_secret`,
 * `clientSecret` and `CLIENT-SECRET` are the same key. The sales channel
 * `accessToken`, `endpoint` and `devStorefrontUrl` are public by design and
 * never match.
 */
export function isSecretConfigKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[-_]/g, "");
  return (
    normalized === "clientid" ||
    normalized.includes("secret") ||
    normalized.includes("password") ||
    normalized.includes("privatekey") ||
    normalized.startsWith("adminapi")
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Returns a copy of `config` without secret-like keys (see
 * {@link isSecretConfigKey}), at any nesting depth, together with the dotted
 * paths of the removed keys. The input is not modified.
 */
export function stripSecretConfigKeys<T>(
  config: T,
  basePath = "",
): { config: T; strippedPaths: string[] } {
  const strippedPaths: string[] = [];

  const strip = (value: unknown, path: string): unknown => {
    if (Array.isArray(value)) {
      return value.map((item, index) => strip(item, `${path}[${index}]`));
    }
    if (!isPlainObject(value)) {
      return value;
    }
    const result: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      const childPath = path ? `${path}.${key}` : key;
      if (isSecretConfigKey(key)) {
        strippedPaths.push(childPath);
        continue;
      }
      result[key] = strip(child, childPath);
    }
    return result;
  };

  return { config: strip(config, basePath) as T, strippedPaths };
}
