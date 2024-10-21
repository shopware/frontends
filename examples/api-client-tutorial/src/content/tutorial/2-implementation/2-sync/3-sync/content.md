---
type: lesson
title: Synchronization
editor: true
previews: false
terminal: false
focus: "/.env"
---

# Synchronization

Now, once the OpenAPI Schema is fetched 

## Prepare space for your types

Create a subdirectory `api-types` in your project's root dir.

## Load external schema

Run `loadSchema --apiType=store`:

```bash
npx @shopware/api-gen loadSchema --apiType=store
```

After that, you should see `storeApiSchema.json` file landed in `./api-types/storeApiSchema.json` 

**See the tutorial's editor and click `Solve`**

---

## Troubleshooting

#### Missing OPENAPI_ACCESS_KEY env variables.

```bash
npx @shopware/api-gen loadSchema --apiType=store


Missing OPENAPI_ACCESS_KEY env variables.

Check whether the .env file is created.
```

Reason: `.env` file not created or placed in the other directory.

**Solution: See previous lesson about configuration and try again.**

#### Error while loading OpenAPI schema JSON file. Checkout your .env file and try again.

```bash
Error: ENOENT: no such file or directory, open
```

Reason: The CLI tool tries to fetch the OpenAPI Schema json into subdirectory of working dir in `./api-types` but the folder does not exist.

**Solution: Create `./api-types` dir in your project root dir.**