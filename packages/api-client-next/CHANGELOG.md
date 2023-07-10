# @shopware/api-client

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
