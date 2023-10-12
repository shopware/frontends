import { useInternationalization as swUseInternationalization } from "@shopware-pwa/composables-next/composables";

export const useInternationalization = () => {
  const useUserData = swUseInternationalization();

  return {
    ...useUserData,
    getStorefrontUrl: () => "https://wp.pl/post",
    // ...useUserAddress(),
    // ...useUserOrders(),
    // ...
  };
};
