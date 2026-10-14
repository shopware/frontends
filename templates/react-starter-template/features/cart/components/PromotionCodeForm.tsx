"use client";

import {
  BaseButton,
  cx,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { FieldLabel } from "@/components/form/FieldLabel";
import { INPUT_CLASS } from "@/components/input";
import {
  isPromotionCodeApplied,
  normalizePromotionCode,
} from "@/features/cart/promotionCode";
import { useCart } from "@/features/cart/useCart";
import { useTranslations } from "@/i18n/I18nProvider";

import { cartNotifications } from "./useLineItemActions";

export type PromotionCodeFormProps = { id: string; className?: string };

export function PromotionCodeForm({ id, className }: PromotionCodeFormProps) {
  const { appliedPromotionCodes, addPromotionCode } = useCart();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const [code, setCode] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `${id}-input`;
  const errorId = `${id}-error`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    if (!normalizePromotionCode(code)) {
      setFieldError(t("validations.required"));
      inputRef.current?.focus();
      return;
    }
    if (isPromotionCodeApplied(appliedPromotionCodes, code)) {
      notify({ type: "info", message: t("cart.promotionCode.alreadyApplied") });
      setCode("");
      return;
    }

    submitting.current = true;
    setPending(true);
    setFieldError(null);
    try {
      const result = await addPromotionCode(code);
      const notifications = cartNotifications(result, t);
      if (result.applied) {
        notify({ type: "success", message: t("cart.promotionCode.added") });
        setCode("");
      } else {
        const message =
          notifications[0]?.message ?? t("cart.promotionCode.notApplied");
        if (notifications.length === 0) {
          notify({ type: result.ok ? "info" : "error", message });
        }
        setFieldError(message);
        inputRef.current?.focus();
      }
      for (const notification of notifications) notify(notification);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <form
      noValidate
      className={className}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <FieldLabel htmlFor={inputId} label={t("cart.promotionCode.label")} />
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={inputId}
          name="promoCode"
          type="text"
          value={code}
          autoComplete="off"
          spellCheck={false}
          placeholder={t("form.promoCodePlaceholder")}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? errorId : undefined}
          data-testid="cart-promotion-code-input"
          className={cx(INPUT_CLASS, "min-w-0 flex-1 px-3")}
          onChange={(event) => {
            setCode(event.target.value);
            setFieldError(null);
          }}
        />
        <BaseButton
          type="submit"
          variant="secondary"
          size="small"
          aria-busy={pending || undefined}
          data-testid="cart-promotion-code-submit"
          className="shrink-0"
        >
          {t("cart.promotionCode.apply")}
        </BaseButton>
      </div>
      {fieldError ? (
        <p id={errorId} className="mt-1 block text-xs text-states-error">
          {fieldError}
        </p>
      ) : null}
    </form>
  );
}
