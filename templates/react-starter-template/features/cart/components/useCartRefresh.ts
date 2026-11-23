"use client";

import { useCallback, useRef } from "react";

import type { CartReadResult } from "@/features/cart/types";
import { useCart } from "@/features/cart/useCart";

import { useCartNotifier } from "./useLineItemActions";

export function useCartRefresh(): () => Promise<CartReadResult> {
  const { refreshWithResult } = useCart();
  const report = useCartNotifier();
  const reported = useRef<CartReadResult | null>(null);

  return useCallback(async () => {
    const read = await refreshWithResult();
    if (read?.ok && reported.current !== read) {
      reported.current = read;
      report({ ok: true, errors: read.newErrors });
    }
    return read;
  }, [refreshWithResult, report]);
}
