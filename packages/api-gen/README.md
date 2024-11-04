# shopware/frontends - api-gen

Welcome to `@shopware/api-gen` CLI.
Generate TypeScript schemas from Shopware OpenAPI specification.

After generating schemas, you can use them in fully typed [API Client](https://www.npmjs.com/package/@shopware/api-client).

To take a deep dive into the topic visit the [🧑‍🎓 API Client Tutorial](https://api-client-tutorial-composable-frontends.pages.dev) first.

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
import { components as mainComponents } from "./storeApiTypes";

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
  "patches": "./api-types/storeApiTypes.overrides.json"
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
  //"patches": "./api-types/storeApiTypes.overrides.json" // -> path to your overrides file, default is fetched from api-client repository
}
```

## Links

- [🧑‍🎓 Tutorial](https://api-client-tutorial-composable-frontends.pages.dev)

- [📘 Documentation](https://frontends.shopware.com)

- [👥 Community Slack](https://shopwarecommunity.slack.com) (`#composable-frontends` channel)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/api-gen/CHANGELOG.md)

### Latest changes: 1.1.0

### Minor Changes

- [#1405](https://github.com/shopware/frontends/pull/1405) [`f9fb243`](https://github.com/shopware/frontends/commit/f9fb243d56d05a66ca4efd277c137e2ae8967f7b) Thanks [@patzick](https://github.com/patzick)! - Updated openapi-typescript to v7. Additional checks for better generation

- [#1365](https://github.com/shopware/frontends/pull/1365) [`6abe9ab`](https://github.com/shopware/frontends/commit/6abe9abb64b9d2fe94d565393b1c08ec68b58162) Thanks [@patzick](https://github.com/patzick)! - `validateJson` command now checks endpoints exposed by the API to show if there are any endpoints missing in the schema or the schema contains some endpoints definitions, which are not exposed by the backend instance

  tun it in the console like this:

  ```bash
  shopware-api-gen validateJson --apiType=store

  shopware-api-gen validateJson --apiType=admin
  ```

  You need to have the same .env variables as needed for `loadSchema` command as the CLI is checking endpoints against the running instance.

### Patch Changes

- [#1364](https://github.com/shopware/frontends/pull/1364) [`221af3c`](https://github.com/shopware/frontends/commit/221af3c5f56253239f9e7f2a45d71a0220c26cde) Thanks [@patzick](https://github.com/patzick)! - Fix patching schema when there is an oveerite with the `_DELETE` key, and the value was not present in the original schema. In that case there is nothing to delete and value should be omitted.

- [#1304](https://github.com/shopware/frontends/pull/1304) [`183eee9`](https://github.com/shopware/frontends/commit/183eee90e855269251f32145711c9b284b0f2aa4) Thanks [@mkucmus](https://github.com/mkucmus)! - Fix import [pitfall](https://github.com/dotenv-org/examples/blob/master/usage/dotenv-es6-import-pitfall/invalid.mjs).

- [#1330](https://github.com/shopware/frontends/pull/1330) [`2fdb986`](https://github.com/shopware/frontends/commit/2fdb9861a2ed2b89e28bec170c3a080d470d6210) Thanks [@mkucmus](https://github.com/mkucmus)! - Avoid schema loading when internal value `_DELETE_` is used for `$ref` key.

  **parse** function of `json5` library tries to load a `$ref` by loading a file under the reference value, and that's why

  > _ENOENT: no such file or directory, open '{cwd}/\_DELETE_'\_

  error was being thrown when there was no `_DELETE_` schema available locally (in the same json schema).

- Updated dependencies [[`6abe9ab`](https://github.com/shopware/frontends/commit/6abe9abb64b9d2fe94d565393b1c08ec68b58162), [`0643174`](https://github.com/shopware/frontends/commit/06431743162c088d46cf1e6305332bd51542eec4), [`266bb32`](https://github.com/shopware/frontends/commit/266bb32e119d7e1b3df7e082fb0fe4b0a475af44), [`f9fb243`](https://github.com/shopware/frontends/commit/f9fb243d56d05a66ca4efd277c137e2ae8967f7b), [`15bebee`](https://github.com/shopware/frontends/commit/15bebee0daefacc078ac99fea8725b95fdbc1cc7), [`ebb10eb`](https://github.com/shopware/frontends/commit/ebb10eba629b3ec2c5a4a50fa12ef0b134601d6f)]:
  - @shopware/api-client@1.1.0
