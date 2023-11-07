---
"@shopware/api-client": patch
---

`invoke` method parameters are no longer mandatory when no parameters are defined inside route.

Now instead of:

```ts
const result = await apiInstance.invoke("readContext get /context", {});
```

you can do:

```ts
const result = await apiInstance.invoke("readContext get /context");
```
