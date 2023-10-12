import { useUser as swUseUser } from "@shopware-pwa/composables-next/composables";

export const useUser = () => {
  console.error("hello new useuser", !!useSessionContext);
  const useUserData = swUseUser();
  const { devStorefrontUrl } = useShopwareContext();

  const register = (params: unknown) => {
    console.warn("useUSerData.devStorefrontUrl", devStorefrontUrl.value);
    return useUserData.register(params as any);
  };

  return {
    ...useUserData,
    register,
    // ...useUserAddress(),
    // ...useUserOrders(),
    // ...
  };
};
