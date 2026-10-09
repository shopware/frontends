"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import type { ApiClient } from "#shopware";

export type GetShopwareClient = () => Promise<ApiClient>;

async function missingShopwareClient(): Promise<ApiClient> {
  throw new Error(
    "[Shopware] No browser client is provided. Mount <ShopwareClientProvider getClient={...}>.",
  );
}

const ShopwareClientContext = createContext<GetShopwareClient>(
  missingShopwareClient,
);

export function ShopwareClientProvider({
  getClient,
  children,
}: {
  getClient: GetShopwareClient;
  children: ReactNode;
}) {
  return (
    <ShopwareClientContext value={getClient}>{children}</ShopwareClientContext>
  );
}

export function useShopwareClient(): GetShopwareClient {
  return useContext(ShopwareClientContext);
}
