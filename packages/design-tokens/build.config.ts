import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { defineBuildConfig } from "unbuild";

import { colors } from "./src/colors";
import { toTailwindTheme } from "./src/formats";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: true,
  hooks: {
    async "rollup:done"(ctx) {
      const outDir = ctx.options.outDir;
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, "tailwind.css"), toTailwindTheme(colors));
    },
  },
});
