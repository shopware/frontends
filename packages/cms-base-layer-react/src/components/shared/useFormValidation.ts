import { useState } from "react";

import { validateForm } from "./formValidation";
import type { FormErrors, FormRules } from "./formValidation";

export type UseFormValidationReturn<VALUES extends object> = {
  errors: FormErrors<VALUES>;
  isValid: boolean;
  touch: (key: keyof VALUES) => void;
  touchAll: () => void;
  hasError: (key: keyof VALUES) => boolean;
  errorMessage: (key: keyof VALUES) => string | undefined;
};

export function useFormValidation<VALUES extends object>(
  values: VALUES,
  rules: FormRules<VALUES>,
): UseFormValidationReturn<VALUES> {
  const [touched, setTouched] = useState<{ [KEY in keyof VALUES]?: true }>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateForm(values, rules);
  const isValid = Object.keys(errors).length === 0;

  const touch = (key: keyof VALUES) => {
    setTouched((current) =>
      current[key] ? current : { ...current, [key]: true },
    );
  };

  const touchAll = () => setSubmitted(true);

  const hasError = (key: keyof VALUES) =>
    (submitted || touched[key] === true) && errors[key] !== undefined;

  const errorMessage = (key: keyof VALUES) =>
    hasError(key) ? errors[key] || undefined : undefined;

  return { errors, isValid, touch, touchAll, hasError, errorMessage };
}
