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

  const newsletterSubscribe = (params: NewsletterInput) => {
    return newsletterSubscribeAPI(
      {
        ...params,
        storefrontUrl: getStorefrontUrl(),
      },
      apiInstance
    );
  };

  const newsletterUnsubscribe = (email: string) => {
    return newsletterUnsubscribeAPI(
      {
        email,
      },
      apiInstance
    );
  };

  return {
    newsletterSubscribe,
    newsletterUnsubscribe,
  };
}
