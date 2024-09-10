import { defineLoader } from "vitepress";
import { resolve } from "path";
import { extract } from "ts-dox";
import { readdirSync } from "fs";
export interface Data {
  composablesList: { text: string; link: string; category: string }[];
}

declare const data: Data;
export { data };

export default defineLoader({
  async load(): Promise<Data> {
    const composablesList = readdirSync("../../packages/composables/src/", {
      withFileTypes: true,
    })
      .filter(
        (element) => element.isDirectory() && element.name.startsWith("use"),
      )
      .map((element) => {
        const file = extract(
          resolve(
            `../../packages/composables/src/${element.name}/${element.name}.ts`,
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
