"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { readOrderDetails } from "./ordersApi";
import type { OrderDetails } from "./ordersApi";

export type OrderDetailsState =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "error" }
  | { status: "ready"; details: OrderDetails };

export type UseOrderDetailsResult = {
  state: OrderDetailsState;
  reload(): Promise<void>;
};

export function useOrderDetails(
  orderId: string,
  initial: OrderDetails | null = null,
): UseOrderDetailsResult {
  const getClient = useShopwareClient();
  const [state, setState] = useState<OrderDetailsState>(() =>
    initial ? { status: "ready", details: initial } : { status: "loading" },
  );
  const latestRequest = useRef(0);
  const hasDetails = useRef(initial !== null);

  const fetchDetails = useCallback(
    async (request: number): Promise<void> => {
      try {
        const client = await getClient();
        const details = await readOrderDetails(client, orderId);
        if (request !== latestRequest.current) return;
        if (details) {
          hasDetails.current = true;
          setState({ status: "ready", details });
        } else if (!hasDetails.current) {
          setState({ status: "notFound" });
        }
      } catch (error) {
        if (request !== latestRequest.current) return;
        console.error("[Account] reading the order failed", error);
        if (!hasDetails.current) setState({ status: "error" });
      }
    },
    [getClient, orderId],
  );

  const reload = useCallback((): Promise<void> => {
    const request = ++latestRequest.current;
    if (!hasDetails.current) setState({ status: "loading" });
    return fetchDetails(request);
  }, [fetchDetails]);

  const shouldLoad = initial === null;

  useEffect(() => {
    if (!shouldLoad) return;
    const request = ++latestRequest.current;
    void fetchDetails(request);
  }, [shouldLoad, fetchDetails]);

  return { state, reload };
}
