import { useUser as swUseUser } from "@shopware-pwa/composables-next";

export const useUser = () => {
  const useUserData = swUseUser();

  // here you can experiment with overriding the default composable

  return {
    ...useUserData,
  };
};
