import type { Argv } from "yargs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import packageJson from "../package.json";
// import { version } from "../package.json";
import { generate } from "./commands/generate";
import { loadSchema } from "./commands/loadSchema";
import { validateJson } from "./commands/validateJson";

export interface CommonOptions {
  cwd: string;
}

function commonOptions(args: Argv<unknown>): Argv<CommonOptions> {
  return args.option("cwd", {
    alias: "C",
    default: process.cwd(),
    type: "string",
    describe: "specify the current working directory",
  });
}

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName("@shopware/api-gen")
  .usage("$0 [args]")
  .command(
    "generate",
    "Generate schema from your API instance",
    (args) => {
      return commonOptions(args)
        .positional("filename", {
          type: "string",
          describe:
            "name of the file to generate type from. The default (based on apiType parameter) is 'storeApiSchema.json' or 'adminApiSchema.json'",
        })
        .option("apiType", {
          choices: ["store", "admin"] as const,
          demandOption: true,
          describe: "type of the generated API. Values: store, admin",
        })
        .positional("debug", {
          type: "boolean",
          default: false,
          describe: "show debug information and generate intermediate files",
        })
        .option("logPatches", {
          type: "boolean",
          default: false,
          describe: "show patched logs",
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
        .option("apiType", {
          describe:
            "Type of the API schema to load. It can be 'store' or 'admin'",
          default: "store",
          choices: ["store", "admin"],
        })
        .positional("filename", {
          type: "string",
          describe:
            "name of the file to save schema. The default (based on apiType parameter) is 'storeApiSchema.json' or 'adminApiSchema.json'",
        })
        .help();
    },
    async (args) => loadSchema(args),
  )
  .command(
    "validateJson",
    "Validate JSON schema with the ruleset",
    (args) => {
      return commonOptions(args)
        .option("apiType", {
          describe:
            "Type of the API schema to load. It can be 'store' or 'admin'",
          default: "store",
          choices: ["store", "admin"],
        })
        .positional("filename", {
          type: "string",
          describe:
            "name of the schema json file. The default (based on apiType parameter) is 'storeApiSchema.json' or 'adminApiSchema.json'",
        })
        .option("logPatches", {
          type: "boolean",
          default: false,
          describe: "show patched logs",
        })
        .positional("debug", {
          type: "boolean",
          default: false,
          describe: "show debug information and generate intermediate files",
        })
        .help();
    },
    async (args) => validateJson(args),
  )
  .showHelpOnFail(false)
  .alias("h", "help")
  .version("version", packageJson.version)
  .alias("v", "version")
  .help().argv;
