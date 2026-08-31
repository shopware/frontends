---
"@shopware/composables": minor
---

Add `createDraftQuoteVersion` and `deleteDraftQuoteVersion` to `useB2bQuoteManagement`.

Quote write operations such as `declineQuoteWithComment` expect the identifier of a temporary storefront draft version, not the `versionId` property of the quote entity. `createDraftQuoteVersion` wraps `POST /quote/{id}/draft-version` and returns that identifier, throwing when the API responds without one; `deleteDraftQuoteVersion` discards the draft again.

```ts
const { createDraftQuoteVersion, declineQuoteWithComment } =
  useB2bQuoteManagement();

const versionId = await createDraftQuoteVersion(quoteId);

await declineQuoteWithComment(quoteId, {
  comment: "Too expensive",
  lineItemId,
  versionId,
});
```
