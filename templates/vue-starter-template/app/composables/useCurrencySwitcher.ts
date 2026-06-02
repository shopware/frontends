import type { Schemas } from "#shopware";

type CurrencyListItem = {
  id: string;
  label: string;
};

function getCurrencyLabel(currency: Schemas["Currency"]): string {
  return currency.symbol
    ? `${currency.isoCode} (${currency.symbol})`
    : currency.isoCode;
}

export function useCurrencySwitcher() {
  const { apiClient } = useShopwareContext();
  const { currency: currentCurrency, setCurrency } = useSessionContext();
  const { refreshCart } = useCart();

  const changingCurrencyId = ref<string>();

  const { data: currenciesResponse } = useAsyncData(
    "storeCurrencies",
    async () => {
      const { data } = await apiClient.invoke("readCurrency post /currency", {
        body: {
          sort: [
            {
              field: "position",
              order: "ASC",
            },
            {
              field: "name",
              order: "ASC",
            },
          ],
        },
      });

      return data;
    },
  );

  const currencies = computed(
    () =>
      currenciesResponse.value?.filter(
        (currency): currency is Schemas["Currency"] => Boolean(currency?.id),
      ) ?? [],
  );

  const currenciesList = computed<CurrencyListItem[]>(() =>
    currencies.value.map((currency) => ({
      id: currency.id,
      label: getCurrencyLabel(currency),
    })),
  );

  const currentCurrencyId = computed(() => currentCurrency.value?.id || "");

  async function changeCurrency(currencyId: string) {
    if (currencyId === currentCurrency.value?.id || changingCurrencyId.value) {
      return;
    }

    const currency = currencies.value.find(
      (currency) => currency.id === currencyId,
    );

    if (!currency) {
      return;
    }

    try {
      changingCurrencyId.value = currencyId;
      await setCurrency(currency);
      await refreshCart();

      if (import.meta.client) {
        window.location.reload();
      }
    } finally {
      changingCurrencyId.value = undefined;
    }
  }

  return {
    currenciesList,
    currentCurrencyId,
    changingCurrencyId,
    changeCurrency,
  };
}
