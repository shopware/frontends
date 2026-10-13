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
import {
  LoginModal,
  LoginModalProvider,
  useRequestLogin,
} from "@/features/account/components/LoginModal";
import { CartProvider } from "@/features/cart/components/CartProvider";
import { useCart } from "@/features/cart/useCart";
import {
  readProductReviews,
  reviewViolations,
  saveProductReview,
} from "@/features/reviews/productReviewsApi";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { ShopwareSessionProvider } from "@/features/session/components/ShopwareSessionProvider";
import {
  WishlistProvider,
  useWishlistStore,
} from "@/features/wishlist/components/WishlistProvider";
import { useWishlist } from "@/features/wishlist/useWishlist";
import {
  CUSTOMER_NOT_LOGGED_IN,
  hasApiErrorCode,
} from "@/features/wishlist/wishlistApi";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";

import { cmsCustomerState } from "../cmsCustomerState";
import { NOT_WIRED_MESSAGE_KEYS } from "../notWired";
import { useShopwareClient } from "./ShopwareClientContext";

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
  const { has: isInWishlist } = useWishlist();
  const wishlistStore = useWishlistStore();
  const { retrySession, refreshSession } = useSessionActions();
  const requestLogin = useRequestLogin();
  const t = useTranslations();
  const getClient = useShopwareClient();
  const session = useSession();
  const customerState = useMemo(() => cmsCustomerState(session), [session]);

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
      isInWishlist,
      toggleWishlist: async (productId) => {
        const adding = !isInWishlist(productId);
        const write = () =>
          adding
            ? wishlistStore.add(productId)
            : wishlistStore.remove(productId);
        if ((await retrySession()).isLoggedIn) {
          const result = await write();
          if (!result.loggedOut) return result;
          await refreshSession();
        }
        if (!(await requestLogin())) return { ok: false, cancelled: true };
        wishlistStore.syncSession(await retrySession());
        return write();
      },
      submitContactForm: notWired,
      subscribeNewsletter: notWired,
      getCustomerState: () => customerState,
      loadProductReviews: async (input) => {
        try {
          return {
            ok: true,
            ...(await readProductReviews(await getClient(), input)),
          };
        } catch (error) {
          console.error("[Reviews] reading the product reviews failed", error);
          return { ok: false };
        }
      },
      submitProductReview: async (input) => {
        try {
          await saveProductReview(await getClient(), input);
          return { ok: true };
        } catch (error) {
          if (hasApiErrorCode(error, CUSTOMER_NOT_LOGGED_IN)) {
            await refreshSession();
          }
          const violations = reviewViolations(error);
          if (violations) return { ok: false, violations };
          console.error("[Reviews] saving the product review failed", error);
          return { ok: false, message: t("errors.message-default") };
        }
      },
      findVariant: async () => {
        warnNotWired();
        return null;
      },
    };
  }, [
    notify,
    addProduct,
    isInWishlist,
    wishlistStore,
    retrySession,
    refreshSession,
    requestLogin,
    t,
    getClient,
    customerState,
  ]);

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
        <WishlistProvider>
          <LoginModalProvider>
            <StorefrontCmsActions notify={notify}>
              {children}
              <LoginModal />
              <div
                aria-live="polite"
                className="pointer-events-none fixed right-4 bottom-4 z-60 flex max-w-sm flex-col gap-2"
              >
                {toasts.map((toast) => (
                  <ToastMessage
                    key={toast.id}
                    toast={toast}
                    onDismiss={dismiss}
                  />
                ))}
              </div>
            </StorefrontCmsActions>
          </LoginModalProvider>
        </WishlistProvider>
      </CartProvider>
    </ShopwareSessionProvider>
  );
}
