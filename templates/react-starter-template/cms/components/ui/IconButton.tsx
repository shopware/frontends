import type { ComponentProps } from "react";

import { cx } from "../../helpers/cx";

export type IconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost";

export type IconButtonProps = Omit<ComponentProps<"button">, "type"> & {
  variant?: IconButtonVariant;
  type?: "button" | "submit" | "reset";
};

const STYLES: Record<IconButtonVariant, string> = {
  primary:
    "bg-brand-primary hover:focus:bg-brand-primary-hover text-brand-on-primary",
  secondary:
    "bg-brand-secondary hover:focus:bg-brand-secondary-hover text-brand-on-secondary",
  tertiary:
    "bg-brand-tertiary hover:focus:bg-brand-tertiary-hover text-brand-on-tertiary",
  outline:
    "text-brand-primary bg-transparent hover:focus:bg-surface-surface-container outline outline-2 outline-offset-[-2px] outline-brand-primary",
  ghost: "bg-transparent hover:focus:bg-surface-surface-container",
};

export function IconButton({
  variant = "primary",
  type = "button",
  disabled,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={cx(
        STYLES[variant],
        disabled &&
          "bg-surface-on-surface-disabled text-surface-surface-disabled",
        variant !== "ghost" && "w-10 h-10",
        className,
      )}
    >
      {children}
    </button>
  );
}
