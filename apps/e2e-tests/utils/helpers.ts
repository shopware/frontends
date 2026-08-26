import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";

/**
 * Walk up from the working directory looking for an env file.
 *
 * This used to call find-up, which is declared in no package.json here. It
 * resolved to a hoisted CommonJS copy, so the named import was undefined and
 * loading playwright.config.ts threw. The version that did resolve was also
 * async, so dotenv received a Promise rather than a path.
 *
 * Returns undefined when no file is found, which leaves dotenv on its default.
 */
export const findEnv = (): string | undefined => {
  const fileName = process.env.ENV_FILE || ".env";
  const { root } = parse(process.cwd());

  let directory = process.cwd();
  for (;;) {
    const candidate = join(directory, fileName);
    if (existsSync(candidate)) return candidate;
    if (directory === root) return undefined;
    directory = dirname(directory);
  }
};
