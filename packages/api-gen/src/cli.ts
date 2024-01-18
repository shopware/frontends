import type { Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
// import { version } from "../package.json";
import { generate } from "./commands/generate";
import packageJson from "../package.json";
import { loadSchema } from "./commands/loadSchema";

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
        .positional("filename", {
          type: "string",
          default: "apiSchema.json",
          describe: "name of the file to generate type from",
        })
        .help();
    },
    async (args) => generate(args),
  )
  .command(
    "loadSchema",
    "Load JSON schema from your API instance. You need to have proper .env file",
    (args) => {
      return commonOptions(args)
        .positional("filename", {
          type: "string",
          default: "apiSchema.json",
          describe: "name of the file to save schema",
        })
        .help();
    },
    async (args) => loadSchema(args),
  )
  .showHelpOnFail(false)
  .alias("h", "help")
  .version("version", packageJson.version)
  .alias("v", "version")
  .help().argv;
