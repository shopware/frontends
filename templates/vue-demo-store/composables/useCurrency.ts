import { getAvailableCurrencies } from "@shopware-pwa/api-client";
import { Currency } from "@shopware-pwa/types";
import { computed, Ref, ComputedRef } from "vue-demi";

export interface IUseCurrency {
  fetchAvailableCurrencies: () => Promise<void>;
  setCurrency: (parameter: string) => Promise<void>;
  availableCurrencies: ComputedRef<Currency[]>;
  currentCurrency: ComputedRef<Currency | null>;
}

export function useCurrency(): IUseCurrency {
  const { apiInstance } = useShopwareContext();
  const _availableCurrencies: Ref<Currency[] | null> = useState(
    `availableCurrencies`,
    () => []
  );

  const { currency: currentCurrency, setCurrency: setContextCurrency } = useSessionContext();
  const availableCurrencies = computed(() => {
    if (_availableCurrencies.value?.length) {
      return _availableCurrencies.value;
    }
    return currentCurrency.value ? [currentCurrency.value] : [];
  });

  const fetchAvailableCurrencies = async (): Promise<void> => {
    const response = await getAvailableCurrencies(apiInstance);
    _availableCurrencies.value = response;
  };

  const setCurrency = async (currencyId: string): Promise<void> => {
    const current = availableCurrencies.value.find(x => x.id === currencyId);
    if (current) {
      try {
        await setContextCurrency(current);
        location.reload();
        // refreshCart();
      } catch (e) {
        console.error(
          "[useCurrency][setCurrency] Problem with currency change",
          e
        );
      }
    }
  };

  return {
    fetchAvailableCurrencies,
    setCurrency,
    availableCurrencies,
    currentCurrency,
  };
}
