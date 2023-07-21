import type { Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
// import { version } from "../package.json";
import { generate } from "./commands/generate";

export interface CommonOptions {
  cwd: string;
}

function commonOptions(args: Argv<{}>): Argv<CommonOptions> {
  return args.option("cwd", {
    alias: "C",
    default: "",
    type: "string",
    describe: "specify the current working directory",
  });
}

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName("client")
  .usage("$0 [args]")
  .command(
    "generate",
    "Generate schema from your API instance",
    (args) => {
      return commonOptions(args)
        .option("detail", {
          alias: "schema",
          type: "boolean",
          default: false,
          describe: "save also schema.json file",
        })
        .help();
    },
    async (args) => generate(),
  )
  .showHelpOnFail(false)
  .alias("h", "help")
  .version("version", "0.0.1") // from package.json
  .alias("v", "version")
  .help().argv;
