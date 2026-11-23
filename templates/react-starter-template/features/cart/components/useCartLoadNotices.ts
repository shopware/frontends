"use client";

import { useEffect, useRef } from "react";

import { toCartActionErrors } from "@/features/cart/cartErrors";
import { useCart } from "@/features/cart/useCart";

import { useCartNotifier } from "./useLineItemActions";

type Phase = "start" | "waiting" | "done";

export function useCartLoadNotices(): void {
  const { status, cart, refreshWithResult } = useCart();
  const report = useCartNotifier();
  const phase = useRef<Phase>("start");
  const run = useRef(0);

  useEffect(
    () => () => {
      phase.current = "start";
      run.current += 1;
    },
    [],
  );

  useEffect(() => {
    if (phase.current !== "start") return;
    if (status === "loading") {
      phase.current = "waiting";
      return;
    }
    phase.current = "done";
    const current = run.current;
    void refreshWithResult().then((read) => {
      if (read?.ok && run.current === current) {
        report({ ok: true, errors: read.errors });
      }
    });
  }, [status, refreshWithResult, report]);

  useEffect(() => {
    if (phase.current !== "waiting" || status !== "ready" || !cart) return;
    phase.current = "done";
    report({ ok: true, errors: toCartActionErrors(cart) });
  }, [status, cart, report]);
}
