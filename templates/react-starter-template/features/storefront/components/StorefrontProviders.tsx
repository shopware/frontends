"use client";

import { CmsActionsProvider } from "@shopware/cms-base-layer-react/client";
import type {
  CmsActions,
  CmsNotification,
} from "@shopware/cms-base-layer-react/client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { CloseIcon } from "@/components/icons";
import { LocaleLink } from "@/components/LocaleLink";
import { CartProvider } from "@/features/cart/components/CartProvider";
import { useCart } from "@/features/cart/useCart";
import { ShopwareSessionProvider } from "@/features/session/components/ShopwareSessionProvider";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";

import { NOT_WIRED_MESSAGE_KEYS } from "../notWired";

export const TOAST_TIMEOUT_MS = 5000;

type Toast = CmsNotification & { id: number };

type Notify = (notification: CmsNotification) => void;

const TOAST_CLASSES: Record<CmsNotification["type"], string> = {
  success: "bg-states-success-container text-states-on-success-container",
  error: "bg-states-error-container text-states-on-error-container",
  warning: "bg-states-warning-container text-states-on-warning-container",
  info: "bg-states-info-container text-states-on-info-container",
};

const TOAST_TEST_IDS: Record<CmsNotification["type"], string> = {
  success: "notification-element-success",
  error: "notification-element-danger",
  warning: "notification-element-warning",
  info: "notification-element-info",
};

function toastTimeout({ timeout }: CmsNotification): number | null {
  if (timeout === undefined) return TOAST_TIMEOUT_MS;
  return Number.isFinite(timeout) && timeout > 0 ? timeout : null;
}

function StorefrontCmsActions({
  notify,
  children,
}: {
  notify: Notify;
  children: ReactNode;
}) {
  const { addProduct } = useCart();
  const t = useTranslations();

  const actions = useMemo<Partial<CmsActions>>(() => {
    const warnNotWired = () =>
      notify({ type: "warning", message: t(NOT_WIRED_MESSAGE_KEYS.forms) });
    const notWired = async () => {
      warnNotWired();
      return { ok: false };
    };
    return {
      notify,
      addToCart: ({ productId, quantity }) =>
        addProduct({ id: productId, quantity }),
      toggleWishlist: notWired,
      submitContactForm: notWired,
      subscribeNewsletter: notWired,
      submitProductReview: notWired,
      findVariant: async () => {
        warnNotWired();
        return null;
      },
    };
  }, [notify, addProduct, t]);

  return <CmsActionsProvider actions={actions}>{children}</CmsActionsProvider>;
}

function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const t = useTranslations();
  const dismiss = () => onDismiss(toast.id);
  return (
    <div
      data-testid={TOAST_TEST_IDS[toast.type]}
      className={`pointer-events-auto flex items-start gap-3 rounded-md px-4 py-3 text-sm shadow-lg ${TOAST_CLASSES[toast.type]}`}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p
          data-testid="notification-element-message"
          className="whitespace-pre-line"
        >
          {toast.message}
        </p>
        {toast.action ? (
          <LocaleLink
            href={toast.action.href}
            data-testid="notification-element-action"
            className="inline-flex min-h-8 items-center font-bold underline underline-offset-2"
            onClick={dismiss}
          >
            {toast.action.label}
          </LocaleLink>
        ) : null}
      </div>
      <button
        type="button"
        data-testid="notification-element-button"
        aria-label={t("layout.ariaLabels.closeNotification")}
        className="-my-1 -mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-outline-outline-focus"
        onClick={dismiss}
      >
        <CloseIcon className="size-3" />
      </button>
    </div>
  );
}

export function StorefrontProviders({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback<Notify>(
    (notification) => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((current) => [...current, { ...notification, id }]);
      const timeout = toastTimeout(notification);
      if (timeout !== null) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), timeout),
        );
      }
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) clearTimeout(timer);
      pending.clear();
    };
  }, []);

  return (
    <ShopwareSessionProvider locale={locale} notify={notify}>
      <CartProvider>
        <StorefrontCmsActions notify={notify}>
          {children}
          <div
            aria-live="polite"
            className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2"
          >
            {toasts.map((toast) => (
              <ToastMessage key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </div>
        </StorefrontCmsActions>
      </CartProvider>
    </ShopwareSessionProvider>
  );
}
