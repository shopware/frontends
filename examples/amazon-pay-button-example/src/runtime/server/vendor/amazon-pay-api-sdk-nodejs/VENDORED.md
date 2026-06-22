# Vendored Amazon Pay API SDK

This directory contains the runtime source files required from
`@amazonpay/amazon-pay-api-sdk-nodejs` version `2.3.4`.

The SDK is vendored in this example because the published package is currently
out of date and brings vulnerable dependencies. The example keeps control over
the installed runtime dependencies in its own `package.json` instead of
installing the package from npm.

The runtime files used by the example are:

- `src/client.js`
- `src/client.d.ts`
- `src/clientHelper.js`
- `src/constants.js`

The upstream test files are kept to preserve the SDK's test coverage for the
vendored source.

Once the upstream package is updated and no longer brings vulnerable
dependencies, remove this vendored copy and restore the npm dependency.

The upstream license and notice files are preserved in this directory.
