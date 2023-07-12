---
"@shopware/api-client": minor
---

Improved error handling. Api client now throws `ApiClientError` with detailed information about what went wrong with request.

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
