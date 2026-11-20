import type { ComponentProps } from "react";

import { cx } from "@/cms/client";
import { ChevronDownIcon } from "@/components/icons";
import { INPUT_CLASS } from "@/components/input";

import { FieldLabel } from "./FieldLabel";

export type SelectOption = { label: string; value: string };

export type SelectFieldProps = Omit<
  ComponentProps<"select">,
  "id" | "className" | "children"
> & {
  id: string;
  label: string;
  options: SelectOption[];
  optionsLang?: string;
  placeholder?: string;
  error?: string;
  className?: string;
};

export function SelectField({
  id,
  label,
  options,
  optionsLang,
  placeholder,
  error,
  className,
  required,
  ...rest
}: SelectFieldProps) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          className={cx(INPUT_CLASS, "appearance-none px-3 pr-8")}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        >
          {placeholder !== undefined ? (
            <option value="">{placeholder}</option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} lang={optionsLang}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-surface-on-surface-variant" />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 block text-xs text-states-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
