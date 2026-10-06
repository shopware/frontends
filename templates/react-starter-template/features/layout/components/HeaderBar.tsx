"use client";

import {
  IconButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  HeartIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@/components/icons";
import { LocaleLink } from "@/components/LocaleLink";
import { MiniCart } from "@/features/cart/components/MiniCart";
import { useCart } from "@/features/cart/useCart";
import { AccountMenu } from "@/features/layout/components/AccountMenu";
import { MainCounter } from "@/features/layout/components/MainCounter";
import { HEADER_ACTION_CLASS } from "@/features/layout/headerAction";
import { HeaderSearch } from "@/features/search/components/HeaderSearch";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { NOT_WIRED_MESSAGE_KEYS } from "@/features/storefront/notWired";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";

const ICON_CLASS = "size-5 text-brand-primary";
const COUNTER_CLASS = "absolute -top-2 left-1/2";

export function HeaderBar({ menu }: { menu: ReactNode }) {
  const { status, isLoggedIn, customerName, wishlistCount } = useSession();
  const { count: cartQuantity } = useCart();
  const { retrySession } = useSessionActions();
  const { notify } = useCmsActions();
  const router = useRouter();
  const t = useTranslations();
  const localePath = useLocalePath();
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);
  const checkingSessionRef = useRef(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const miniCartShown = useRef(false);
  const accountMenuId = useId();
  const miniCartId = useId();
  const showMiniCart = miniCartOpen && cartQuantity > 0;

  if (accountMenuOpen && !isLoggedIn) setAccountMenuOpen(false);
  if (miniCartOpen && cartQuantity === 0) setMiniCartOpen(false);

  const notWired = (key: string) => () =>
    notify({ type: "info", message: t(key) });

  const closeAccountMenu = useCallback(() => setAccountMenuOpen(false), []);
  const closeMiniCart = useCallback(() => setMiniCartOpen(false), []);

  const toggleMiniCart = () => {
    if (miniCartOpen) {
      setMiniCartOpen(false);
      return;
    }
    if (cartQuantity === 0) return;
    setAccountMenuOpen(false);
    setMiniCartOpen(true);
  };

  const goToLogin = () => {
    const { pathname, search, hash } = window.location;
    router.push(
      localePath(
        `/account/login?redirect=${encodeURIComponent(`${pathname}${search}${hash}`)}`,
      ),
    );
  };

  const recoverSession = async () => {
    if (checkingSessionRef.current) return;
    checkingSessionRef.current = true;
    setCheckingSession(true);
    try {
      const session = await retrySession();
      if (session.isLoggedIn) setAccountMenuOpen(true);
      else goToLogin();
    } catch {
      goToLogin();
    } finally {
      checkingSessionRef.current = false;
      setCheckingSession(false);
    }
  };

  const openAccount = () => {
    if (isLoggedIn) {
      setMiniCartOpen(false);
      setAccountMenuOpen((open) => !open);
      return;
    }
    if (status === "error") {
      void recoverSession();
      return;
    }
    goToLogin();
  };

  const closeMobileSearch = () => {
    restoreFocus.current = true;
    setMobileSearchActive(false);
  };

  useEffect(() => {
    const wasShown = miniCartShown.current;
    miniCartShown.current = showMiniCart;
    if (!wasShown || showMiniCart || cartQuantity > 0) return;
    if (document.activeElement === document.body) {
      cartButtonRef.current?.focus();
    }
  }, [showMiniCart, cartQuantity]);

  useEffect(() => {
    if (mobileSearchActive || !restoreFocus.current) return;
    restoreFocus.current = false;
    searchButtonRef.current?.focus();
  }, [mobileSearchActive]);

  return (
    <div className="relative mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-3.5 sm:grid sm:grid-cols-3">
      {mobileSearchActive ? (
        <>
          <HeaderSearch className="w-full" autoFocus />
          <button
            type="button"
            className="shrink-0 border-b border-brand-primary text-sm text-brand-primary hover:border-transparent"
            onClick={closeMobileSearch}
          >
            {t("layout.header.closeSearch")}
          </button>
        </>
      ) : (
        <>
          <LocaleLink href="/" className="shrink-0 sm:justify-self-start">
            <img
              src="/logo.svg"
              alt={t("layout.logo")}
              width={93}
              height={39}
              className="h-20 w-auto max-sm:h-10"
            />
          </LocaleLink>
          <HeaderSearch className="w-full justify-self-center max-sm:hidden" />
          <div className="flex shrink-0 items-center gap-4 sm:justify-self-end">
            <IconButton
              ref={searchButtonRef}
              variant="ghost"
              className={`${HEADER_ACTION_CLASS} sm:hidden`}
              aria-label={t("layout.header.search")}
              onClick={() => {
                setAccountMenuOpen(false);
                setMiniCartOpen(false);
                setMobileSearchActive(true);
              }}
            >
              <SearchIcon className={ICON_CLASS} />
            </IconButton>
            <div className="relative flex">
              <IconButton
                ref={accountButtonRef}
                variant="ghost"
                className={`${HEADER_ACTION_CLASS} aria-disabled:cursor-progress aria-disabled:opacity-50`}
                data-testid="header-account-button"
                data-logged-in={String(isLoggedIn)}
                aria-label={t("layout.header.myAccount")}
                aria-expanded={isLoggedIn ? accountMenuOpen : undefined}
                aria-controls={isLoggedIn ? accountMenuId : undefined}
                aria-busy={checkingSession || undefined}
                aria-disabled={checkingSession || undefined}
                onClick={openAccount}
              >
                <UserIcon className={ICON_CLASS} />
              </IconButton>
              {isLoggedIn && accountMenuOpen ? (
                <AccountMenu
                  id={accountMenuId}
                  customerName={customerName}
                  triggerRef={accountButtonRef}
                  onClose={closeAccountMenu}
                />
              ) : null}
            </div>
            <IconButton
              variant="ghost"
              className={HEADER_ACTION_CLASS}
              data-testid="header-wishlist-button"
              aria-label={t("wishlist.header")}
              onClick={notWired(NOT_WIRED_MESSAGE_KEYS.wishlist)}
            >
              <span className="relative flex">
                <HeartIcon className={ICON_CLASS} />
                {wishlistCount > 0 && isLoggedIn ? (
                  <MainCounter
                    count={wishlistCount}
                    className={COUNTER_CLASS}
                  />
                ) : null}
              </span>
            </IconButton>
            <IconButton
              ref={cartButtonRef}
              variant="ghost"
              className={HEADER_ACTION_CLASS}
              data-testid="header-mini-cart-button"
              aria-label={t("layout.header.cart")}
              aria-expanded={showMiniCart}
              aria-controls={miniCartId}
              onClick={toggleMiniCart}
            >
              <span className="relative flex">
                <ShoppingCartIcon className={ICON_CLASS} />
                {cartQuantity > 0 ? (
                  <MainCounter count={cartQuantity} className={COUNTER_CLASS} />
                ) : null}
              </span>
            </IconButton>
            {menu}
          </div>
        </>
      )}
      {showMiniCart ? (
        <MiniCart
          id={miniCartId}
          triggerRef={cartButtonRef}
          onClose={closeMiniCart}
          className="absolute top-full right-0"
        />
      ) : null}
    </div>
  );
}
