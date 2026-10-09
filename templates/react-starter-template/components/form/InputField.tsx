import { cx } from "@shopware/cms-base-layer-react/client";
import type { ComponentProps } from "react";

import { INPUT_CLASS } from "@/components/input";

import { FieldLabel } from "./FieldLabel";

export type InputFieldProps = Omit<
  ComponentProps<"input">,
  "id" | "className"
> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

export function InputField({
  id,
  label,
  hint,
  error,
  className,
  required,
  ...rest
}: InputFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <input
        id={id}
        className={cx(INPUT_CLASS, "px-3")}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint ? (
        <p
          id={hintId}
          className="mt-1 block text-xs text-surface-on-surface-variant"
        >
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 block text-xs text-states-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
