"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";

import { InputField } from "@/components/form/InputField";
import { useTranslations } from "@/i18n/I18nProvider";

import { changeEmail } from "../profileApi";
import { emptyChangeEmailValues, validateChangeEmail } from "../profileSchemas";
import { useCredentialChange } from "../useCredentialChange";

export function ChangeEmailForm() {
  const t = useTranslations();
  const { values, busy, formRef, errorFor, setField, touch, handleSubmit } =
    useCredentialChange({
      initialValues: emptyChangeEmailValues,
      validate: validateChangeEmail,
      submit: changeEmail,
      successMessage: t("account.changeEmail.form.successUpdate"),
    });

  return (
    <form
      ref={formRef}
      className="flex max-w-md flex-col gap-4"
      data-testid="account-change-email-form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <InputField
        id="newEmail"
        data-testid="account-personal-data-email-input"
        type="email"
        label={t("account.changeEmail.form.newEmailLabel")}
        aria-required="true"
        autoComplete="off"
        value={values.email}
        onChange={(event) => setField("email", event.target.value)}
        onBlur={() => touch("email")}
        error={errorFor("email")}
      />
      <InputField
        id="confirmEmail"
        type="email"
        label={t("account.changeEmail.form.confirmEmailLabel")}
        aria-required="true"
        autoComplete="off"
        value={values.emailConfirmation}
        onChange={(event) => setField("emailConfirmation", event.target.value)}
        onBlur={() => touch("emailConfirmation")}
        error={errorFor("emailConfirmation")}
      />
      <InputField
        id="password"
        type="password"
        label={t("account.changeEmail.form.passwordLabel")}
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
          {t("account.changeEmail.form.buttonSubmit")}
        </BaseButton>
      </div>
    </form>
  );
}
