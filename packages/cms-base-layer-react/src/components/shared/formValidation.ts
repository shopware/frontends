export type FormValidator = {
  validate: (value: unknown) => boolean;
  message: string;
};

export type FormRules<VALUES extends object> = {
  [KEY in keyof VALUES]?: FormValidator[];
};

export type FormErrors<VALUES extends object> = {
  [KEY in keyof VALUES]?: string;
};

export const REQUIRED_MESSAGE = "Value is required";
export const EMAIL_MESSAGE = "Value is not a valid email address";

export function minLengthMessage(min: number): string {
  return `This field should be at least ${min} characters long`;
}

const EMAIL_REGEX =
  /^[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?$/i;

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (value === undefined || value === null) return false;
  if (value === false) return true;
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (typeof value === "object") return Object.keys(value).length > 0;
  return String(value).length > 0;
}

function lengthOf(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (value !== null && typeof value === "object") {
    return Object.keys(value).length;
  }
  return String(value).length;
}

export const required: FormValidator = {
  validate: (value) =>
    hasValue(typeof value === "string" ? value.trim() : value),
  message: REQUIRED_MESSAGE,
};

export const email: FormValidator = {
  validate: (value) => !hasValue(value) || EMAIL_REGEX.test(String(value)),
  message: EMAIL_MESSAGE,
};

export function minLength(min: number): FormValidator {
  return {
    validate: (value) => !hasValue(value) || lengthOf(value) >= min,
    message: minLengthMessage(min),
  };
}

export const isTrue: FormValidator = {
  validate: (value) => value === true,
  message: "",
};

export function validateForm<VALUES extends object>(
  values: VALUES,
  rules: FormRules<VALUES>,
): FormErrors<VALUES> {
  const errors: FormErrors<VALUES> = {};
  for (const key of Object.keys(rules) as Array<keyof VALUES>) {
    const validators = rules[key];
    if (!validators) continue;
    const failing = validators.find(
      (validator) => !validator.validate(values[key]),
    );
    if (failing) errors[key] = failing.message;
  }
  return errors;
}
