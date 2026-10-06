"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { getTranslatedProperty } from "@shopware/helpers";
import { useId, useState } from "react";

import type { Schemas } from "#shopware";

import { Modal } from "./Modal";

const t = {
  account: {
    orderDetails: {
      changePaymentMethod: "Change payment method",
      close: "Close",
      confirm: "Confirm",
    },
  },
  messages: {
    error: "An error occurred. Please try again.",
  },
  form: {
    loading: "Loading...",
  },
};

const SKELETON_ROWS = [0, 1, 2];

export type PaymentMethodsLoad =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; methods: Schemas["PaymentMethod"][] };

export type ChangePaymentModalProps = {
  open: boolean;
  methods: PaymentMethodsLoad;
  currentPaymentMethodId: string | null;
  busy: boolean;
  onClose: () => void;
  onConfirm: (paymentMethodId: string) => void;
};

export function ChangePaymentModal({
  open,
  ...props
}: ChangePaymentModalProps) {
  return (
    <Modal
      open={open}
      title={t.account.orderDetails.changePaymentMethod}
      closeLabel={t.account.orderDetails.close}
      onClose={() => {
        if (!props.busy) props.onClose();
      }}
      data-testid="change-payment-modal"
    >
      <ChangePaymentForm {...props} />
    </Modal>
  );
}

function ChangePaymentForm({
  methods,
  currentPaymentMethodId,
  busy,
  onClose,
  onConfirm,
}: Omit<ChangePaymentModalProps, "open">) {
  const legendId = useId();
  const [selectedId, setSelectedId] = useState<string | null>(
    currentPaymentMethodId,
  );
  const confirmableId =
    methods.status === "ready" &&
    methods.methods.some((method) => method.id === selectedId)
      ? selectedId
      : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (confirmableId && !busy) onConfirm(confirmableId);
      }}
    >
      <fieldset className="space-y-4">
        <legend id={legendId} className="sr-only">
          {t.account.orderDetails.changePaymentMethod}
        </legend>
        {methods.status === "loading" ? (
          <div aria-busy="true">
            <output className="sr-only">{t.form.loading}</output>
            {SKELETON_ROWS.map((row) => (
              <div
                key={row}
                className="mb-4 flex animate-pulse items-center"
                aria-hidden="true"
              >
                <div className="mr-3 size-4 rounded-full bg-surface-surface-container" />
                <div className="grow">
                  <div className="mb-2 h-5 w-1/3 rounded bg-surface-surface-container" />
                  <div className="h-4 w-2/3 rounded bg-surface-surface-container" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {methods.status === "error" ? (
          <p role="alert" className="text-sm text-states-error">
            {t.messages.error}
          </p>
        ) : null}
        {methods.status === "ready"
          ? methods.methods.map((method) => {
              const inputId = `${legendId}-${method.id}`;
              const description = getTranslatedProperty(method, "description");
              return (
                <div key={method.id} className="flex items-center">
                  <input
                    id={inputId}
                    type="radio"
                    name="order-payment-method"
                    value={method.id}
                    className="mr-3 accent-brand-primary"
                    checked={selectedId === method.id}
                    aria-disabled={busy || undefined}
                    data-testid={`checkout-payment-method-${method.id}`}
                    aria-describedby={
                      description ? `${inputId}-description` : undefined
                    }
                    onChange={() => {
                      if (!busy) setSelectedId(method.id);
                    }}
                  />
                  <label htmlFor={inputId} className="grow">
                    <span className="font-medium text-surface-on-surface">
                      {getTranslatedProperty(method, "name") || method.name}
                    </span>
                    {description ? (
                      <span
                        id={`${inputId}-description`}
                        className="block text-sm text-surface-on-surface-variant"
                      >
                        {description}
                      </span>
                    ) : null}
                  </label>
                </div>
              );
            })
          : null}
      </fieldset>
      <div className="mt-6 flex justify-end gap-3">
        <BaseButton
          variant="secondary"
          size="small"
          disabled={busy}
          onClick={onClose}
        >
          {t.account.orderDetails.close}
        </BaseButton>
        <BaseButton
          type="submit"
          size="small"
          disabled={!confirmableId}
          aria-busy={busy}
          aria-disabled={busy || undefined}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          data-testid="change-payment-confirm-button"
        >
          {t.account.orderDetails.confirm}
        </BaseButton>
      </div>
    </form>
  );
}
