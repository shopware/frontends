# vite-vue-plugin-disable-inputs

## 0.2.0

### Minor Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - DEPRECATION - this package is deprecated and no longer maintained.

  Using [expect.toPass](https://playwright.dev/docs/test-assertions#expecttopass) seems to be a better, and less invasive solution in order to achieve the same goal. Even though an app is not mounted, `toPass` assertion will retry the same test block, reflecting more human behavior, when for instance, some button is not active, an user will try to click it twice.

### Patch Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vite_ from **^4.4.4** to **^4.4.7**

## 0.1.1

### Patch Changes

- [#224](https://github.com/shopware/frontends/pull/224) [`62a985f`](https://github.com/shopware/frontends/commit/62a985f6b6ab81a38454c75e747bf425383e25e7) Thanks [@mkucmus](https://github.com/mkucmus)! - Prepared first release

- [#313](https://github.com/shopware/frontends/pull/313) [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vite_ from **^4.3.9** to **^4.4.2**

- [#328](https://github.com/shopware/frontends/pull/328) [`a75617f`](https://github.com/shopware/frontends/commit/a75617f4104f7e66599aa5341e46759bb9d414c9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vite_ from **^4.4.2** to **^4.4.4**
