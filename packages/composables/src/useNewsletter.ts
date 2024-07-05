import { useShopwareContext, useInternationalization } from "#imports";
import { ref, computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { Schemas, operations } from "#shopware";

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
  ): Promise<void>;
  /**
   * Removes the email from the newsletter
   * @param email
   */
  newsletterUnsubscribe(email: string): Promise<void>;
  /**
   * Get newsletter status from the API call
   */
  getNewsletterStatus(): Promise<Schemas["AccountNewsletterRecipientResult"]>;
  /**
   * Indicates if the user is subscribed to the newsletter
   *
   * Returns `true` if the user is subscribed to the newsletter, `false` otherwise
   */
  isNewsletterSubscriber: ComputedRef<boolean>;
  /**
   * Newsletter status
   */
  newsletterStatus: Ref<Schemas["AccountNewsletterRecipientResult"]["status"]>;
  /**
   * Inform about newsletter confirmation
   */
  confirmationNeeded: ComputedRef<boolean>;
};

/**
 * Composable for newsletter subscription.
 * @public
 * @category Customer & Account
 */
export function useNewsletter(): UseNewsletterReturn {
  const { apiClient } = useShopwareContext();
  const { getStorefrontUrl } = useInternationalization();
  const newsletterStatus =
    ref<Schemas["AccountNewsletterRecipientResult"]["status"]>("undefined");

  async function newsletterSubscribe(
    params: Omit<
      operations["subscribeToNewsletter post /newsletter/subscribe"]["body"],
      "storefrontUrl"
    >,
  ) {
    const result = await apiClient.invoke(
      "subscribeToNewsletter post /newsletter/subscribe",
      {
        body: {
          ...params,
          storefrontUrl: getStorefrontUrl(),
        },
      },
    );
    return result.data;
  }

  async function newsletterUnsubscribe(email: string) {
    await apiClient.invoke(
      "unsubscribeToNewsletter post /newsletter/unsubscribe",
      {
        body: { email },
      },
    );
  }

  async function getNewsletterStatus() {
    const response = await apiClient.invoke(
      "readNewsletterRecipient post /account/newsletter-recipient",
    );
    newsletterStatus.value = response.data.status;
    return response.data;
  }

  const isNewsletterSubscriber = computed(
    () =>
      !(
        ["optOut", "undefined"] as Array<
          Schemas["AccountNewsletterRecipientResult"]["status"]
        >
      ).includes(newsletterStatus.value),
  );

  const confirmationNeeded = computed(
    () => newsletterStatus.value === "notSet",
  );

  return {
    newsletterSubscribe,
    newsletterUnsubscribe,
    isNewsletterSubscriber,
    getNewsletterStatus,
    newsletterStatus,
    confirmationNeeded,
  };
}
