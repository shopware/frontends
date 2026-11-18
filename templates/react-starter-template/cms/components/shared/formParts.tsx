"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type {
  CmsActionResult,
  CmsActions,
} from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { SpinnerIcon } from "../icons";
import { notifyActionError, notifyActionFailure } from "./actionNotifications";
import type { SwFormSalutation } from "./formSalutations";
import { fieldAria, fieldErrorId } from "./formValidation";
import type { FormField } from "./useFormValidation";

const INPUT_CLASS =
  "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-hidden focus:ring-2 focus:ring-brand-primary focus:z-10 sm:text-sm";
const INPUT_ERROR_CLASS = "border-red-600 focus:border-red-600";
const INPUT_VALID_CLASS =
  "border-outline-outline-variant focus:border-brand-primary";
export const FORM_SELECT_CLASS = `${INPUT_CLASS} ${INPUT_VALID_CLASS}`;
const ERROR_MESSAGE_CLASS =
  "pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300";

export function useFormSubmit(
  validateAll: () => boolean,
  submit: (actions: CmsActions) => Promise<CmsActionResult>,
  messages?: Record<string, string>,
) {
  const actions = useCmsActions();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function invokeSubmit() {
    if (loading || !validateAll()) return;
    setLoading(true);
    try {
      const result = await submit(actions);
      if (result.ok) setSent(true);
      else notifyActionFailure(actions, result, { messages });
    } catch (error) {
      notifyActionError(actions, error, { messages });
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    sent,
    onSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void invokeSubmit();
    },
  };
}

type FormShellProps = ReturnType<typeof useFormSubmit> & {
  title: string;
  confirmation: string;
  submitLabel: string;
  children: ReactNode;
};

export function FormShell({
  title,
  confirmation,
  submitLabel,
  loading,
  sent,
  onSubmit,
  children,
}: FormShellProps) {
  return (
    <form className="w-full relative" onSubmit={onSubmit}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
          <SpinnerIcon className="h-15 w-15 animate-spin text-gray-500" />
        </div>
      )}
      <h3 className="pb-3 mb-10 border-b border-gray-300">{title}</h3>
      {!sent && (
        <>
          <div className="grid grid-cols-12 gap-5">{children}</div>
          <div className="flex justify-end mt-10">
            <button
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-hidden focus:ring-2 focus:ring-brand-primary disabled:opacity-75"
              type="submit"
              disabled={loading}
            >
              {submitLabel}
            </button>
          </div>
        </>
      )}
      <div role="status">
        {sent && <p className="py-10 text-lg text-center">{confirmation}</p>}
      </div>
    </form>
  );
}

export function FormError({
  id,
  error,
  className = ERROR_MESSAGE_CLASS,
}: {
  id: string;
  error: string | undefined;
  className?: string;
}) {
  return error ? (
    <span id={fieldErrorId(id)} className={className}>
      {error}
    </span>
  ) : null;
}

type FormTextFieldProps = FormField & {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  rows?: number;
};

export function FormTextField({
  id,
  label,
  className,
  error,
  required,
  onChange,
  type = "text",
  rows,
  ...control
}: FormTextFieldProps) {
  const props = {
    ...control,
    ...fieldAria(id, { error, required }),
    id,
    className: cx(INPUT_CLASS, error ? INPUT_ERROR_CLASS : INPUT_VALID_CLASS),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
  };
  return (
    <div className={className}>
      <label htmlFor={id}>{required ? `${label} *` : label}</label>
      {rows ? (
        <textarea {...props} rows={rows} />
      ) : (
        <input {...props} type={type} />
      )}
      <FormError id={id} error={error} />
    </div>
  );
}

type FormSalutationSelectProps = {
  id: string;
  label: string;
  placeholder: string;
  salutations: SwFormSalutation[];
  value: string;
  onChange: (value: string) => void;
};

export function FormSalutationSelect({
  id,
  label,
  placeholder,
  salutations,
  value,
  onChange,
}: FormSalutationSelectProps) {
  return (
    <div className="col-span-4">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name="salutation"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FORM_SELECT_CLASS}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {salutations.map((salutation) => (
          <option key={salutation.id} value={salutation.id}>
            {salutation.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}

type FormPrivacyCheckboxProps = Omit<FormField, "onBlur"> & {
  id: string;
  legend: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function FormPrivacyCheckbox({
  id,
  legend,
  label,
  checked,
  onChange,
  ref,
  error,
  required,
}: FormPrivacyCheckboxProps) {
  return (
    <fieldset className="col-span-12">
      <legend>{`${legend} *`}</legend>
      <div className="flex gap-3 items-start">
        <input
          {...fieldAria(id, { error, required })}
          id={id}
          ref={ref}
          name="privacy"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className={cx(
            "mt-1 focus:ring-2 focus:ring-brand-primary h-4 w-4 border text-brand-primary rounded",
            error ? "border-red-600" : "border-gray-300",
          )}
        />
        <div>
          <label className={error ? "text-red-600" : undefined} htmlFor={id}>
            {label}
          </label>
          <FormError
            id={id}
            error={error}
            className={cx("block", ERROR_MESSAGE_CLASS)}
          />
        </div>
      </div>
    </fieldset>
  );
}
