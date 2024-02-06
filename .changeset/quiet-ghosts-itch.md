---
"@shopware/api-gen": minor
---

Added `apiType` option in `loadSchema` command. With `SHOPWARE_ADMIN_USERNAME` and `SHOPWARE_ADMIN_PASSWORD` env variables we can now authorize Admin API schema.

example:

```bash
# load schema from store API
pnpx @shopware/api-gen loadSchema --apiType=store --filename=storeApiSchema.json

# load schema from admin API
pnpx @shopware/api-gen loadSchema --apiType=admin --filename=adminApiSchema.json
```
