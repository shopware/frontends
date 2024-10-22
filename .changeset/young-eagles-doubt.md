---
"@shopware/api-client": patch
---

Don't send Content-Type in case of [multipart/form-data](https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html).

- Ignore `Content-Type` header in browser context when `multipart/form-data` is set.
- _boundary_ is set by a browser automatically.

```ts
// example

const formData = new FormData();
formData.append("file", file);
const addedMediaResponse = await apiClient.invoke(
  "uploadImage post /images/upload",
  {
    headers: {
      "Content-Type": "multipart/form-data", // <-- set this one
    },
    accept: "application/json",
    body: formData,
  },
);
```

When `invoke` method of api-client gets the `headers` parameter containing `multipart/form-data` Content-Type - the header will be ignored and the responsibility will be handed over to the browser - so the `Content-Type=multipart/form-data` header will eventually be sent, but including a dynamic _boundary_ params added by the browser on the fly.
