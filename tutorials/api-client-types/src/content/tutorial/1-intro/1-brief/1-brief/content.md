---
type: lesson
title: Overview
editor: false
terminal: false
previews: false
---



# Behold, a first tutorial for @shopware/api-client!

This place was created as a supplement for [README.md](https://frontends.shopware.com/packages/api-client.html) of [@shopware/api-client](https://www.npmjs.com/package/@shopware/api-client) package.  

The next chapters will try to clarify the key features of what _api-client_ provides and what role the [@shopware/api-gen](https://www.npmjs.com/package/@shopware/api-gen) helper lib has in the whole setup.

The **@shopware/api-client** itself can be described as: 
> _Dynamic and fully typed API Client for Shopware 6. Usable in any JavaScript and TypeScript project. You can use types generated from your custom API instance to have autocompletion and type safety._ 

Which means that you can install it either for the browser and node.js environment. You don't have to take care of types coming from your custom Shopware 6 instance (backend) because it can be synchronized by using a built-in CLI tool. Thanks to being fully typed, there is a very limited chance to make a mistake, also lacking documentation is not really needed in that case.

## Covered topics:
- Intro <-- you are here
- Installation
- Configuration
- Syncing types
- Overriding types
- Good practices
- Troubleshooting

```json add={13-14}
{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.2.0",
    "@shopware/api-client": "1.0.2",
    "@shopware/api-gen": "1.0.5"
  }
}

```