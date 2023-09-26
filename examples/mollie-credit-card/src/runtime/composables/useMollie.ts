import { useNuxtApp } from "#imports";
import { CreateLocaleInstanceArgs } from "../../types";

/**
 * Composable function to initialize mollie instance and get payment session token
 */
export function useMollie(args: CreateLocaleInstanceArgs) {
  const { $mollie } = useNuxtApp();

  async function init() {
    $mollie.createMollieInstance(args);
  }

  async function getToken(): Promise<string | undefined> {
    const mollieResponse = await $mollie.mollieInstance?.createToken();
    if (mollieResponse?.error) {
      console.error(
        `[useMollieCreditCard][onMounted > createToken]: ${mollieResponse.error?.message}`,
      );
      throw mollieResponse.error?.message;
    }
    return mollieResponse?.token;
  }

  return {
    init,
    getToken,
  };
}
