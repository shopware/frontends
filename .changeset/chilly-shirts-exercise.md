---
"@shopware/api-client": patch
---

Query param arrays. This fixes the way how query params are serialized. Previously, array query params were serialized as `?ids=1&ids=2`, now they are serialized as `?ids[]=1&ids[]=2`. This is the proper way of serialization in the Shopware API.
The definition of the endpoints hasn't changed, so you don't need to change anything in your code.
