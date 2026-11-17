import { useRef, useState } from "react";

import {
  firstInvalidField,
  isRequiredField,
  validateForm,
} from "./formValidation";
import type { FormRules } from "./formValidation";

export type FormField = {
  ref: (element: HTMLElement | null) => void;
  error: string | undefined;
  required: boolean;
  onBlur: () => void;
};

export type UseFormValidationReturn<VALUES extends object> = {
  field: (key: keyof VALUES) => FormField;
  validateAll: () => boolean;
  reset: () => void;
};

export function useFormValidation<VALUES extends object>(
  values: VALUES,
  rules: FormRules<VALUES>,
): UseFormValidationReturn<VALUES> {
  const [touched, setTouched] = useState<{ [KEY in keyof VALUES]?: true }>({});
  const [submitted, setSubmitted] = useState(false);
  const elements = useRef<{ [KEY in keyof VALUES]?: HTMLElement | null }>({});

  const errors = validateForm(values, rules);
  const firstInvalid = firstInvalidField(errors);

  const field = (key: keyof VALUES): FormField => ({
    ref: (element) => {
      elements.current[key] = element;
    },
    error: submitted || touched[key] ? errors[key] : undefined,
    required: isRequiredField(rules, key),
    onBlur: () =>
      setTouched((current) =>
        current[key] ? current : { ...current, [key]: true },
      ),
  });

  const validateAll = () => {
    setSubmitted(true);
    if (firstInvalid === undefined) return true;
    elements.current[firstInvalid]?.focus();
    return false;
  };

  const reset = () => {
    setTouched({});
    setSubmitted(false);
  };

  return { field, validateAll, reset };
}
