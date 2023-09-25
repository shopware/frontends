import { getSessionContext } from "@shopware-pwa/api-client";
import { useShopwareContext } from "./useShopwareContext";

export async function useConnectionTest() {
  const { apiInstance } = useShopwareContext();
  try {
    await getSessionContext(apiInstance);
  } catch (e) {
    const error = e as {
      messages: {
        status: string;
        code: string;
        title: string;
        detail: string;
        meta: object;
      }[];
      statusCode: number;
    };

    if (error.statusCode === 412) {
      // setting a timeout here to ensure we are the last error message in terminal
      setTimeout(() => {
        console.error(
          "Looks like your API connection is not working. Check your nuxt configuration (shopwareEndpoint and shopwareAccessToken). 🤞",
        );
        console.error(
          "For more help ➡️  https://frontends.shopware.com/resources/troubleshooting.html",
        );
      }, 2.0 * 1000);
    } else {
      console.error("[useConnectionTest]", e);
    }
  }
}
