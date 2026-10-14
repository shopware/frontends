"use client";

import { useRouter } from "next/navigation";
import { useId, useLayoutEffect, useRef, useState, useTransition } from "react";
import type { CSSProperties } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type {
  CmsFindVariantResult,
  CmsVariantResult,
} from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { SpinnerIcon } from "../icons";
import {
  getInitialVariantSelection,
  getVariantHref,
  orderVariantSelection,
} from "./variantOptionGroups";
import type { SwVariantOptionGroup } from "./variantOptionGroups";

export type SwVariantConfiguratorOptionsProps = {
  productId: string;
  parentId?: string;
  optionIds: string[];
  optionGroups: SwVariantOptionGroup[];
  urlPrefix: string;
  translations?: CmsTranslations;
  allowRedirect?: boolean;
  onChange?: (variant: CmsVariantResult | null) => void;
  className?: string;
  style?: CSSProperties;
};

type VariantStatus = "loading" | "unavailable" | "failed";

type PendingSelection = {
  productId: string;
  selected: Record<string, string>;
};

type VariantSwitch = {
  productId: string;
  optionId: string;
  restoreFocus: boolean;
  from: HTMLElement | null;
};

const translationDefaults = {
  product: {
    chooseA: "Choose a",
    variantConfigurator: {
      hint: "Selecting an option loads the matching variant.",
      loading: "Loading the selected variant…",
      unavailable:
        "This combination is not available. Your previous selection has been restored.",
      failed: "The selected variant could not be loaded. Please try again.",
    },
  },
};

let lastSwitch: VariantSwitch | null = null;

function rememberSwitch(next: VariantSwitch): void {
  lastSwitch = next;
}

function takeLastSwitch(productId: string): VariantSwitch | null {
  const done = lastSwitch?.productId === productId ? lastSwitch : null;
  if (done) lastSwitch = null;
  return done;
}

function forgetSwitchFrom(root: HTMLElement | null): void {
  if (lastSwitch && lastSwitch.from === root) lastSwitch = null;
}

function isFocusLost(from: HTMLElement | null): boolean {
  const active = document.activeElement;
  return !active || active === document.body || Boolean(from?.contains(active));
}

function findRadio(
  root: HTMLElement,
  optionId: string,
): HTMLInputElement | undefined {
  return Array.from(
    root.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
  ).find((radio) => radio.value === optionId);
}

export function SwVariantConfiguratorOptions({
  productId,
  parentId,
  optionIds,
  optionGroups,
  urlPrefix,
  translations: translationsInput,
  allowRedirect = true,
  onChange,
  className,
  style,
}: SwVariantConfiguratorOptionsProps) {
  const translations = withTranslationDefaults(
    translationsInput,
    translationDefaults,
  );
  const messages = translations.product.variantConfigurator;
  const actions = useCmsActions();
  const router = useRouter();
  const radioGroupId = useId();
  const hintId = `${radioGroupId}hint`;
  const [isPending, startTransition] = useTransition();
  const [pending, setPending] = useState<PendingSelection | null>(null);
  const [status, setStatus] = useState<VariantStatus | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const navigatingRef = useRef(0);

  const selected =
    pending?.productId === productId
      ? pending.selected
      : getInitialVariantSelection(optionGroups, optionIds);
  const selectedOptionIds = Object.values(selected);
  const isResolving = isPending || status === "loading";
  const hasGroups = optionGroups.length > 0;

  useLayoutEffect(() => {
    const switched = takeLastSwitch(productId);
    const root = rootRef.current;
    if (switched?.restoreFocus && root && isFocusLost(switched.from)) {
      findRadio(root, switched.optionId)?.focus({ preventScroll: true });
    }
    return () => {
      requestRef.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
      navigatingRef.current = 0;
      setPending(null);
      setStatus(null);
    };
  }, [productId]);

  useLayoutEffect(() => {
    if (isPending || navigatingRef.current === 0) return;
    if (navigatingRef.current === requestRef.current) {
      forgetSwitchFrom(rootRef.current);
      setPending(null);
      setStatus(null);
    }
    navigatingRef.current = 0;
  }, [isPending]);

  async function handleChange(group: SwVariantOptionGroup, optionId: string) {
    const next = { ...selected, [group.id]: optionId };
    requestRef.current += 1;
    const requestId = requestRef.current;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const root = rootRef.current;
    const restoreFocus = Boolean(root?.contains(document.activeElement));
    setPending({ productId, selected: next });
    setStatus("loading");

    const result = await actions
      .findVariant({
        productId,
        parentId,
        options: orderVariantSelection(optionGroups, next),
        switchedGroup: group.id,
        signal: controller.signal,
      })
      .catch((): CmsFindVariantResult => ({ ok: false }));

    if (requestId !== requestRef.current || result.cancelled) return;
    controllerRef.current = null;
    const variant = result.ok && result.variant ? result.variant : null;
    const failure: VariantStatus = result.notFound ? "unavailable" : "failed";

    if (!allowRedirect) {
      if (!variant) setPending(null);
      setStatus(variant ? null : failure);
      onChange?.(variant);
      return;
    }

    if (variant && variant.productId !== productId) {
      rememberSwitch({
        productId: variant.productId,
        optionId,
        restoreFocus,
        from: root,
      });
      navigatingRef.current = requestId;
      startTransition(() => {
        router.replace(getVariantHref(variant, urlPrefix), { scroll: false });
      });
      return;
    }

    setPending(null);
    setStatus(variant ? null : failure);
  }

  const statusMessage = status ? messages[status] : "";
  const statusVisible = status === "unavailable" || status === "failed";

  return (
    <div
      ref={rootRef}
      className={cx("relative flex flex-col", className)}
      style={style}
    >
      {isResolving ? (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/75">
          <SpinnerIcon
            data-testid="loading"
            className="h-15 w-15 animate-spin text-gray-500"
          />
        </div>
      ) : null}
      {hasGroups ? (
        <>
          <p id={hintId} className="sr-only">
            {messages.hint}
          </p>
          <div aria-busy={isResolving || undefined}>
            {optionGroups.map((optionGroup) => (
              <div key={optionGroup.id} className="mt-6">
                <div className="text-sm text-gray-900 font-medium">
                  {optionGroup.name}
                </div>
                <fieldset className="mt-4 flex-1" aria-describedby={hintId}>
                  <legend className="sr-only">
                    {translations.product.chooseA} {optionGroup.name}
                  </legend>
                  <div className="flex gap-3">
                    {optionGroup.options.map((option) => {
                      const isSelected = selectedOptionIds.includes(option.id);
                      return (
                        <label
                          key={option.id}
                          data-testid="product-variant"
                          className={cx(
                            "group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-hidden has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-primary sm:flex-1 bg-white shadow-xs text-gray-900 cursor-pointer",
                            isSelected && "border-[3px] border-brand-primary",
                          )}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            name={`${radioGroupId}${optionGroup.id}`}
                            value={option.id}
                            checked={isSelected}
                            onChange={() => {
                              void handleChange(optionGroup, option.id);
                            }}
                          />
                          <p
                            id={`${option.id}-choice-label`}
                            data-testid="product-variant-text"
                          >
                            {option.name}
                          </p>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            ))}
          </div>
          <output
            data-testid="product-variant-status"
            className={
              statusVisible ? "mt-4 block text-sm text-states-error" : "sr-only"
            }
          >
            {statusMessage}
          </output>
        </>
      ) : null}
    </div>
  );
}
