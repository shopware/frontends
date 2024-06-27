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
```

<!-- /automd -->

## Features

Generator will create a new directory `api-types` with TypeScript schemas inside. Depending on the `apiType` parameter it will create `storeApiTypes.ts` or `adminApiTypes.ts` file.

### Overriding

If your instance contains inacurate or outdated OpenAPI specification, you can override it by creating a new file inside `api-types` directory::

- `storeApiTypes.overrides.ts` for store API
- `adminApiTypes.overrides.ts` for admin API

Example of overrides file:

<!-- automd:file src="./tests/snapshots-override/simpleOverride.example.ts" code -->

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

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/api-gen/CHANGELOG.md)

### Latest changes: 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

### Minor Changes

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - `loadSchema` command added by splitting `generate` command

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Sorting `paths` in the same order by api patchs

- [#1017](https://github.com/shopware/frontends/pull/1017) [`12c8153`](https://github.com/shopware/frontends/commit/12c8153e2279d48716ba6d67e28a1876318eb094) Thanks [@patzick](https://github.com/patzick)! - New command `validateJson` to check correctness of your OpenAPI json file.

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Command `generate` has been splitted and doing only transformation from json to d.ts file

- [#564](https://github.com/shopware/frontends/pull/564) [`93a6048`](https://github.com/shopware/frontends/commit/93a6048ee28c1975750ef6911f303ea095cb9941) Thanks [@patzick](https://github.com/patzick)! - Added `apiType` option in `loadSchema` command. With `SHOPWARE_ADMIN_USERNAME` and `SHOPWARE_ADMIN_PASSWORD` env variables we can now authorize Admin API schema.

  example:

  ```bash
  # load schema from store API
  pnpx @shopware/api-gen loadSchema --apiType=store --filename=storeApiSchema.json

  # load schema from admin API
  pnpx @shopware/api-gen loadSchema --apiType=admin --filename=adminApiSchema.json
  ```

- [#1032](https://github.com/shopware/frontends/pull/1032) [`0b6133e`](https://github.com/shopware/frontends/commit/0b6133e8a9e929e004094800341a0c8e7de103eb) Thanks [@patzick](https://github.com/patzick)! - Possibility to add partial patches to the JSON schema.

- [#903](https://github.com/shopware/frontends/pull/903) [`18d8528`](https://github.com/shopware/frontends/commit/18d8528886cfdee5bb14b0f4adb10f9b874eddf2) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add Blob type support

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Schema `operations` is now a generic type to help with overriding types

- [#1032](https://github.com/shopware/frontends/pull/1032) [`0b6133e`](https://github.com/shopware/frontends/commit/0b6133e8a9e929e004094800341a0c8e7de103eb) Thanks [@patzick](https://github.com/patzick)! - Added support for JSON5 config files. Now you can use comments in your config files and JSON schema.

### Patch Changes

- [#534](https://github.com/shopware/frontends/pull/534) [`6170dca`](https://github.com/shopware/frontends/commit/6170dca220f4b33c4dcb6fd1c3172ad931a47c75) Thanks [@patzick](https://github.com/patzick)! - Generated `GenericRecord` is more open to avoid type problems

- [#1032](https://github.com/shopware/frontends/pull/1032) [`0b6133e`](https://github.com/shopware/frontends/commit/0b6133e8a9e929e004094800341a0c8e7de103eb) Thanks [@patzick](https://github.com/patzick)! - Fixed optional body parameters, now it's processed correctly. The body is required by default (if defined).

- [#928](https://github.com/shopware/frontends/pull/928) [`bada1cd`](https://github.com/shopware/frontends/commit/bada1cd816f5fa73389d401366545d08b0dd5c8b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Skip GenericRecord for the object with additionalProperties

- Updated dependencies [[`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae), [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198), [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c)]:
  - @shopware/api-client@1.0.0
