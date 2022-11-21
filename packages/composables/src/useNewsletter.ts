import {
  newsletterSubscribe as newsletterSubscribeAPI,
  newsletterUnsubscribe as newsletterUnsubscribeAPI,
  isNewsletterSubscriber as isNewsletterSubscriberAPI,
} from "@shopware-pwa/api-client";
import { NewsletterInput } from "@shopware-pwa/types";
import { useShopwareContext, useInternationalization } from ".";

export type UseNewsletterReturn = {
  newsletterSubscribe: (params: NewsletterInput) => Promise<void>;
  newsletterUnsubscribe: (email: string) => Promise<void>;
  isNewsletterSubscriber: () => Promise<any>;
};

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
