# useSessionContext

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#context--language"><div class="bg-red">Context & Language</div></a>
</div>

Composable for session management.
SessionContext contain all related data like user, currency, country, shippingMethod, paymentMethod etc.





## Types


```ts
export function useSessionContext(
  newContext?: Schemas["SalesChannelContext"],
): UseSessionContextReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useSessionContext/useSessionContext.ts#L128" target="_blank">source code</a>



```ts
export type UseSessionContextReturn = {
  /**
   * Patches the context in order to use new language
   */
  setLanguage(language: Partial<Schemas["Language"]>): Promise<void>;
  /**
   * Patches the context in order to use new countryId
   *
   * @param {string} countryId
   */
  setCountry(countryId: string): Promise<void>;
  /**
   * current context's language
   */
  sessionContext: ComputedRef<Schemas["SalesChannelContext"] | undefined>;
  /**
   * Fetches the session context and assigns the result to the `sessionContext` property
   *
   * Throws when the context cannot be loaded. Callers that depend on a verified
   * context switch, such as logout or checkout flows, should block progression
   * when this fails.
   */
  refreshSessionContext(): Promise<void>;
  /**
   * current context's language
   */
  selectedShippingMethod: ComputedRef<Schemas["ShippingMethod"] | null>;
  /**
   * Patches the context in order to use new shipping method
   */
  setShippingMethod(
    shippingMethod: Partial<Schemas["ShippingMethod"]>,
  ): Promise<void>;
  /**
   * current context's payment method
   */
  selectedPaymentMethod: ComputedRef<Schemas["PaymentMethod"] | null>;
  /**
   * Patches the context in order to use new payment method
   */
  setPaymentMethod(paymentMethod: { id: string }): Promise<void>;
  /**
   * current context's currency
   */
  currency: ComputedRef<Schemas["Currency"] | null>;
  /**
   * Patches the context in order to use new currency
   */
  setCurrency(currency: Partial<Schemas["Currency"]>): Promise<void>;
  /**
   * current context's shipping address
   */
  activeShippingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
  /**
   * Patches the context in order to use new shipping address
   */
  setActiveShippingAddress(
    address: Partial<Schemas["CustomerAddress"]>,
  ): Promise<void>;
  /**
   * current context's billing address
   */
  activeBillingAddress: ComputedRef<Schemas["CustomerAddress"] | null>;
  /**
   * current context's tax state
   */
  taxState: ComputedRef<string | undefined>;
  /**
   * Patches the context in order to use new billing address
   */
  setActiveBillingAddress(
    address: Partial<Schemas["CustomerAddress"]>,
  ): Promise<void>;
  /**
   * Patches the context with new context
   */
  setContext(context: Schemas["SalesChannelContext"]): void;
  /**
   * current context's country id
   */
  countryId: ComputedRef<string | undefined>;
  /**
   * current sales channel country id
   */
  salesChannelCountryId: ComputedRef<string | undefined>;
  /**
   * @deprecated use salesChannelLanguageId instead
   * sales channel language id
   */
  languageId: ComputedRef<string | undefined>;
  /**
   * sales channel language code
   */
  salesChannelLanguageId: ComputedRef<string | undefined>;
  /**
   * @deprecated use currentLanguageId instead
   * current language id chain
   */
  languageIdChain: ComputedRef<string>;
  /**
   * current language code
   */
  currentLanguageId: ComputedRef<string | undefined>;
  /**
   * Locale code of the active language (e.g. `"en-GB"`), read from the
   * context's `languageInfo`. Available from the session context alone — no
   * separate language list request is required to detect the current locale.
   */
  currentLocaleCode: ComputedRef<string | undefined>;
  /**
   * current context's customer object
   */
  userFromContext: ComputedRef<Schemas["Customer"] | undefined | null>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useSessionContext/useSessionContext.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
