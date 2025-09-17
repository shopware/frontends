---
"@shopware/api-client": minor
---

Added helper to support encoded `_criteria` field in GET query parameters.
Context information: https://github.com/shopware/shopware/issues/12388

This helper is available under the `@shopware/api-client/helpers` import path.

```typescript
import { encodeForQuery } from "@shopware/api-client/helpers";

const criteria = {
  page: 1,
  limit: 10,
  ...
}

const encodedCriteria = encodeForQuery(criteria);

const result = await apiClient.invoke("getProducts get /product", {
  query: {
    _criteria: encodedCriteria,
  },
});
```