# useB2bQuoteManagement

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#b2b"><div class="bg-red">B2B</div></a>
</div>

Composable to manage quotes in the B2BQuote module.

With this composable you can:
- Get list of quotes
- Get quote details
- Create and delete a storefront draft version of the quote
- Decline quote, with or without a line item comment
- Request change of the quote
- Change shipping method
- Change payment method
- Create order from quote
- Request quote





## Types


```ts
export function useB2bQuoteManagement(): UseB2bQuoteManagement 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useB2bQuoteManagement/useB2bQuoteManagement.ts#L80" target="_blank">source code</a>



```ts
export type DeclineQuoteParams = {
  /** Message content */
  comment: string;
  /** Identifier of the quote line item that owns the new comment */
  lineItemId: string;
  /**
   * Draft version identifier of the quote currently shown in storefront,
   * as returned by `createDraftQuoteVersion`. This is not the `versionId`
   * property of the quote entity.
   */
  versionId: string;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useB2bQuoteManagement/useB2bQuoteManagement.ts#L44" target="_blank">source code</a>

```ts
export type ChangePaymentShippingMethodParams = {
  quoteId: string;
  paymentMethodId?: string;
  shippingMethodId?: string;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useB2bQuoteManagement/useB2bQuoteManagement.ts#L57" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
