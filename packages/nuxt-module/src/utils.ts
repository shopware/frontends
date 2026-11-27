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

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[-_]/g, "");
}

/**
 * Tells whether a config key looks like a secret that must never reach the
 * browser, such as Admin API integration credentials.
 *
 * Matches case-insensitively and ignores `_` and `-`, so `client_secret`,
 * `clientSecret` and `CLIENT-SECRET` are the same key. The keys the module
 * reads from public config (`endpoint`, `accessToken`, `devStorefrontUrl`,
 * `useUserContextInSSR`, `apiClientConfig`, `cacheableReads` and the
 * deprecated `shopware*` variants) never match.
 *
 * `username` and `user` count as secret only under a credentials-like
 * parent key, such as `credentials` or `basicAuth`.
 */
export function isSecretConfigKey(key: string, parentKey?: string): boolean {
  const normalized = normalizeKey(key);
  if (
    normalized.includes("clientid") ||
    normalized.includes("secret") ||
    normalized.includes("password") ||
    normalized.includes("privatekey") ||
    normalized.includes("apikey") ||
    normalized.includes("accesskeyid") ||
    normalized.includes("authorization") ||
    normalized.startsWith("adminapi") ||
    // adminToken, apiToken, bearerToken, authToken, refreshToken...
    // but not the public sales channel accessToken
    (normalized.endsWith("token") && !normalized.endsWith("accesstoken"))
  ) {
    return true;
  }
  if (
    parentKey !== undefined &&
    (normalized === "username" || normalized === "user")
  ) {
    const parent = normalizeKey(parentKey);
    return parent.includes("credential") || parent.includes("auth");
  }
  return false;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Splits `config` into a copy without secret-like keys (see
 * {@link isSecretConfigKey}), at any nesting depth, and a `stripped` tree that
 * holds only the removed entries, so a caller can move them elsewhere.
 * `strippedPaths` lists the dotted paths of the removed keys. The input is not
 * modified. Secrets inside arrays are removed and reported, but not part of
 * `stripped`.
 */
export function stripSecretConfigKeys<T>(
  config: T,
  basePath = "",
): {
  config: T;
  stripped: Record<string, unknown>;
  strippedPaths: string[];
} {
  const strippedPaths: string[] = [];

  const strip = (
    value: unknown,
    path: string,
    parentKey: string | undefined,
  ): { kept: unknown; removed?: Record<string, unknown> } => {
    if (Array.isArray(value)) {
      return {
        kept: value.map(
          (item, index) => strip(item, `${path}[${index}]`, parentKey).kept,
        ),
      };
    }
    if (!isPlainObject(value)) {
      return { kept: value };
    }
    const kept: Record<string, unknown> = {};
    let removed: Record<string, unknown> | undefined;
    for (const [key, child] of Object.entries(value)) {
      const childPath = path ? `${path}.${key}` : key;
      if (isSecretConfigKey(key, parentKey)) {
        strippedPaths.push(childPath);
        removed = { ...removed, [key]: child };
        continue;
      }
      const result = strip(child, childPath, key);
      kept[key] = result.kept;
      if (result.removed) {
        removed = { ...removed, [key]: result.removed };
      }
    }
    return { kept, removed };
  };

  const { kept, removed } = strip(config, basePath, undefined);
  return { config: kept as T, stripped: removed ?? {}, strippedPaths };
}
