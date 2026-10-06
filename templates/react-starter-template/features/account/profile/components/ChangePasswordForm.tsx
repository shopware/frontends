"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";

import { InputField } from "@/components/form/InputField";
import { useTranslations } from "@/i18n/I18nProvider";

import { changePassword } from "../profileApi";
import {
  emptyChangePasswordValues,
  validateChangePassword,
} from "../profileSchemas";
import { useCredentialChange } from "../useCredentialChange";

export function ChangePasswordForm() {
  const t = useTranslations();
  const { values, busy, formRef, errorFor, setField, touch, handleSubmit } =
    useCredentialChange({
      initialValues: emptyChangePasswordValues,
      validate: validateChangePassword,
      submit: changePassword,
      successMessage: t("account.changePassword.form.successUpdate"),
    });

  return (
    <form
      ref={formRef}
      className="flex max-w-md flex-col gap-4"
      data-testid="account-change-password-form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <InputField
        id="newPassword"
        type="password"
        label={t("account.changePassword.form.newPasswordLabel")}
        aria-required="true"
        autoComplete="new-password"
        value={values.newPassword}
        onChange={(event) => setField("newPassword", event.target.value)}
        onBlur={() => touch("newPassword")}
        error={errorFor("newPassword")}
      />
      <InputField
        id="newPasswordConfirm"
        type="password"
        label={t("account.changePassword.form.confirmPasswordLabel")}
        aria-required="true"
        autoComplete="new-password"
        value={values.newPasswordConfirm}
        onChange={(event) => setField("newPasswordConfirm", event.target.value)}
        onBlur={() => touch("newPasswordConfirm")}
        error={errorFor("newPasswordConfirm")}
      />
      <InputField
        id="currentPassword"
        type="password"
        label={t("account.changePassword.form.currentPasswordLabel")}
        aria-required="true"
        autoComplete="current-password"
        value={values.password}
        onChange={(event) => setField("password", event.target.value)}
        onBlur={() => touch("password")}
        error={errorFor("password")}
      />
      <div>
        <BaseButton
          type="submit"
          aria-busy={busy}
          aria-disabled={busy || undefined}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          {t("account.changePassword.form.buttonSubmit")}
        </BaseButton>
      </div>
    </form>
  );
}
