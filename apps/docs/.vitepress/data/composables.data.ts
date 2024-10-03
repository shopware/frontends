import { defineLoader } from "vitepress";
import { resolve, dirname } from "path";
import { extract } from "ts-dox";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
export interface Data {
  composablesList: { text: string; link: string; category: string }[];
}

declare const data: Data;
export { data };

export default defineLoader({
  async load(): Promise<Data> {
    // support multiple contexts
    const projectRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../packages/composables/src");
    console.log(projectRootDir)

    const composablesList = readdirSync(projectRootDir, {
      withFileTypes: true,
    })
      .filter(
        (element) => element.isDirectory() && element.name.startsWith("use"),
      )
      .map((element) => {
        const file = extract(
          resolve(
            `${projectRootDir}/${element.name}/${element.name}.ts`,
          ),
        );
        return {
          text: element.name,
          link: `/packages/composables/${element.name}`,
          category:
            (file?.functions[element.name]?.docs.category ||
              file?.functions[`${element.name}Function`]?.docs.category) ??
            "",
        };
      });

    return {
      composablesList,
    };
  },
});
