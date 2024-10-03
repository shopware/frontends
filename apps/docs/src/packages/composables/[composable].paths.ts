import { readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

export default {
  paths() {
    // support multiple contexts
    const projectRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../packages/composables/src");

    return readdirSync(projectRootDir, {
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
