"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { CmsActionsProvider } from "@/cms/client";
import type { CmsActions, CmsNotification } from "@/cms/client";
import { ShopwareSessionProvider } from "@/features/session/components/ShopwareSessionProvider";

import { NOT_WIRED_MESSAGES } from "../notWired";

type Toast = CmsNotification & { id: number };

const TOAST_CLASSES: Record<CmsNotification["type"], string> = {
  success: "bg-states-success-container text-states-on-success-container",
  error: "bg-states-error-container text-states-on-error-container",
  warning: "bg-states-warning-container text-states-on-warning-container",
  info: "bg-states-info-container text-states-on-info-container",
};

export function StorefrontProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const notify = useCallback((notification: CmsNotification) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [...current, { ...notification, id }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, notification.timeout ?? 5000);
  }, []);

  const actions = useMemo<Partial<CmsActions>>(() => {
    const notWired = (message: string) => async () => ({ ok: false, message });
    return {
      notify,
      addToCart: notWired(NOT_WIRED_MESSAGES.cart),
      toggleWishlist: notWired(NOT_WIRED_MESSAGES.wishlist),
      submitContactForm: notWired(NOT_WIRED_MESSAGES.forms),
      subscribeNewsletter: notWired(NOT_WIRED_MESSAGES.forms),
      submitProductReview: notWired(NOT_WIRED_MESSAGES.forms),
      findVariant: async () => {
        notify({ type: "warning", message: NOT_WIRED_MESSAGES.forms });
        return null;
      },
    };
  }, [notify]);

  return (
    <ShopwareSessionProvider notify={notify}>
      <CmsActionsProvider actions={actions}>
        {children}
        <div
          aria-live="polite"
          className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2"
        >
          {toasts.map((toast) => (
            <p
              key={toast.id}
              data-testid="notification-element-message"
              className={`pointer-events-auto rounded-md px-4 py-3 text-sm shadow-lg ${TOAST_CLASSES[toast.type]}`}
            >
              {toast.message}
              {toast.action && (
                <Link href={toast.action.href} className="ml-2 underline">
                  {toast.action.label}
                </Link>
              )}
            </p>
          ))}
        </div>
      </CmsActionsProvider>
    </ShopwareSessionProvider>
  );
}
