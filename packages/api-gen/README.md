# shopware/frontends - api-gen

Welcome to `@shopware/api-gen` CLI.
Generate TypeScript schemas from Shopware OpenAPI specification.

After generating schemas, you can use them in fully typed [API Client](https://www.npmjs.com/package/@shopware/api-client).

## Usage

<!-- automd:pm-install name="@shopware/api-gen" dev -->

```sh
# ✨ Auto-detect
npx nypm install -D @shopware/api-gen

# npm
npm install -D @shopware/api-gen

# yarn
yarn add -D @shopware/api-gen

# pnpm
pnpm install -D @shopware/api-gen

# bun
bun install -D @shopware/api-gen

# deno
deno install --dev @shopware/api-gen
```

<!-- /automd -->

## Features

Generator will create a new directory `api-types` with TypeScript schemas inside. Depending on the `apiType` parameter it will create `storeApiTypes.ts` or `adminApiTypes.ts` file.

### Overriding

If your instance contains inacurate or outdated OpenAPI specification, you can override it by creating a new file inside `api-types` directory::

- `storeApiTypes.overrides.ts` for store API
- `adminApiTypes.overrides.ts` for admin API

Example of overrides file:

<!-- automd:file src="packages/api-gen/tests/snapshots-override/simpleOverride.example.ts" code -->

```ts [simpleOverride.example.ts]
import type { components as mainComponents } from "./storeApiTypes";

export type components = mainComponents & {
  schemas: Schemas;
};

export type Schemas = {
  CustomerAddress: {
    qwe: string;
  };
};

export type operations = {
  "myNewEndpointWithDifferentBodys post /aaaaa/bbbbb":
    | {
        contentType?: "application/json";
        accept?: "application/json";
        body: components["schemas"]["CustomerAddress"];
        response: components["schemas"]["Country"];
        responseCode: 201;
      }
    | {
        contentType: "application/xml";
        accept?: "application/json";
        body: {
          someting: boolean;
        };
        response: {
          thisIs200Response: string;
        };
        responseCode: 200;
      };
  "updateCustomerAddress patch /account/address/{addressId}": {
    contentType?: "application/json";
    accept?: "application/json";
    /**
     * We're testing overrides, assuming update address can only update the city
     */
    body: {
      city: string;
    };
    response: components["schemas"]["CustomerAddress"];
    responseCode: 200;
  };
};
```

<!-- /automd -->

> [!IMPORTANT]  
> Overriding components or operations in the TS files requires you to have a full object definitions!

### Partial overrides

There is a possiblity to add patches (partial overrides) to the schema. Partial overrides are applied directly to the JSON schema, so the syntax needs to be correct. It can then be used by the backend CI tool to validate and apply these patches directly to the schema to fix inconsistencies.

By default CLI is fetching the patches from the api-client repository, but you can provide your own patches file by adding a path to the `api-gen.config.json` file.
Example:

```json
{
  "$schema": "https://raw.githubusercontent.com/shopware/frontends/main/packages/api-gen/api-gen.schema.json",
  "patches": ["storeApiTypes.overrides.json"]
}
```

or you could use multiple patches and add your own overrides on top:

```json
{
  "$schema": "https://raw.githubusercontent.com/shopware/frontends/main/packages/api-gen/api-gen.schema.json",
  "patches": [
    "https://raw.githubusercontent.com/shopware/frontends/refs/heads/main/packages/api-client/api-types/storeApiSchema.overrides.json",
    "./api-types/myOwnPatches.overrides.json"
  ]
}
```

and then inside the `storeApiTypes.overrides.json` file you can add your patches:

```json
{
  "components": {
    "Cart": [
      {
        "required": ["price"]
      },
      {
        "required": ["errors"]
      }
    ]
  }
}
```

you apply this as 2 independent patches, or combine it as a single patch without array:

```json
{
  "components": {
    "Cart": {
      "required": ["price", "errors"]
    }
  }
}
```

Creating multiple patches is useful when you want to apply different changes to the same object, which can also be corrected on the backend side independently. This way specific patches are becoming outdated and you get the notification that you can remove them safely.

> [!NOTE]  
> Check our current default patches to see more examples: [source](https://raw.githubusercontent.com/shopware/frontends/main/packages/api-client/api-types/storeApiSchema.overrides.json).

## Commands

### add shortcut to your `package.json` scripts

```json
{
  "scripts": {
    "generate-types": "shopware-api-gen generate --apiType=store"
  }
}
```

then running `pnpm generate-types` will generate types in `api-types` directory.

### `generate`

Transform OpenAPI specification from JSON file to Typescript schemas. Use `loadSchema` command first.

options:

```bash
pnpx @shopware/api-gen generate --help

# generate schemas from store API
pnpx @shopware/api-gen generate --apiType=store

# generate schemas from admin API
pnpx @shopware/api-gen generate --apiType=admin
```

flags:

- `--debug` - display debug logs and additional information which can be helpful in case of issues
- `--logPatches` - display patched logs, useful when you want to fix schema in original file

### `loadSchema`

Load OpenAPI specification from Shopware instance and save it to JSON file.

options:

```bash
pnpx @shopware/api-gen loadSchema --help

# load schema from store API
pnpx @shopware/api-gen loadSchema --apiType=store

# load schema from admin API
pnpx @shopware/api-gen loadSchema --apiType=admin
```

flags:

- `--debug` - display debug logs and additional information which can be helpful in case of issues
- `--logPatches` - display patched logs, useful when you want to fix schema in original file

Remember to add `.env` file in order to authenticate with Shopware instance.

```bash
OPENAPI_JSON_URL="https://your-shop-instance.shopware.store"
## This one needed to fetch store API schema
OPENAPI_ACCESS_KEY="YOUR_STORE_API_ACCESS_KEY"
## These two needed to fetch admin API schema
SHOPWARE_ADMIN_USERNAME="my@username.com"
SHOPWARE_ADMIN_PASSWORD="my-password"
```

### `validateJson`

This command allow to validate the output JSON file of your instance. You can configure which rules should be applied, we provide you with the schema configuration file, so you can easily modify it.

options:

```bash
pnpx @shopware/api-gen validateJson --help

# validate JSON file
pnpx @shopware/api-gen validateJson --apiType=store
```

this searches for `api-types/storeApiTypes.json` file and validates it. Use [loadSchema](#loadSchema) command first to fetch your JSON file.

Prepare your config file named **api-gen.config.json**:

```JSON
{
  "$schema": "https://raw.githubusercontent.com/shopware/frontends/main/packages/api-gen/api-gen.schema.json",
  "rules": [
    "COMPONENTS_API_ALIAS" // you have description on autocompletion what specific rule does, this one for example ensures correctness of the apiAlias field
  ],
  //"patches": "storeApiTypes.overrides.json" // -> path to your overrides file in api-types folder, default is fetched from api-client repository
}
```

### `split` - Experimental

Split an OpenAPI schema into multiple files, organized by tags or paths. This is useful for breaking down a large schema into smaller, more manageable parts.

The main reason for this is that the complete JSON schema can be too large and complex for API clients like Postman or Insomnia to handle, sometimes
causing performance issues or import failures due to the file size or circular references. This command helps developers to extract only the parts of
the schema they need and then import it to the API client of their choice.

Example usage:

```bash
# Display all available tags
pnpx @shopware/api-gen split <path-to-schema-file> --list tags

# Display all available paths
pnpx @shopware/api-gen split <path-to-schema-file> --list paths

# Split schema by tags and show detailed linting errors
pnpx @shopware/api-gen split <path-to-schema-file> --splitBy=tags --outputDir <output-directory> --verbose-linting

# Split schema by a single tag
pnpx @shopware/api-gen split <path-to-schema-file> --splitBy=tags --outputDir <output-directory> --filterBy "media"

# Split schema by a single path
pnpx @shopware/api-gen split <path-to-schema-file> --splitBy=paths --outputDir <output-directory> --filterBy "/api/_action/media/{mediaId}/upload"
```

### Programmatic usage

Each command can also be used programmatically within your own scripts:

#### `generate`

```ts
import { generate } from "@shopware/api-gen";

await generate({ 
  cwd: process.cwd(),
  filename: "storeApiTypes.ts",
  apiType: "store",
  debug: true,
  logPatches: true,
});
```

#### `loadSchema`

```ts
import { loadSchema } from "@shopware/api-gen";

await loadSchema({
  cwd: process.cwd(),
  filename: "storeApiTypes.json",
  apiType: "store",
});
```

#### `validateJson`

```ts
import { validateJson } from "@shopware/api-gen";

await validateJson({
  cwd: process.cwd(),
  filename: "storeApiTypes.json",
  apiType: "store",
  logPatches: true,
  debug: true,
});
```

#### `split`

```ts
import { split } from "@shopware/api-gen";

await split({
  schemaFile: "path/to/your/schema.json",
  outputDir: "path/to/output/directory",
  splitBy: "tags", // or "paths"
  // filterBy: "TagName" // optional filter
});
```

> [!NOTE]  
> Make sure that the required environment variables are set for the node process when executing commands programmatically.

## Links

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community Discord](https://discord.com/channels/1308047705309708348/1405501315160739951) (`#composable-frontend` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/api-gen/CHANGELOG.md)

### Latest changes: 1.3.3

### Patch Changes

- [#1942](https://github.com/shopware/frontends/pull/1942) [`a344abb`](https://github.com/shopware/frontends/commit/a344abba579c91c4f775e7be27ed882ca420fdc2) Thanks [@patzick](https://github.com/patzick)! - Allow shared parameters to be available in schema resolver.
