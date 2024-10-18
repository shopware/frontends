---
type: lesson
title: What might go wrong
editor: false
terminal: false
previews: false
---

# About

So far so good. The previous chapter gave an overview on how to synchronize a backend Shopware 6 instance with the frontend application, _API Client_ to be more precise.


## The problem

Everything works as expected until you realize that some endpoint or entity definition is missing. 

There are many reasons of why that can be an issue here, most known issues are:
- 3rd party extensions installed
- Broken OpenAPI Schema
- Missing OpenAPI Schema in general

That leads to the problem we need to deal with: enable developers to make it works without accessing code in the backend.

### The Solution

Giving the possibility to override or replace some crucial parts of OpenAPI Schema is the tool that developers can work with. 

The toolset of `@shopware/api-gen` provides two options:
- adding an entirely new definition - that applies to operations and the schemas
- partial overriding - when it comes to change only a one field or add a new header to the request and so on.

--- 

Let's try to customize our types!
