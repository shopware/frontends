"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";

import { CheckmarkIcon, ChevronDownIcon, GlobeIcon } from "@/components/icons";
import { useSession } from "@/features/session/components/SessionProvider";
import {
  useLoadShopwareLanguages,
  useShopwareLanguages,
} from "@/features/session/components/ShopwareLanguagesContext";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { localeNames, locales, stripLocale, withLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { findLanguageId } from "@/platform/shopware/reads/languageOptions";
import type { SalesChannelLanguages } from "@/platform/shopware/reads/languageOptions";

import {
  isCatalogPath,
  pathForLocale,
  resolveLocaleSwitchPath,
} from "../localeSwitchPath";
import type { LocationParts } from "../localeSwitchPath";

type Target = { locale: Locale; href: string };

type Lookup = {
  here: LocationParts;
  controller: AbortController;
  paths: Map<Locale, Promise<string>>;
  resolved: Map<Locale, string>;
};

function currentLocation(): LocationParts {
  const { pathname, search, hash } = window.location;
  return { pathname, search, hash };
}

function samePage(a: LocationParts, b: LocationParts): boolean {
  return a.pathname === b.pathname && a.search === b.search;
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function navigate(path: string): void {
  window.location.assign(path);
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations();
  const getClient = useShopwareClient();
  const languages = useShopwareLanguages();
  const loadLanguages = useLoadShopwareLanguages();
  const { context } = useSession();
  const [targets, setTargets] = useState<Target[] | null>(null);
  const [pending, setPending] = useState<Locale | null>(null);
  const lookup = useRef<Lookup | null>(null);
  const choice = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const open = targets !== null;

  const cancel = useCallback(() => {
    lookup.current?.controller.abort();
    lookup.current = null;
    choice.current += 1;
    setPending(null);
    setTargets(null);
  }, []);

  useEffect(
    () => () => {
      lookup.current?.controller.abort();
      choice.current += 1;
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      if (
        !active ||
        active === document.body ||
        rootRef.current?.contains(active)
      ) {
        buttonRef.current?.focus();
      }
      cancel();
    };
    const onMouseDown = (event: globalThis.MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      cancel();
    };
    const onClick = (event: globalThis.MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || rootRef.current?.contains(target)) {
        return;
      }
      if (target.closest("a[href]")) cancel();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) cancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", cancel);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", cancel);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [open, cancel]);

  function knownLanguages(): SalesChannelLanguages | null {
    if (languages.length === 0 || !context) return null;
    return {
      languages,
      defaultLanguageId: context.salesChannel?.languageId ?? null,
    };
  }

  function plannedPath(
    shop: SalesChannelLanguages,
    here: LocationParts,
    code: Locale,
    signal: AbortSignal,
  ): string | Promise<string> {
    const fromLanguageId =
      findLanguageId(shop.languages, locale) ?? shop.defaultLanguageId;
    const toLanguageId =
      findLanguageId(shop.languages, code) ?? shop.defaultLanguageId;
    if (!fromLanguageId || !toLanguageId) return withLocale("/", code);
    if (fromLanguageId === toLanguageId) return pathForLocale(here, code);
    return resolveLocaleSwitchPath(
      getClient,
      here,
      { locale: code, fromLanguageId, toLanguageId },
      signal,
    );
  }

  function startLookup(here: LocationParts): Lookup {
    lookup.current?.controller.abort();
    const controller = new AbortController();
    const next: Lookup = {
      here,
      controller,
      paths: new Map(),
      resolved: new Map(),
    };
    lookup.current = next;
    const others = locales.filter((code) => code !== locale);
    if (!isCatalogPath(stripLocale(here.pathname).pathname)) {
      for (const code of others) {
        next.resolved.set(code, pathForLocale(here, code));
      }
      return next;
    }
    const source = knownLanguages() ?? loadLanguages();
    for (const code of others) {
      const planned =
        source instanceof Promise
          ? source.then(
              (shop) => plannedPath(shop, here, code, controller.signal),
              () => withLocale("/", code),
            )
          : plannedPath(source, here, code, controller.signal);
      if (typeof planned === "string") {
        next.resolved.set(code, planned);
        continue;
      }
      next.paths.set(code, planned);
      void planned.then((path) => {
        if (controller.signal.aborted) return;
        next.resolved.set(code, path);
        setTargets(
          (previous) =>
            previous?.map((target) =>
              target.locale === code ? { ...target, href: path } : target,
            ) ?? null,
        );
      });
    }
    return next;
  }

  function show(here: LocationParts): Lookup {
    const next = startLookup(here);
    setTargets(
      locales.map((code) => ({
        locale: code,
        href: next.resolved.get(code) ?? pathForLocale(here, code),
      })),
    );
    return next;
  }

  function toggle(): void {
    if (open) {
      cancel();
      return;
    }
    show(currentLocation());
  }

  function leave(event: FocusEvent<HTMLDivElement>): void {
    const next = event.relatedTarget;
    if (open && next instanceof Node && !event.currentTarget.contains(next)) {
      cancel();
    }
  }

  function choose(event: MouseEvent<HTMLAnchorElement>, target: Target): void {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    if (target.locale === locale) {
      buttonRef.current?.focus();
      cancel();
      return;
    }
    if (target.locale === pending) return;
    const here = currentLocation();
    const current =
      lookup.current && samePage(lookup.current.here, here)
        ? lookup.current
        : show(here);
    choice.current += 1;
    const id = choice.current;
    setPending(target.locale);
    const resolved = current.resolved.get(target.locale);
    if (resolved !== undefined) {
      navigate(resolved);
      return;
    }
    const path =
      current.paths.get(target.locale) ??
      Promise.resolve(pathForLocale(here, target.locale));
    void path.then((next) => {
      if (choice.current !== id || current.controller.signal.aborted) return;
      if (!samePage(current.here, currentLocation())) {
        cancel();
        return;
      }
      navigate(next);
    });
  }

  if (locales.length < 2) return null;

  return (
    <div ref={rootRef} className="relative" onBlur={leave}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-busy={pending !== null || undefined}
        className="inline-flex h-9 items-center gap-2 rounded border border-surface-surface/15 bg-surface-surface/10 px-3 text-sm font-medium transition-colors hover:bg-surface-surface/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus"
        onClick={toggle}
      >
        <GlobeIcon className="size-[1.125rem]" />
        <span className="sr-only">
          {t("layout.ariaLabels.languageSwitcher")}:{" "}
        </span>
        <span lang={locale}>{localeNames[locale]}</span>
        <ChevronDownIcon
          className={cx("size-3 transition-transform", open && "rotate-180")}
        />
      </button>
      <output className="sr-only">
        {pending
          ? t("layout.languageSwitcher.pending", {
              language: localeNames[pending],
            })
          : ""}
      </output>
      {targets ? (
        <ul
          id={menuId}
          className="absolute top-full left-0 z-40 mt-1 min-w-44 rounded-md border border-outline-outline-variant bg-surface-surface py-1 text-surface-on-surface shadow-lg"
        >
          {targets.map((target) => {
            const current = target.locale === locale;
            const busy = pending === target.locale;
            return (
              <li key={target.locale}>
                <a
                  href={target.href}
                  hrefLang={target.locale}
                  lang={target.locale}
                  aria-current={current ? "true" : undefined}
                  aria-busy={busy || undefined}
                  aria-disabled={busy || undefined}
                  className={cx(
                    "flex items-center justify-between gap-4 px-4 py-2 text-sm hover:bg-surface-surface-container focus-visible:bg-surface-surface-container focus-visible:ring-2 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden focus-visible:ring-inset aria-busy:cursor-progress aria-busy:opacity-60",
                    current && "font-semibold",
                  )}
                  onClick={(event) => choose(event, target)}
                >
                  {localeNames[target.locale]}
                  {current ? (
                    <CheckmarkIcon className="h-3 w-4 text-brand-primary" />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
