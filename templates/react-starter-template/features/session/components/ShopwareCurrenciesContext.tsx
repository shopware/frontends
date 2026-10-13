"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import type { CurrencyOption } from "../currencyOptions";

type LoadCurrencies = () => Promise<CurrencyOption[]>;

type ShopwareCurrencies = {
  currencies: CurrencyOption[];
  load: LoadCurrencies;
};

const NO_CURRENCIES: CurrencyOption[] = [];

const ShopwareCurrenciesContext = createContext<ShopwareCurrencies>({
  currencies: NO_CURRENCIES,
  load: async () => NO_CURRENCIES,
});

export function ShopwareCurrenciesProvider({
  currencies,
  load,
  children,
}: {
  currencies: CurrencyOption[];
  load: LoadCurrencies;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ currencies, load }), [currencies, load]);
  return (
    <ShopwareCurrenciesContext value={value}>
      {children}
    </ShopwareCurrenciesContext>
  );
}

export function useShopwareCurrencies(): CurrencyOption[] {
  return useContext(ShopwareCurrenciesContext).currencies;
}

export function useLoadShopwareCurrencies(): LoadCurrencies {
  return useContext(ShopwareCurrenciesContext).load;
}
