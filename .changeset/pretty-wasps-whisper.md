---
"@shopware/api-client": minor
---

Predefining methods: exported `RequestReturnType ` and `RequestParameters` types. You can now create predefined methods:

```typescript
const readCart = (params: RequestParameters<"readCart", operations>) =>
  apiInstance.invoke("readCart get /checkout/cart?name", params);
```
