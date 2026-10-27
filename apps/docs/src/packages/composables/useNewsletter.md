# useNewsletter

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#customer--account"><div class="bg-red">Customer & Account</div></a>
</div>

Composable for newsletter subscription.





## Types


```ts
export function useNewsletter(): UseNewsletterReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNewsletter/useNewsletter.ts#L58" target="_blank">source code</a>



```ts
export type UseNewsletterReturn = {
  /**
   * Subscribes the user to the newsletter
   * @param params {@link operations['subscribeToNewsletter post /newsletter/subscribe']['body']}
   */
  newsletterSubscribe(
    params: Omit<
      operations["subscribeToNewsletter post /newsletter/subscribe"]["body"],
      "storefrontUrl"
    >,
  ): Promise<
    operations["subscribeToNewsletter post /newsletter/subscribe"]["response"]
  >;
  /**
   * Removes the email from the newsletter
   * @param email
   */
  newsletterUnsubscribe(email: string): Promise<void>;
  /**
   * Get newsletter status from the API call
   */
  getNewsletterStatus(): Promise<Schemas["AccountNewsletterRecipient"]>;
  /**
   * Indicates if the user is subscribed to the newsletter
   *
   * Returns `true` if the user is subscribed to the newsletter, `false` otherwise
   */
  isNewsletterSubscriber: ComputedRef<boolean>;
  /**
   * Newsletter status
   */
  newsletterStatus: Ref<Schemas["AccountNewsletterRecipient"]["status"]>;
  /**
   * Inform about newsletter confirmation
   */
  confirmationNeeded: ComputedRef<boolean>;
  /**
   * Subscribe key
   */
  SUBSCRIBE_KEY: string;
  /**
   * Unsubscribe key
   */
  UNSUBSCRIBE_KEY: string;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNewsletter/useNewsletter.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>
