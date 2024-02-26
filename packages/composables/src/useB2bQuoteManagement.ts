import { useShopwareContext } from "#imports";
import type { Schemas } from "#shopware";

type UseB2bQuoteManagement = {
  getQuoteList: () => Promise<Schemas["Quote"][]>;
};

export function useB2bQuoteManagement(): UseB2bQuoteManagement {
  const { apiClient } = useShopwareContext();

  const getQuoteList = async () => {
    const response = await apiClient.invoke("readQuotes post /quotes", {});
    return response?.elements ?? [];
  };

  return { getQuoteList };
}
