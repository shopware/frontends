"use client";

import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";

import { cx } from "../../helpers/cx";

export type SwitchButtonProps = {
  name?: string;
  ariaLabel?: string;
  label?: string;
  description?: ReactNode;
  disabled?: boolean;
  checked?: boolean | null;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
};

export function SwitchButton({
  name,
  ariaLabel,
  label,
  description,
  disabled = false,
  checked,
  onChange,
  children,
}: SwitchButtonProps) {
  const value = !!checked;
  const [previousValue, setPreviousValue] = useState(value);
  const [localChecked, setLocalChecked] = useState(value);
  if (previousValue !== value) {
    setPreviousValue(value);
    setLocalChecked(value);
  }

  const inputName = name ?? "switch-button";
  const inputId = `switch-${inputName}`;

  const toggleState = (next?: boolean) => {
    if (disabled) return;
    const nextValue = typeof next === "boolean" ? next : !localChecked;
    setLocalChecked(nextValue);
    onChange?.(nextValue);
  };

  const activateByClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    toggleState();
  };

  return (
    <div className="w-full inline-flex flex-col justify-start items-start gap-2">
      <div className="self-stretch inline-flex justify-start items-center gap-3">
        <label
          htmlFor={inputId}
          className={cx(
            "flex-1 flex justify-start items-center gap-1 text-surface-on-surface text-base font-normal leading-normal cursor-pointer",
            disabled && "cursor-not-allowed",
          )}
        >
          {children ? (
            <span>{children}</span>
          ) : label ? (
            <span>{label}</span>
          ) : null}
        </label>

        <div className="w-10 h-6 relative">
          <span
            className={cx(
              "inline-block cursor-pointer",
              disabled && "cursor-not-allowed",
            )}
          >
            <input
              id={inputId}
              type="checkbox"
              role="switch"
              name={inputName}
              className="sr-only peer"
              checked={localChecked}
              aria-checked={localChecked}
              onChange={() => toggleState()}
              disabled={disabled}
              aria-label={ariaLabel || undefined}
            />
            <span
              aria-hidden="true"
              className={cx(
                "w-10 h-6 relative rounded-full flex-shrink-0 inline-block switch-track cursor-pointer transition-[background-color,box-shadow] duration-[180ms] ease-in-out focus:outline-hidden peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-brand-primary",
                localChecked
                  ? "bg-brand-secondary switch-track--on shadow-[0_0_0_4px_rgba(99,102,241,0.08)]"
                  : "bg-surface-surface-container-highest",
              )}
              onClick={activateByClick}
            >
              <span
                className={cx(
                  "w-4 h-4 rounded-full absolute switch-knob [transition:left_180ms_cubic-bezier(0.2,0.9,0.2,1),top_180ms_cubic-bezier(0.2,0.9,0.2,1),background-color_120ms_linear]",
                  localChecked
                    ? "bg-brand-on-secondary"
                    : "bg-surface-on-surface-variant",
                )}
                style={{ left: localChecked ? "19px" : "4px", top: "4px" }}
              />
            </span>
          </span>
        </div>
      </div>
      {description && (
        <div className="self-stretch inline-flex justify-start items-center gap-2.5">
          <div className="flex-1 justify-start text-surface-on-surface-variant text-sm font-normal leading-tight">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}
