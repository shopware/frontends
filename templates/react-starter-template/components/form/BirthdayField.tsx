"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { ChevronDownIcon } from "@/components/icons";
import { INPUT_CLASS } from "@/components/input";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";

import {
  BIRTHDAY_PARTS,
  birthdayDayOptions,
  birthdayMonthOptions,
  birthdayYearOptions,
} from "./birthday";
import type { BirthdayPart, BirthdayParts } from "./birthday";
import type { SelectOption } from "./SelectField";

export type BirthdayFieldProps = {
  id?: string;
  testIdPrefix?: string;
  required?: boolean;
  value: BirthdayParts;
  errors?: Partial<Record<BirthdayPart, string>>;
  birthYearMax: number;
  onChange: (part: BirthdayPart, value: string) => void;
  onBlur?: (part: BirthdayPart) => void;
  className?: string;
};

const PART_LABEL_KEYS = {
  day: "form.birthdayDay",
  month: "form.birthdayMonth",
  year: "form.birthdayYear",
} as const;

const PART_AUTOCOMPLETE = {
  day: "bday-day",
  month: "bday-month",
  year: "bday-year",
} as const;

export function BirthdayField({
  id = "birthday",
  testIdPrefix,
  required = false,
  value,
  errors = {},
  birthYearMax,
  onChange,
  onBlur,
  className,
}: BirthdayFieldProps) {
  const t = useTranslations();
  const locale = useLocale();
  const errorId = `${id}-error`;
  const error = BIRTHDAY_PARTS.map((part) => errors[part]).find(Boolean);
  const options: Record<BirthdayPart, SelectOption[]> = {
    day: birthdayDayOptions(),
    month: birthdayMonthOptions(locale),
    year: birthdayYearOptions(birthYearMax),
  };

  return (
    <fieldset className={cx("min-w-0", className)}>
      <legend className="mb-1 block text-sm text-surface-on-surface">
        {t("form.birthday")}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-states-error">
            *
          </span>
        ) : null}
      </legend>
      <div className="grid grid-cols-3 gap-3">
        {BIRTHDAY_PARTS.map((part) => {
          const selectId = `${id}-${part}`;
          const label = t(PART_LABEL_KEYS[part]);
          const invalid = Boolean(errors[part]);
          return (
            <div key={part}>
              <label htmlFor={selectId} className="sr-only">
                {label}
              </label>
              <div className="relative">
                <select
                  id={selectId}
                  className={cx(INPUT_CLASS, "appearance-none px-3 pr-8")}
                  data-testid={
                    testIdPrefix ? `${testIdPrefix}-${part}-select` : undefined
                  }
                  autoComplete={PART_AUTOCOMPLETE[part]}
                  required={required}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                  value={value[part]}
                  onChange={(event) => onChange(part, event.target.value)}
                  onBlur={() => onBlur?.(part)}
                >
                  <option value="">{label}</option>
                  {options[part].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-surface-on-surface-variant" />
              </div>
            </div>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} className="mt-1 block text-xs text-states-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
