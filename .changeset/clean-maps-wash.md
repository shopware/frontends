---
"@shopware/api-client": minor
---

We're exposing `fetchOptions` inside params of `invoke` method. You can now use `ofetch` features like `timeout` or `signal` with AbortController

Example for the AbortController:

```ts
const controller = new AbortController();

const request = client.invoke("readContext get /context", {
  fetchOptions: {
    signal: controller.signal,
  },
});

controller.abort(); // At this point client will throw an error with the information, that the request has been cancelled
```
