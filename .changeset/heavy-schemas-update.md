---
"@shopware/api-client": minor
---

Regenerated the default Store API schema and types from `6.7.10.1` to `6.7.12.1`.

**[BREAKING]** Existing request bodies gained required fields, so calls that used to type-check now fail:

- `declineQuote` (`POST /quote/{id}/decline`) requires `comment`, `lineItemId` and `versionId`.
- `markMessagesAsReadInQuote` (`POST /quote/{id}/read-message`) requires `versionId`.

**[BREAKING]** Properties that were required are now optional, so reading them needs a null check: `defaultBillingAddressId` / `defaultShippingAddressId` on `B2bComponentsOrganization`, `id` on `BundleItem`, and `configuration` / `hash` / `templateId` on `SwagCustomizedProductsTemplateConfiguration`.

**[BREAKING]** The `SaasStorefrontDemoToken` schema is gone.

New endpoints (35 operations across 27 paths), available through `invoke` without extra typing:

- **B2B draft quotes** — read, edit and send a quote before it is requested: `deleteDraftQuote`, `createDraftQuoteVersion`, `saveDraftQuoteVersion`, `deleteDraftQuoteVersion`, `sendDraftQuoteRequest`, `addQuoteLineItem`, `editQuoteLineItem`, `patchEditQuoteLineItem`, `removeQuoteLineItem`, `deleteQuoteLineItem`, `readQuoteLineItems`, `readQuoteLineItemHistory`, `readQuoteDocuments`, `searchQuoteProducts`, `searchQuoteProductsGet`, `markQuoteHistoryAsSeen`, `replaceQuoteNotificationEmployees`, `replyMessageInQuote`, `editMessageInQuote`, `removeMessageInQuote`.
- **Employee context** — `getEmployeeContexts`, `getEmployeeContextsGet`, `switchEmployeeContext`, `cancelEmployeeContext`.
- **Customized products** — `addCustomizedProductToCart`, `reorderCustomizedProduct`, `uploadCustomizedProductCustomerFile`, `customizedProductConfigurationShare`, `readCustomProductsTemplates`, `readCustomProductsTemplateConfigurations`, `readCustomProductsTemplateOptions`, `readCustomProductsTemplateOptionValues`.
- **MCP** — `storeApiMcpPost`, `storeApiMcpDelete`, `storeApiMcpOptions` on `/_mcp`.

68 schemas were added, including `QuoteHistory`, `QuoteLineItemHistory`, `QuoteNotificationRecipient`, `EmployeeContext`, `B2bEmployeeAccount`, `SalesChannelFile`, the `SwagCustomizedProducts*` types and the PayPal agentic commerce types.
