"use client";

import { cx } from "../../helpers/cx";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
};

export function Checkbox({
  checked,
  onChange,
  id,
  label,
  description,
  disabled = false,
}: CheckboxProps) {
  const input = (
    <input
      id={id}
      className="accent-brand-primary w-4 h-4 focus-within:outline-2 focus-within:outline-brand-primary focus-within:outline focus-within:outline-offset-[2px]"
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      disabled={disabled}
    />
  );

  if (!label && !description) return input;

  return (
    <label className="flex items-start gap-2">
      {input}
      <div>
        {label && (
          <p
            className={
              disabled
                ? "text-surface-on-surface-disabled"
                : "text-surface-on-surface"
            }
          >
            {label}
          </p>
        )}
        {description && (
          <p
            className={cx(
              "text-sm",
              disabled
                ? "text-surface-on-surface-disabled"
                : "text-surface-on-surface-variant",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
