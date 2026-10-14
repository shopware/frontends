"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Schemas } from "#shopware";
import { apiFailureSummary } from "@/features/session/apiErrors";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { listCheckoutAddresses } from "./checkoutApi";

export type CheckoutAddressListStatus = "idle" | "loading" | "ready" | "error";

export type CheckoutAddressList = {
  status: CheckoutAddressListStatus;
  addresses: Schemas["CustomerAddress"][];
  load: () => void;
};

type ListState = Omit<CheckoutAddressList, "load">;

export function useCheckoutAddresses(): CheckoutAddressList {
  const getClient = useShopwareClient();
  const [state, setState] = useState<ListState>({
    status: "idle",
    addresses: [],
  });
  const shown = useRef(0);
  const readWhileShown = useRef(-1);
  const latest = useRef(0);
  const inFlight = useRef(false);

  useEffect(
    () => () => {
      shown.current += 1;
      inFlight.current = false;
    },
    [],
  );

  const load = useCallback(() => {
    if (inFlight.current || readWhileShown.current === shown.current) return;
    inFlight.current = true;
    latest.current += 1;
    const request = latest.current;
    const startedWhileShown = shown.current;
    setState((current) =>
      current.status === "ready" ? current : { ...current, status: "loading" },
    );
    void (async () => {
      try {
        const addresses = await listCheckoutAddresses(await getClient());
        if (request !== latest.current) return;
        inFlight.current = false;
        readWhileShown.current = startedWhileShown;
        setState({ status: "ready", addresses });
      } catch (error) {
        if (request !== latest.current) return;
        console.error(
          "[Checkout] reading the customer addresses failed",
          apiFailureSummary(error),
        );
        inFlight.current = false;
        setState((current) => ({ ...current, status: "error" }));
      }
    })();
  }, [getClient]);

  return { ...state, load };
}
