"use client";

import {
  IconButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  HeartIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@/components/icons";
import { AccountMenu } from "@/features/layout/components/AccountMenu";
import { MainCounter } from "@/features/layout/components/MainCounter";
import { HEADER_ACTION_CLASS } from "@/features/layout/headerAction";
import { HeaderSearch } from "@/features/search/components/HeaderSearch";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import { NOT_WIRED_MESSAGES } from "@/features/storefront/notWired";

const t = {
  "layout.header.myAccount": "My Account",
  "layout.header.cart": "Cart",
  "wishlist.header": "Wishlist",
  search: "Search",
  close: "Close",
  logo: "Shopware Frontends Demo Store",
};

const ICON_CLASS = "size-5 text-brand-primary";
const COUNTER_CLASS = "absolute -top-2 left-1/2";

export function HeaderBar({ menu }: { menu: ReactNode }) {
  const { status, isLoggedIn, customerName, cartCount, wishlistCount } =
    useSession();
  const { retrySession } = useSessionActions();
  const { notify } = useCmsActions();
  const router = useRouter();
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);
  const checkingSessionRef = useRef(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const accountMenuId = useId();

  if (accountMenuOpen && !isLoggedIn) setAccountMenuOpen(false);

  const notWired = (message: string) => () => notify({ type: "info", message });

  const closeAccountMenu = useCallback(() => setAccountMenuOpen(false), []);

  const goToLogin = () => {
    const { pathname, search, hash } = window.location;
    router.push(
      `/account/login?redirect=${encodeURIComponent(`${pathname}${search}${hash}`)}`,
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
    if (mobileSearchActive || !restoreFocus.current) return;
    restoreFocus.current = false;
    searchButtonRef.current?.focus();
  }, [mobileSearchActive]);

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-3.5 sm:grid sm:grid-cols-3">
      {mobileSearchActive ? (
        <>
          <HeaderSearch className="w-full" autoFocus />
          <button
            type="button"
            className="shrink-0 border-b border-brand-primary text-sm text-brand-primary hover:border-transparent"
            onClick={closeMobileSearch}
          >
            {t.close}
          </button>
        </>
      ) : (
        <>
          <Link href="/" className="shrink-0 sm:justify-self-start">
            <img
              src="/logo.svg"
              alt={t.logo}
              width={93}
              height={39}
              className="h-20 w-auto max-sm:h-10"
            />
          </Link>
          <HeaderSearch className="w-full justify-self-center max-sm:hidden" />
          <div className="flex shrink-0 items-center gap-4 sm:justify-self-end">
            <IconButton
              ref={searchButtonRef}
              variant="ghost"
              className={`${HEADER_ACTION_CLASS} sm:hidden`}
              aria-label={t.search}
              onClick={() => {
                setAccountMenuOpen(false);
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
                aria-label={t["layout.header.myAccount"]}
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
              aria-label={t["wishlist.header"]}
              onClick={notWired(NOT_WIRED_MESSAGES.wishlist)}
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
              variant="ghost"
              className={HEADER_ACTION_CLASS}
              data-testid="header-mini-cart-button"
              aria-label={t["layout.header.cart"]}
              onClick={notWired(NOT_WIRED_MESSAGES.cart)}
            >
              <span className="relative flex">
                <ShoppingCartIcon className={ICON_CLASS} />
                {cartCount > 0 ? (
                  <MainCounter count={cartCount} className={COUNTER_CLASS} />
                ) : null}
              </span>
            </IconButton>
            {menu}
          </div>
        </>
      )}
    </div>
  );
}
