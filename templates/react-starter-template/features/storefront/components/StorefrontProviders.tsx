"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { CmsActionsProvider } from "@/cms/client";
import type { CmsActions, CmsNotification } from "@/cms/client";

const NOT_WIRED =
  "Cart, wishlist and forms are not connected to a session yet.";

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
    const notWired = async () => ({ ok: false, message: NOT_WIRED });
    return {
      notify,
      addToCart: notWired,
      toggleWishlist: notWired,
      submitContactForm: notWired,
      subscribeNewsletter: notWired,
      submitProductReview: notWired,
      findVariant: async () => {
        notify({ type: "warning", message: NOT_WIRED });
        return null;
      },
    };
  }, [notify]);

  return (
    <CmsActionsProvider actions={actions}>
      {children}
      <div
        aria-live="polite"
        className="fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => (
          <p
            key={toast.id}
            data-testid="notification-element-message"
            className={`rounded-md px-4 py-3 text-sm shadow-lg ${TOAST_CLASSES[toast.type]}`}
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
  );
}
