import {
  newsletterSubscribe as newsletterSubscribeAPI,
  newsletterUnsubscribe as newsletterUnsubscribeAPI,
  isNewsletterSubscriber as isNewsletterSubscriberAPI,
} from "@shopware-pwa/api-client";
import { NewsletterInput } from "@shopware-pwa/types";
import { useShopwareContext, useInternationalization } from ".";

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
   * Indicates if the user is subscribed to the newsletter
   *
   * Returns `true` if the user is subscribed to the newsletter, `false` otherwise
   */
  isNewsletterSubscriber(): Promise<any>;
};

/**
 * Composable for newsletter subscription.
 * @public
 * @category Customer & Account
 */
export function useNewsletter(): UseNewsletterReturn {
  const { apiInstance } = useShopwareContext();
  const { getStorefrontUrl } = useInternationalization();

  async function newsletterSubscribe(params: NewsletterInput) {
    return await newsletterSubscribeAPI(
      {
        ...params,
        storefrontUrl: getStorefrontUrl(),
      },
      apiInstance
    );
  }

  async function newsletterUnsubscribe(email: string) {
    return await newsletterUnsubscribeAPI(
      {
        email,
      },
      apiInstance
    );
  }

  async function isNewsletterSubscriber() {
    const response = await isNewsletterSubscriberAPI(apiInstance);
    return response.status !== "optOut";
  }

  return {
    newsletterSubscribe,
    newsletterUnsubscribe,
    isNewsletterSubscriber,
  };
}
