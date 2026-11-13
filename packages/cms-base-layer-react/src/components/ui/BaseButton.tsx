import type { ComponentProps, MouseEvent } from "react";

import { cx } from "../../helpers/cx";

export type BaseButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "outline"
  | "ghost";

export type BaseButtonSize = "small" | "medium" | "large";

export type BaseButtonProps = Omit<ComponentProps<"button">, "type"> & {
  variant?: BaseButtonVariant;
  size?: BaseButtonSize;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  block?: boolean;
};

const BASE_CLASS =
  "inline-flex justify-center items-center gap-2 rounded font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2";

const SIZE_CLASSES: Record<BaseButtonSize, string> = {
  small: "px-3 py-2 text-sm",
  medium: "px-4 py-3 text-base",
  large: "px-6 py-4 text-lg",
};

const VARIANT_CLASSES: Record<BaseButtonVariant, string> = {
  primary:
    "bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary focus:ring-brand-primary",
  secondary:
    "bg-brand-secondary hover:bg-brand-secondary-hover text-brand-on-secondary focus:ring-brand-secondary",
  success:
    "bg-states-success hover:opacity-90 text-white focus:ring-states-success transition-opacity",
  warning:
    "bg-states-warning hover:opacity-90 text-white focus:ring-states-warning transition-opacity",
  outline:
    "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-on-primary focus:ring-brand-primary",
  ghost:
    "bg-transparent text-surface-on-surface-variant hover:text-surface-on-surface focus:ring-surface-on-surface",
};

const DISABLED_CLASS =
  "bg-surface-surface-disabled text-surface-on-surface cursor-not-allowed opacity-50";

export function BaseButton({
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  type = "button",
  block = false,
  className,
  children,
  onClick,
  ...props
}: BaseButtonProps) {
  const inactive = disabled || loading;

  const handleClick = onClick
    ? (event: MouseEvent<HTMLButtonElement>) => {
        if (!inactive) onClick(event);
      }
    : undefined;

  return (
    <button
      {...props}
      type={type}
      disabled={inactive}
      className={cx(
        BASE_CLASS,
        SIZE_CLASSES[size],
        inactive ? DISABLED_CLASS : VARIANT_CLASSES[variant],
        block && "w-full",
        className,
      )}
      onClick={handleClick}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      <span className={loading ? "opacity-0" : undefined}>{children}</span>
    </button>
  );
}
