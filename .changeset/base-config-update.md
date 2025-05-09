---
"@shopware/api-client": minor
---

Added new methods to manage API client base configuration:

- `updateBaseConfig`: Allows updating baseURL and accessToken in a single call
- `getBaseConfig`: Returns current baseURL and accessToken values

This change replaces the previous `updateBaseUrl` method with a more flexible configuration management system that can be extended in the future.
