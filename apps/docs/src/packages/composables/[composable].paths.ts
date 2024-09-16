import { readdirSync } from "fs";
import { resolve } from "path";

export default {
  paths() {
    return readdirSync(resolve("../../packages/composables/src"), {
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
