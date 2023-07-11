import {
  newsletterSubscribe as newsletterSubscribeAPI,
  newsletterUnsubscribe as newsletterUnsubscribeAPI,
  isNewsletterSubscriber as isNewsletterSubscriberAPI,
} from "@shopware-pwa/api-client";
import { NewsletterInput } from "@shopware-pwa/types";
import { useShopwareContext, useInternationalization } from ".";
import { ref, computed, ComputedRef, Ref } from "vue";

export type UseNewsletterReturn = {
  /**
   * Subscribes the user to the newsletter
   * @param params {@link NewsletterInput}
   */
  newsletterSubscribe(params: NewsletterInput): Promise<void>;
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
  newsletterStatus: Ref<NewsletterStatus>;
  /**
   * Inform about newsletter confirmation
   */
  confirmationNeeded: ComputedRef<boolean>;
};

const enum NewsletterStatus {
  NOT_SET = "notSet",
  DIRECT = "direct",
  UNDEFINED = "undefined",
  OPT_OUT = "optOut",
  OPT_IN = "optIn",
}

/**
 * Composable for newsletter subscription.
 * @public
 * @category Customer & Account
 */
export function useNewsletter(): UseNewsletterReturn {
  const { apiInstance } = useShopwareContext();
  const { getStorefrontUrl } = useInternationalization();
  const newsletterStatus: Ref<NewsletterStatus> = ref(
    NewsletterStatus.UNDEFINED,
  );

  async function newsletterSubscribe(params: NewsletterInput) {
    return await newsletterSubscribeAPI(
      {
        ...params,
        storefrontUrl: getStorefrontUrl(),
      },
      apiInstance,
    );
  }

  async function newsletterUnsubscribe(email: string) {
    return await newsletterUnsubscribeAPI(
      {
        email,
      },
      apiInstance,
    );
  }

  async function getNewsletterStatus() {
    try {
      const response = await isNewsletterSubscriberAPI(apiInstance);
      newsletterStatus.value = response.status as NewsletterStatus;
    } catch (error) {
      console.error(error);
    }
  }

  const isNewsletterSubscriber = computed(
    () =>
      ![NewsletterStatus.OPT_OUT, NewsletterStatus.UNDEFINED].includes(
        newsletterStatus.value,
      ),
  );

  const confirmationNeeded = computed(
    () => newsletterStatus.value === NewsletterStatus.NOT_SET,
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
