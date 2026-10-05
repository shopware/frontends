"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

import type { Schemas } from "#shopware";
import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";

import { handlePayment, readOrder } from "../checkoutApi";
import {
  PAYMENT_REDIRECT_DELAY_MS,
  parsePaymentUrl,
  paymentReturnUrls,
  redirectToPayment,
} from "../paymentRedirect";
import { OrderConfirmation } from "./OrderConfirmation";
import { SuccessSkeleton } from "./SuccessSkeleton";

const t = {
  checkout: {
    success: {
      continueShopping: "Continue shopping",
      loadError: "We could not load your order. Your session may have expired.",
    },
  },
};

type OrderLoad =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; order: Schemas["Order"] };

export type SuccessPageContentProps = {
  params: Promise<{ id: string }>;
};

export function SuccessPageContent({ params }: SuccessPageContentProps) {
  const { id } = use(params);
  return <OrderSuccess key={id} orderId={id} />;
}

function OrderSuccess({ orderId }: { orderId: string }) {
  const router = useRouter();
  const session = useSession();
  const getClient = useShopwareClient();
  const [orderLoad, setOrderLoad] = useState<OrderLoad>({ status: "loading" });
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const started = useRef(false);

  const isUserSession = session.isLoggedIn || session.isGuestSession;
  const anonymous = session.status === "ready" && !isUserSession;

  useEffect(() => {
    if (anonymous) router.replace("/");
  }, [anonymous, router]);

  useEffect(() => {
    if (session.status === "loading" || anonymous) return;
    if (started.current) return;
    started.current = true;

    async function load() {
      let client;
      let order: Schemas["Order"] | null;
      try {
        client = await getClient();
        order = await readOrder(client, orderId);
      } catch (error) {
        console.error("[Checkout] reading the order failed", error);
        setOrderLoad({ status: "error" });
        return;
      }
      if (!order) {
        setOrderLoad({ status: "error" });
        return;
      }
      setOrderLoad({ status: "ready", order });

      try {
        const { redirectUrl } = await handlePayment(client, {
          orderId,
          ...paymentReturnUrls(window.location.origin, orderId),
        });
        setPaymentUrl(parsePaymentUrl(redirectUrl));
      } catch (error) {
        console.error("[Checkout] handling the payment failed", error);
      }
    }

    void load();
  }, [session.status, anonymous, getClient, orderId]);

  useEffect(() => {
    if (!paymentUrl) return;
    const timer = setTimeout(() => {
      redirectToPayment(paymentUrl);
    }, PAYMENT_REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [paymentUrl]);

  if (orderLoad.status === "error") {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 text-center md:py-20">
        <p role="alert" className="mb-6 text-surface-on-surface">
          {t.checkout.success.loadError}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded bg-brand-primary px-4 py-3 text-center leading-6 font-bold text-brand-on-primary"
        >
          {t.checkout.success.continueShopping}
        </Link>
      </div>
    );
  }

  if (orderLoad.status === "loading" || anonymous) {
    return <SuccessSkeleton />;
  }

  return (
    <OrderConfirmation
      order={orderLoad.order}
      paymentUrl={paymentUrl}
      onGoToPayment={redirectToPayment}
    />
  );
}
