import {
  newsletterSubscribe as newsletterSubscribeAPI,
  newsletterUnsubscribe as newsletterUnsubscribeAPI,
} from "@shopware-pwa/api-client";
import { NewsletterInput } from "@shopware-pwa/types";
import { useShopwareContext, useInternationalization } from ".";

export type UseNewsletterReturn = {
  newsletterSubscribe: (params: NewsletterInput) => Promise<void>;
  newsletterUnsubscribe: (email: string) => Promise<void>;
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

  return {
    newsletterSubscribe,
    newsletterUnsubscribe,
  };
}
