---
type: lesson
title: About
editor: false
terminal: false
previews: false
---

# About

The previous chapter covers the case when it comes to deal with a default API instance which means:
- The definitions are bound to the latest version of Shopware 6 deployed for our Demo site
- There aren't any additional 3rd party plugins installed
- API Client in that configuration works as expected and can be a single source of truth only for that specific instance

In the real project, the instance and its configuration can vary. 

In that case there is a tailored tool which helps to synchronize the types (operations and entities' definitions) with your _Client_ frontend app  [@shopware/api-gen](https://www.npmjs.com/package/@shopware/api-gen).

## `@shopware/api-gen` comes to the rescue

According to the [docs](https://www.npmjs.com/package/@shopware/api-gen), the CLI tool enables you to:

- fetch the OpenAPI Schema definition present in your very own Shopware 6 instance
- validate the schema against its usefulness in terms of further work
- generate the TypeScript types that will be used by _API Client_.

## Available commands

- `generate`

Transform OpenAPI specification from JSON file to Typescript schemas. Use loadSchema command first.

- `loadSchema`

Load OpenAPI specification from Shopware instance and save it to JSON file.

- `validateJson`

This command allow to validate the output JSON file of your instance. You can configure which rules should be applied, we provide you with the schema configuration file, so you can easily modify it.

--- 
Let's see it in action!