import { useUser as swUseUser } from "@shopware/composables";

export const useUser = () => {
  const useUserData = swUseUser();

  // here you can experiment with overriding the default composable

  return {
    ...useUserData,
  };
};
