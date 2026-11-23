"use client";

import { useTranslations } from "@/i18n/I18nProvider";

export type OrderCustomerCommentProps = {
  comment: string | null | undefined;
  className?: string;
};

export function OrderCustomerComment({
  comment,
  className,
}: OrderCustomerCommentProps) {
  const t = useTranslations();
  if (!comment?.trim()) return null;
  return (
    <div className={className} data-testid="order-customer-comment">
      <h3 className="mb-3 leading-normal font-bold text-surface-on-surface">
        {t("checkout.customerComment.summaryLabel")}
      </h3>
      <p className="border border-outline-outline p-4 break-words whitespace-pre-line text-surface-on-surface">
        {comment}
      </p>
    </div>
  );
}
