# Vendored Amazon Pay API SDK

This directory contains a vendored copy of `@amazonpay/amazon-pay-api-sdk-nodejs`
version `2.3.4`.

The SDK is vendored in this example because the published package is currently
out of date and brings vulnerable dependencies. The example keeps control over
the installed runtime dependencies in its own `package.json` instead of
installing the package from npm.

Once the upstream package is updated and no longer brings vulnerable
dependencies, remove this vendored copy and restore the npm dependency.

The upstream license and notice files are preserved in this directory.
