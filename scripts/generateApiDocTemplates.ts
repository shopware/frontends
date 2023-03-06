import path from "path";
import fs from "fs/promises";
// import { getExportsStatic, getExportsRuntime } from "pkg-exports";
import { findExports, resolveModuleExportNames } from "mlly";
import * as x from "../packages/composables/dist/index";

async function run() {
  const packageName = "types";
  // const packageName = "composables";
  const packagePath = path.join(__dirname, "..", "packages", packageName);

  const packagedist = await fs.readFile(
    // path.join(packagePath, "dist", "index.mjs"),
    path.join(packagePath, "dist", "index.d.ts"),
    "utf-8"
  );

  // const exports = await getExportsStatic("vue");
  // console.log("ex1", exports);
  // const p1 = await resolveModuleExportNames("@shopware-pwa/composables-next");
  // console.log("p1", p1);

  const exports2 = await findExports(packagedist);
  console.log("ex2", exports2);
}

run();
