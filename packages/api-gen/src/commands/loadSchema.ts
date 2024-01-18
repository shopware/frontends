import { writeFileSync } from "node:fs";
import * as dotenv from "dotenv";
import c from "picocolors";
import { format } from "prettier";

const config = dotenv.config().parsed || {};

export async function loadSchema(args: { cwd: string; filename: string }) {
  try {
    if (!config.OPENAPI_JSON_URL || !config.OPENAPI_ACCESS_KEY) {
      console.error(
        c.red(
          `Missing ${c.bold("OPENAPI_JSON_URL")} or ${c.bold(
            "OPENAPI_ACCESS_KEY",
          )} env variables.\n\nCheck whether the .env file is created.\n`,
        ),
      );
      process.exit(1);
    }

    const apiJSON = await fetch(config.OPENAPI_JSON_URL, {
      headers: {
        "sw-access-key": config.OPENAPI_ACCESS_KEY,
        Authorization: config.OPENAPI_ACCESS_KEY,
      },
    }).then((res) => res.json());

    const formatted = await format(JSON.stringify(apiJSON), {
      semi: false,
      parser: "json",
    });
    const content = formatted.trim();

    // const version = apiJSON?.info?.version;

    writeFileSync(args.filename, content, {
      encoding: "utf-8",
    });

    console.log(
      c.green(
        `Schema file loaded from ${c.bold(
          config.OPENAPI_JSON_URL,
        )} and saved to ${c.bold(args.filename)}`,
      ),
    );
  } catch (error) {
    console.error(
      c.red(
        `Error while loading OpenAPI schema JSON file. Checkout your ${c.bold(
          ".env",
        )} file and try again.\n`,
      ),
      error,
    );
    process.exit(1);
  }
}
