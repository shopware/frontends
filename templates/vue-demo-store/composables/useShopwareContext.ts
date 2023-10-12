import { useShopwareContext as swUseShopwareContext } from "@shopware-pwa/composables-next/composables";

export const useShopwareContext = () => {
  console.error("new useShopwareContext", !!useShopwareContext);
  const useUserData = swUseShopwareContext();

  return {
    ...useUserData,
    devStorefrontUrl: computed(() => "https://wp.pl/post"),
    // ...useUserAddress(),
    // ...useUserOrders(),
    // ...
  };
};
