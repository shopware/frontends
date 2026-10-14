"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { useTranslations } from "@/i18n/I18nProvider";

const LINK_BUTTON_CLASS =
  "inline-flex items-center gap-1 rounded-sm text-sm font-bold text-brand-primary hover:underline focus-visible:ring-2 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden";

export type CheckoutSignInPromptProps = {
  onSignIn: () => void;
  className?: string;
};

export function CheckoutSignInPrompt({
  onSignIn,
  className,
}: CheckoutSignInPromptProps) {
  const t = useTranslations();
  return (
    <p
      data-testid="checkout-sign-in-prompt"
      className={cx("text-sm text-surface-on-surface", className)}
    >
      {t("checkout.signInPrompt.text")}{" "}
      <button
        type="button"
        aria-haspopup="dialog"
        data-testid="checkout-sign-in-link"
        className={LINK_BUTTON_CLASS}
        onClick={onSignIn}
      >
        {t("checkout.signInPrompt.action")}
      </button>
    </p>
  );
}
