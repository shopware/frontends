---
"@shopware/composables": minor
---

Add `declineQuoteWithComment` to `useB2bQuoteManagement`, following the Store API `POST /quote/{id}/decline` schema, which as of `6.7.12` also carries `lineItemId` and `versionId` next to `comment`.

`declineQuote` keeps its `(quoteId, comment)` signature and is deprecated. It will be removed in the next major.

```ts
const { declineQuoteWithComment, createDraftQuoteVersion } =
  useB2bQuoteManagement();

const versionId = await createDraftQuoteVersion(quoteId);

await declineQuoteWithComment(quoteId, {
  comment: "Too expensive",
  lineItemId,
  versionId,
});
```
