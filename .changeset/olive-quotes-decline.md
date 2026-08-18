---
"@shopware/composables": minor
---

**[BREAKING]** `declineQuote` from `useB2bQuoteManagement` now takes a params object instead of a plain comment string, following the Store API `POST /quote/{id}/decline` schema, which requires `comment`, `lineItemId` and `versionId`.

Before:

```ts
declineQuote(quoteId, "Too expensive");
```

After:

```ts
declineQuote(quoteId, {
  comment: "Too expensive",
  lineItemId,
  versionId,
});
```
