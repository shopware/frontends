---
"@shopware-pwa/composables-next": minor
---

# Fix setCurrentFilters

Body **before** when you use setCurrentFilters:

```
{
  "limit":10,
  "search":"",
  "p":"1",
  "navigationId":"018db20234207be8948e3a4b46501435",
  "manufacturer":"",
  "price": {"min":0,"max":0},
  "rating": null,
  "shipping-free":false,
  "properties":"",
  "code":"manufacturer",  // 👈 Not like this
  "value":"018d35f5b5757076adea38044bb96937" // 👈 Not like this
}
```

Body **after** the code changes with fixed setCurrentFilters:

```
{
  "limit":10,
  "search":"",
  "p":"1",
  "navigationId":"018db20234207be8948e3a4b46501435",
  "manufacturer":"018d35f5b5757076adea38044bb96937",  // 👈 where the filter value should go
  "price": {"min":0,"max":0},
  "rating": null,
  "shipping-free":false,
  "properties":"",
}
```
