"use client";

import type { ComponentProps } from "react";

import { cx } from "../../helpers/cx";

export type RadioButtonProps = Omit<
  ComponentProps<"input">,
  "type" | "className" | "checked" | "onChange" | "value" | "name"
> & {
  value: string;
  modelValue?: string | null;
  selected: boolean;
  onChange?: (value: string) => void;
};

export function RadioButton({
  value,
  modelValue,
  selected,
  onChange,
  ...attrs
}: RadioButtonProps) {
  return (
    <>
      <input
        type="radio"
        className="sr-only"
        {...attrs}
        value={value}
        checked={modelValue === value}
        onChange={() => onChange?.(value)}
        name="shipping-method"
      />
      <div className="w-4 h-4 rounded-full border border-outline-outline border-spacing-1 flex items-center justify-center">
        <div
          className={cx(
            "w-2.5 h-2.5 rounded-full",
            selected && "bg-brand-primary",
          )}
        />
      </div>
    </>
  );
}
