---
"@shopware/api-client": major
---

Removed deprecations from the code:

- `onContextChanged` function inside `createAPIClient` method. Use `apiClient.hook("onContextChanged", ...)` instead.
- `apiType` flag from the `createAPIClient`. Use separate methods to create store and admin api clients
- `onAuthChange` from the `createAdminAPIClient`. Use `adminApiClient.hook('onAuthChange',...)` instead
