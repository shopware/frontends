import { readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

export default {
  paths() {
    const cwd = process.cwd();
    const projectRootDir = cwd.endsWith('/apps/docs')
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
