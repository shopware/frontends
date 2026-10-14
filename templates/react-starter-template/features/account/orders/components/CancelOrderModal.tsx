"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";

import { Modal } from "@/components/Modal";
import { useTranslations } from "@/i18n/I18nProvider";

export type CancelOrderModalProps = {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelOrderModal({
  open,
  busy,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const t = useTranslations();
  const close = () => {
    if (!busy) onClose();
  };
  return (
    <Modal
      open={open}
      title={t("account.orderDetails.cancelOrder")}
      closeLabel={t("account.orderDetails.close")}
      onClose={close}
      data-testid="cancel-order-modal"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy) onConfirm();
        }}
      >
        <p className="mb-3 text-sm text-surface-on-surface-variant">
          {t("account.orderDetails.cancelOrderNotice")}
        </p>
        <p className="font-medium text-surface-on-surface">
          {t("account.orderDetails.cancelOrderQuestion")}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <BaseButton
            variant="secondary"
            size="small"
            aria-disabled={busy || undefined}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            onClick={close}
          >
            {t("account.back")}
          </BaseButton>
          <BaseButton
            type="submit"
            size="small"
            aria-busy={busy}
            aria-disabled={busy || undefined}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            data-testid="cancel-order-confirm-button"
          >
            {t("account.orderDetails.cancelOrder")}
          </BaseButton>
        </div>
      </form>
    </Modal>
  );
}
