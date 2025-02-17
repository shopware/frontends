# @shopware/api-gen

## 1.3.0

### Minor Changes

- [#1706](https://github.com/shopware/frontends/pull/1706) [`d7bf6d7`](https://github.com/shopware/frontends/commit/d7bf6d715689f5d0cbef9f0bbbc78f19f54215d5) Thanks [@patzick](https://github.com/patzick)! - Simplify `api-gen.config.json` configuration. Now you can use names instead of paths in patches like `storeApiSchema.overrides.json` or `storeApiSchema.b2b.overrides.json`.
  Thanks to this you can simple and more granularly apply patches for your project.

## 1.2.1

### Patch Changes

- [#1696](https://github.com/shopware/frontends/pull/1696) [`f953539`](https://github.com/shopware/frontends/commit/f953539726813aa3cba404df2a74fa2d18b96fb0) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - `loadSchema` command - create `api-types` folder if not exists

- Updated dependencies [[`7324620`](https://github.com/shopware/frontends/commit/7324620a3f39c1b62f7cc294192a3e8b8b336d09)]:
  - @shopware/api-client@1.2.1

## 1.2.0

### Minor Changes

- [#1566](https://github.com/shopware/frontends/pull/1566) [`541cd6e`](https://github.com/shopware/frontends/commit/541cd6e5b5acaa20fb8aad699b2674e81b9330ce) Thanks [@patzick](https://github.com/patzick)! - Possibility to add multiple override json patches. Now you can use our default overrides and add your own on top of it.

## 1.1.4

### Patch Changes

- [#1447](https://github.com/shopware/frontends/pull/1447) [`11ea41f`](https://github.com/shopware/frontends/commit/11ea41fc00493d4997ddfcb23e2f5bf89dd2a828) Thanks [@patzick](https://github.com/patzick)! - Improved error messages and merging override patches.

- Updated dependencies [[`a87bbcf`](https://github.com/shopware/frontends/commit/a87bbcfa3f5aa440265b1e8f0fc72a204863befc)]:
  - @shopware/api-client@1.2.0

## 1.1.3

### Patch Changes

- Updated dependencies [[`938c4cf`](https://github.com/shopware/frontends/commit/938c4cfe6438f0e11a34f69bc7a183f10ba7f381)]:
  - @shopware/api-client@1.1.2

## 1.1.2

### Patch Changes

- Updated dependencies [[`8df7651`](https://github.com/shopware/frontends/commit/8df76511c8afca78c79fe3f009ed32d207913f86)]:
  - @shopware/api-client@1.1.1

## 1.1.1

### Patch Changes

- [`b550cef`](https://github.com/shopware/frontends/commit/b550ceffac00f23a533d4f3913d2a801d3892c69) Thanks [@patzick](https://github.com/patzick)! - Fix process failing on errors to give more time for adoption.

## 1.1.0

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

## 1.0.5

### Patch Changes

- [#1269](https://github.com/shopware/frontends/pull/1269) [`999b076`](https://github.com/shopware/frontends/commit/999b076db88bc34614d9d3221b96a04b997009a3) Thanks [@patzick](https://github.com/patzick)! - reading environment variables not only from the .env file but also injected by the system

## 1.0.4

### Patch Changes

- [#1074](https://github.com/shopware/frontends/pull/1074) [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4) Thanks [@mkucmus](https://github.com/mkucmus)! - Set `translated` property as required in provided schemas

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Migrate eslint config to flat format

- Updated dependencies [[`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6), [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4)]:
  - @shopware/api-client@1.0.2

## 1.0.3

### Patch Changes

- [#1113](https://github.com/shopware/frontends/pull/1113) [`65212d1`](https://github.com/shopware/frontends/commit/65212d11bb8d0af10f97454a46e7671ff16ebc7a) Thanks [@patzick](https://github.com/patzick)! - Parse Json5 responses when using default overrides

- [#1112](https://github.com/shopware/frontends/pull/1112) [`2065d00`](https://github.com/shopware/frontends/commit/2065d00998cd84fb6e2f51d7f793eb178e0865e4) Thanks [@patzick](https://github.com/patzick)! - Fixed adding missing components in overrides. Used when component name is overriden and no component definition is provided for it.

- [#1103](https://github.com/shopware/frontends/pull/1103) [`c9a4965`](https://github.com/shopware/frontends/commit/c9a49659e77842a4b098d5b9cc6606f4158893fd) Thanks [@trimethylpentan](https://github.com/trimethylpentan)! - Re-enabled generation for `GenericRecord`s for openAPI objects

## 1.0.2

### Patch Changes

- [#1082](https://github.com/shopware/frontends/pull/1082) [`db42df4`](https://github.com/shopware/frontends/commit/db42df4aef6fcb5113d058fa5821274b58077407) Thanks [@patzick](https://github.com/patzick)! - `COMPONENTS_API_ALIAS` rule - additional message suggesting that the schema component name might be incorrect

- [#1082](https://github.com/shopware/frontends/pull/1082) [`db42df4`](https://github.com/shopware/frontends/commit/db42df4aef6fcb5113d058fa5821274b58077407) Thanks [@patzick](https://github.com/patzick)! - Correct api overrides load, depending on the apiType

## 1.0.1

### Patch Changes

- Updated dependencies [[`19f2800`](https://github.com/shopware/frontends/commit/19f28003cf937bcb630257cb7cfd2bd131b7cf9d)]:
  - @shopware/api-client@1.0.1

## 1.0.0

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

## 0.1.1

### Patch Changes

- [#462](https://github.com/shopware/frontends/pull/462) [`c3aa09ee`](https://github.com/shopware/frontends/commit/c3aa09ee9e73c23b79bf9c1b3e5e63d7d39f1550) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _openapi-typescript_ from **^6.7.0** to **^6.7.1**
  - Changed dependency _prettier_ from **^3.0.3** to **^3.1.0**

## 0.1.0

### Minor Changes

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Changed types imports to `import type {...} from "..."`

### Patch Changes

- [#396](https://github.com/shopware/frontends/pull/396) [`dfc49b80`](https://github.com/shopware/frontends/commit/dfc49b80bcaa8e00b71e0dff6e35b413383274f5) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _openapi-typescript_ from **^6.5.5** to **^6.6.1**

- [#418](https://github.com/shopware/frontends/pull/418) [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _openapi-typescript_ from **^6.6.1** to **^6.7.0**

## 0.0.7

### Patch Changes

- [#369](https://github.com/shopware/frontends/pull/369) [`bc7a2db2`](https://github.com/shopware/frontends/commit/bc7a2db292d67cc448a901c1b7a9b5cb7dfbcd04) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _openapi-typescript_ from **^6.4.0** to **^6.5.2**
  - Changed dependency _prettier_ from **^3.0.0** to **^3.0.2**

- [#385](https://github.com/shopware/frontends/pull/385) [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _ofetch_ from **^1.2.1** to **^1.3.3**
  - Changed dependency _openapi-typescript_ from **^6.5.3** to **^6.5.5**
  - Changed dependency _prettier_ from **^3.0.2** to **^3.0.3**

- [#375](https://github.com/shopware/frontends/pull/375) [`bd88d6fa`](https://github.com/shopware/frontends/commit/bd88d6fa95de2b90f8a1e08e34159b46c5932b3b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _ofetch_ from **^1.1.1** to **^1.2.1**
  - Changed dependency _openapi-typescript_ from **^6.5.2** to **^6.5.3**

## 0.0.6

### Patch Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _openapi-typescript_ from **^6.3.4** to **^6.4.0**

## 0.0.5

### Patch Changes

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

- [#313](https://github.com/shopware/frontends/pull/313) [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _openapi-typescript_ from **^6.2.8** to **^6.3.4**
  - Changed dependency _prettier_ from **^2.8.8** to **^3.0.0**
  - Changed dependency _semver_ from **^7.5.3** to **^7.5.4**

## 0.0.4

### Patch Changes

- [#295](https://github.com/shopware/frontends/pull/295) [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

## 0.0.3

### Patch Changes

- [#292](https://github.com/shopware/frontends/pull/292) [`b68ca7f`](https://github.com/shopware/frontends/commit/b68ca7fbd51d22f4be84a228ca107972e07bfa32) Thanks [@patzick](https://github.com/patzick)! - fixed cli building, prettier is not inlined into bundle

## 0.0.2

### Patch Changes

- [`4c41514`](https://github.com/shopware/frontends/commit/4c41514f44f0c0769fe82bfea2ea9ad34519b9cd) Thanks [@patzick](https://github.com/patzick)! - updated links to docs
