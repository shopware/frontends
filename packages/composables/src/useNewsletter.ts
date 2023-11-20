import { useShopwareContext, useInternationalization } from "#imports";
import { ref, computed } from "vue";
import type { ComputedRef, Ref } from "vue";
import { RequestParameters, Schemas } from "#shopware";

export type UseNewsletterReturn = {
  /**
   * Subscribes the user to the newsletter
   * @param params {@link RequestParameters<"subscribeToNewsletter">}
   */
  newsletterSubscribe(
    params: Omit<RequestParameters<"subscribeToNewsletter">, "storefrontUrl">,
  ): Promise<void>;
  /**
   * Removes the email from the newsletter
   * @param email
   */
  newsletterUnsubscribe(email: string): Promise<void>;
  /**
   * Get newsletter status from the API call
   */
  getNewsletterStatus(): Promise<void>;
  /**
   * Indicates if the user is subscribed to the newsletter
   *
   * Returns `true` if the user is subscribed to the newsletter, `false` otherwise
   */
  isNewsletterSubscriber: ComputedRef<boolean>;
  /**
   * Newsletter status
   */
  newsletterStatus: Ref<Schemas["NewsletterStatus"]["status"]>;
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
    ref<Schemas["NewsletterStatus"]["status"]>("undefined");

  async function newsletterSubscribe(
    params: Omit<RequestParameters<"subscribeToNewsletter">, "storefrontUrl">,
  ) {
    return await apiClient.invoke(
      "subscribeToNewsletter post /newsletter/subscribe",
      {
        ...params,
        storefrontUrl: getStorefrontUrl(),
      },
    );
  }

  async function newsletterUnsubscribe(email: string) {
    return await apiClient.invoke(
      "unsubscribeToNewsletter post /newsletter/unsubscribe",
      {
        email,
      },
    );
  }

  async function getNewsletterStatus() {
    try {
      const response = await apiClient.invoke(
        "readNewsletterRecipient post /account/newsletter-recipient",
        {},
      );
      newsletterStatus.value = response.status;
    } catch (error) {
      console.error(error);
    }
  }

  const isNewsletterSubscriber = computed(
    () =>
      !(
        ["optOut", "undefined"] as Array<Schemas["NewsletterStatus"]["status"]>
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
