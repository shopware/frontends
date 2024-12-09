import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export default {
  paths() {
    const cwd = process.cwd();
    const projectRootDir = cwd.endsWith("/apps/docs")
      ? `${cwd}/../..`
      : `${cwd}/src/frontends/_source`;

    return readdirSync(`${projectRootDir}/packages/composables/src`, {
      withFileTypes: true,
    })
      .filter((element) => {
        return element.isDirectory() && element.name.startsWith("use");
      })
      .map((element) => ({
        params: { composable: element.name },
      }));
  },
};
