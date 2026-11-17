"use client";

import { useId, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";

export type SwQuantitySelectSize = "small" | "large";

export type SwQuantitySelectProps = {
  value: number;
  onChange: (quantity: number) => void;
  size?: SwQuantitySelectSize;
  steps?: number;
  min?: number;
  max?: number;
  id?: string;
  translations?: CmsTranslations;
  className?: string;
  style?: CSSProperties;
};

const translationDefaults = {
  form: {
    quantitySelect: {
      label: "Quantity",
      increaseButton: "Increase quantity",
      decreaseButton: "Decrease quantity",
    },
  },
};

const SIZE_CLASSES: Record<SwQuantitySelectSize, string> = {
  small: "w-8 h-8",
  large: "w-10 h-10",
};

export function SwQuantitySelect({
  value,
  onChange,
  size = "large",
  steps,
  min,
  max,
  id,
  translations: translationsInput,
  className,
  style,
}: SwQuantitySelectProps) {
  const translations = withTranslationDefaults(
    translationsInput,
    translationDefaults,
  );
  const generatedId = useId();
  const inputId = id || generatedId;
  const [draft, setDraft] = useState<string | null>(null);

  function increaseQty() {
    setDraft(null);
    onChange(value + 1);
  }

  function decreaseQty() {
    setDraft(null);
    if (value > 1) {
      onChange(value - 1);
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    const parsed = Number(raw);
    if (raw !== "" && Number.isFinite(parsed)) {
      setDraft(null);
      onChange(parsed);
      return;
    }
    setDraft(raw);
  }

  return (
    <div
      className={cx(
        "rounded outline outline-1 outline-offset-[-1px] outline-outline-outline inline-flex",
        className,
      )}
      style={style}
    >
      <button
        type="button"
        className={cx(
          SIZE_CLASSES[size],
          "bg-surface-surface border-0 border-r cursor-pointer hover:bg-brand-tertiary-hover font-semibold",
        )}
        onClick={decreaseQty}
        aria-label={translations.form.quantitySelect.decreaseButton}
      >
        -
      </button>
      <div className="bg-white border-l border-r border-outline-outline inline-flex flex-col justify-center items-center">
        <label htmlFor={inputId} className="sr-only">
          {translations.form.quantitySelect.label}
        </label>
        <input
          id={inputId}
          type="number"
          value={draft ?? value}
          min={min}
          max={max}
          step={steps}
          onChange={handleInput}
          onBlur={() => setDraft(null)}
          data-testid="product-quantity"
          className={cx(
            SIZE_CLASSES[size],
            "self-stretch text-center justify-start text-surface-on-surface text-xs font-bold leading-[18px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          )}
          aria-label={translations.form.quantitySelect.label}
        />
      </div>
      <button
        type="button"
        className={cx(
          SIZE_CLASSES[size],
          "w-10 bg-surface-surface border-0 border-l cursor-pointer hover:bg-brand-tertiary-hover font-semibold",
        )}
        onClick={increaseQty}
        aria-label={translations.form.quantitySelect.increaseButton}
      >
        +
      </button>
    </div>
  );
}
