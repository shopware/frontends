"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FocusEvent } from "react";

import {
  CheckmarkIcon,
  ChevronDownIcon,
  CurrencyIcon,
} from "@/components/icons";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useSession } from "@/features/session/components/SessionProvider";
import {
  useLoadShopwareCurrencies,
  useShopwareCurrencies,
} from "@/features/session/components/ShopwareCurrenciesContext";
import { currencyLabel } from "@/features/session/currencyOptions";
import type { CurrencyOption } from "@/features/session/currencyOptions";
import { useTranslations } from "@/i18n/I18nProvider";

function logReadFailure(error: unknown): void {
  console.error("[Currency] reading the currencies failed", error);
}

function focusIsHereOrLost(root: HTMLElement | null): boolean {
  const active = document.activeElement;
  return !active || active === document.body || !!root?.contains(active);
}

export function CurrencySwitcher() {
  const currencies = useShopwareCurrencies();
  const loadCurrencies = useLoadShopwareCurrencies();
  const { status, context } = useSession();
  const loaded = currencies.length > 0;
  const current = context?.currency;
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (status === "loading" || loaded) return;
    let active = true;
    loadCurrencies().catch((error: unknown) => {
      logReadFailure(error);
      if (active) setFailed(true);
    });
    return () => {
      active = false;
    };
  }, [status, loaded, loadCurrencies, attempt]);

  useEffect(() => {
    if (!failed) return;
    const retry = () => {
      if (document.visibilityState !== "visible") return;
      setFailed(false);
      setAttempt((count) => count + 1);
    };
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retry);
    return () => {
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [failed]);

  if (currencies.length < 2 || !current?.id) return null;

  const currentLabel =
    currencies.find((currency) => currency.id === current.id)?.label ??
    currencyLabel(current);

  return (
    <CurrencyMenu
      currencies={currencies}
      currentId={current.id}
      currentLabel={currentLabel}
    />
  );
}

function CurrencyMenu({
  currencies,
  currentId,
  currentLabel,
}: {
  currencies: CurrencyOption[];
  currentId: string;
  currentLabel: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { setCurrency, retrySession } = useSessionActions();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<CurrencyOption | null>(null);
  const [changed, setChanged] = useState<CurrencyOption | null>(null);
  const switching = useRef(false);
  const mounted = useRef(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (focusIsHereOrLost(rootRef.current)) buttonRef.current?.focus();
      close();
    };
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      close();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("popstate", close);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("popstate", close);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [open, close]);

  function leave(event: FocusEvent<HTMLDivElement>): void {
    const next = event.relatedTarget;
    if (open && next instanceof Node && !event.currentTarget.contains(next)) {
      close();
    }
  }

  async function choose(option: CurrencyOption): Promise<void> {
    if (switching.current) return;
    if (option.id === currentId) {
      buttonRef.current?.focus();
      close();
      return;
    }
    switching.current = true;
    setPending(option);
    setChanged(null);
    const result = await setCurrency(option.id);
    const session = result.ok ? await retrySession() : null;
    switching.current = false;
    if (!mounted.current) return;
    setPending(null);
    if (!result.ok) return;
    if (session?.context?.currency?.id !== option.id) {
      window.location.reload();
      return;
    }
    setChanged(option);
    if (focusIsHereOrLost(rootRef.current)) buttonRef.current?.focus();
    close();
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative" onBlur={leave}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-busy={pending !== null || undefined}
        data-testid="currency-switcher-button"
        className="inline-flex h-9 items-center gap-2 rounded-md border border-shell-on-ink/25 bg-transparent px-3 text-sm font-medium text-shell-on-ink transition-colors hover:bg-shell-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-accent"
        onClick={() => {
          setChanged(null);
          setOpen((previous) => !previous);
        }}
      >
        <CurrencyIcon className="size-[1.125rem]" />
        <span className="sr-only">
          {t("layout.ariaLabels.currencySwitcher")}:{" "}
        </span>
        <span>{currentLabel}</span>
        <ChevronDownIcon
          className={cx("size-3 transition-transform", open && "rotate-180")}
        />
      </button>
      <output className="sr-only">
        {pending
          ? t("layout.currencySwitcher.pending", { currency: pending.label })
          : changed
            ? t("layout.currencySwitcher.changed", { currency: changed.label })
            : ""}
      </output>
      {open ? (
        <ul
          id={menuId}
          className="absolute top-full right-0 z-40 mt-1 min-w-44 rounded-md border border-shell-line bg-shell-sand py-1 text-shell-ink shadow-lg"
        >
          {currencies.map((currency) => {
            const current = currency.id === currentId;
            const busy = pending?.id === currency.id;
            return (
              <li key={currency.id}>
                <button
                  type="button"
                  aria-current={current ? "true" : undefined}
                  aria-busy={busy || undefined}
                  aria-disabled={pending !== null || undefined}
                  data-testid="currency-switcher-option"
                  className={cx(
                    "flex w-full items-center justify-between gap-4 px-4 py-2 text-left text-sm hover:bg-shell-sand-strong focus-visible:ring-2 focus-visible:ring-shell-accent-strong focus-visible:outline-hidden focus-visible:ring-inset aria-busy:cursor-progress aria-busy:opacity-60",
                    current && "font-semibold",
                  )}
                  onClick={() => {
                    void choose(currency);
                  }}
                >
                  {currency.label}
                  {current ? (
                    <CheckmarkIcon className="h-3 w-4 text-shell-accent-strong" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
