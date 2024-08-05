# @shopware/api-client

## 1.0.2

### Patch Changes

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Migrate eslint config to flat format

- [#1074](https://github.com/shopware/frontends/pull/1074) [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4) Thanks [@mkucmus](https://github.com/mkucmus)! - Update default schemas' `translated` properties as required

## 1.0.1

### Patch Changes

- [#1078](https://github.com/shopware/frontends/pull/1078) [`19f2800`](https://github.com/shopware/frontends/commit/19f28003cf937bcb630257cb7cfd2bd131b7cf9d) Thanks [@patzick](https://github.com/patzick)! - Patch for missing `sw-include-seo-url` in OpenAPI schema.

## 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#1056](https://github.com/shopware/frontends/pull/1056) [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04) Thanks [@patzick](https://github.com/patzick)! - Removed deprecations from the code:

  - `onContextChanged` function inside `createAPIClient` method. Use `apiClient.hook("onContextChanged", ...)` instead.
  - `apiType` flag from the `createAPIClient`. Use separate methods to create store and admin api clients
  - `onAuthChange` from the `createAdminAPIClient`. Use `adminApiClient.hook('onAuthChange',...)` instead

### Minor Changes

- [#1039](https://github.com/shopware/frontends/pull/1039) [`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae) Thanks [@patzick](https://github.com/patzick)! - We're exposing `fetchOptions` inside params of `invoke` method. You can now use `ofetch` features like `timeout` or `signal` with AbortController

  Example for the AbortController:

  ```ts
  const controller = new AbortController();

  const request = client.invoke("readContext get /context", {
    fetchOptions: {
      signal: controller.signal,
    },
  });

  controller.abort(); // At this point client will throw an error with the information, that the request has been cancelled
  ```

- [#560](https://github.com/shopware/frontends/pull/560) [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e) Thanks [@patzick](https://github.com/patzick)! - [createAdminAPIClient] ability to pass optional field `credentials` to be used as authentication method before invoking any Admin API endpoint.

- [#639](https://github.com/shopware/frontends/pull/639) [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798) Thanks [@patzick](https://github.com/patzick)! - Management of defaultHeaders. You can now set them on apiClient init or runtime.

  ```ts
  const apiClient = createApiClient({
    ...,
    defaultHeaders: {
      'sw-language-id': 'my-id',
    },
  });

  console.log('Debug default headers:', apiClient.defaultHeaders);

  // Change header runtime
  apiClient.defaultHeaders['sw-language-id'] = 'my-new-id';

  // Remove header runtime
  apiClient.defaultHeaders['sw-language-id'] = "";

  // Change multiple headers runtime
  apiClient.defaultHeaders.apply({
    'sw-language-id': 'another-id',
    'sw-currency-id': 'currency-id',
  })
  ```

- [#857](https://github.com/shopware/frontends/pull/857) [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add error and success callbacks

### Patch Changes

- [#787](https://github.com/shopware/frontends/pull/787) [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d) Thanks [@mkucmus](https://github.com/mkucmus)! - Adjust test snapshot for Shopware v6.6 response

- [#567](https://github.com/shopware/frontends/pull/567) [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110) Thanks [@patzick](https://github.com/patzick)! - Export default API types to be compatible with the `bundler` mode resolution in `tsconfig`

- [#557](https://github.com/shopware/frontends/pull/557) [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87) Thanks [@patzick](https://github.com/patzick)! - Added `Accept: application/json` default header to get only JSON responses.

- [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8) Thanks [@patzick](https://github.com/patzick)! - fix default types

## 0.5.0

### Minor Changes

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Changed types imports to `import type {...} from "..."`

### Patch Changes

- [#443](https://github.com/shopware/frontends/pull/443) [`33d54db1`](https://github.com/shopware/frontends/commit/33d54db1bd66146a14781c45b1124547f4276866) Thanks [@patzick](https://github.com/patzick)! - `invoke` method parameters are no longer mandatory when no parameters are defined inside route.

  Now instead of:

  ```ts
  const result = await apiInstance.invoke("readContext get /context", {});
  ```

  you can do:

  ```ts
  const result = await apiInstance.invoke("readContext get /context");
  ```

## 0.4.0

### Minor Changes

- [#371](https://github.com/shopware/frontends/pull/371) [`83c94e9b`](https://github.com/shopware/frontends/commit/83c94e9bb609533c4a1275cbf3822b0fc2ea1dd5) Thanks [@patzick](https://github.com/patzick)! - New method `createAdminAPIClient` supporting Admin API 🅰🅿🅸

- [#373](https://github.com/shopware/frontends/pull/373) [`5510bb02`](https://github.com/shopware/frontends/commit/5510bb028b1fea4c63d677850f50bb7b5a1cf01a) Thanks [@patzick](https://github.com/patzick)! - Added `getSessionData` and `setSessionData` methods in admin API client for test purposes.

### Patch Changes

- [#385](https://github.com/shopware/frontends/pull/385) [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _ofetch_ from **^1.2.1** to **^1.3.3**

- [#375](https://github.com/shopware/frontends/pull/375) [`bd88d6fa`](https://github.com/shopware/frontends/commit/bd88d6fa95de2b90f8a1e08e34159b46c5932b3b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _ofetch_ from **^1.1.1** to **^1.2.1**

- [`15d6e696`](https://github.com/shopware/frontends/commit/15d6e69616bd9bc5ad32f2a5f697e00c45a94784) Thanks [@patzick](https://github.com/patzick)! - Emit cjs bundle

- [#371](https://github.com/shopware/frontends/pull/371) [`83c94e9b`](https://github.com/shopware/frontends/commit/83c94e9bb609533c4a1275cbf3822b0fc2ea1dd5) Thanks [@patzick](https://github.com/patzick)! - Deprecated `apiType` param in `createAPIClient`, for Admin API client use `createAdminAPIClient` instead.

## 0.3.0

### Minor Changes

- [#330](https://github.com/shopware/frontends/pull/330) [`3683116`](https://github.com/shopware/frontends/commit/3683116588a7ef75e750fc33deee119f038c88e8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `setCurrentCountry` for changing context countryId

## 0.2.1

### Patch Changes

- [#339](https://github.com/shopware/frontends/pull/339) [`b2fe2bc`](https://github.com/shopware/frontends/commit/b2fe2bc84bc4f3381bc16b9216a935f3c317b0d4) Thanks [@patzick](https://github.com/patzick)! - Query param arrays. This fixes the way how query params are serialized. Previously, array query params were serialized as `?ids=1&ids=2`, now they are serialized as `?ids[]=1&ids[]=2`. This is the proper way of serialization in the Shopware API.
  The definition of the endpoints hasn't changed, so you don't need to change anything in your code.

- [#320](https://github.com/shopware/frontends/pull/320) [`8e499e3`](https://github.com/shopware/frontends/commit/8e499e35b3a1a7dc4d1382f8f99b8fc3426e4ac9) Thanks [@mkucmus](https://github.com/mkucmus)! - Prevent setting "null" or "undefined" as token on session init

## 0.2.0

### Minor Changes

- [#316](https://github.com/shopware/frontends/pull/316) [`589c09c`](https://github.com/shopware/frontends/commit/589c09cdd9dee0db172c371afc5ecd740bdb4723) Thanks [@patzick](https://github.com/patzick)! - Improved error handling. Api client now throws `ApiClientError` with detailed information about what went wrong with request.

  example:

  ```typescript
  import { ApiClientError } from "@shopware/api-client";

  try {
    // ... your request
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error(error); // This prints message summary
      console.error("Details:", error.details); // Raw response from API
    } else {
      console.error("==>", error); // Another type of error, not recognized by API client
    }
  }
  ```

### Patch Changes

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

## 0.1.0

### Minor Changes

- [#300](https://github.com/shopware/frontends/pull/300) [`da347b5`](https://github.com/shopware/frontends/commit/da347b548aea93afaab1cc9ebab63f732ecdb964) Thanks [@patzick](https://github.com/patzick)! - Predefining methods: exported `RequestReturnType ` and `RequestParameters` types. You can now create predefined methods:

  ```typescript
  const readCart = (params: RequestParameters<"readCart", operations>) =>
    apiInstance.invoke("readCart get /checkout/cart?name", params);
  ```

### Patch Changes

- [#295](https://github.com/shopware/frontends/pull/295) [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

## 0.0.3

### Patch Changes

- [#290](https://github.com/shopware/frontends/pull/290) [`9562a8a`](https://github.com/shopware/frontends/commit/9562a8add35751093d766017abba474f0ad578f8) Thanks [@patzick](https://github.com/patzick)! - ship api-types with package

## 0.0.2

### Patch Changes

- [`4c41514`](https://github.com/shopware/frontends/commit/4c41514f44f0c0769fe82bfea2ea9ad34519b9cd) Thanks [@patzick](https://github.com/patzick)! - updated links to docs
