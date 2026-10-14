"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { FieldLabel } from "@/components/form/FieldLabel";
import { INPUT_CLASS } from "@/components/input";
import { useTranslations } from "@/i18n/I18nProvider";

export type CustomerCommentProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function CustomerComment({
  value,
  onChange,
  className,
}: CustomerCommentProps) {
  const t = useTranslations();
  return (
    <div className={className}>
      <FieldLabel
        htmlFor="customer-comment"
        label={t("checkout.customerComment.label")}
      />
      <textarea
        id="customer-comment"
        name="customerComment"
        rows={4}
        data-testid="checkout-customer-comment-input"
        aria-describedby="customer-comment-hint"
        className={cx(INPUT_CLASS, "px-3")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p
        id="customer-comment-hint"
        className="mt-1 block text-xs text-surface-on-surface-variant"
      >
        {t("checkout.customerComment.hint")}
      </p>
    </div>
  );
}
