---
"@shopware/api-gen": minor
---

`validateJson` command now checks endpoints exposed by the API to show if there are any endpoints missing in the schema or the schema contains some endpoints definitions, which are not exposed by the backend instance

tun it in the console like this:

```bash
shopware-api-gen validateJson --apiType=store

shopware-api-gen validateJson --apiType=admin
```

You need to have the same .env variables as needed for `loadSchema` command as the CLI is checking endpoints against the running instance.
