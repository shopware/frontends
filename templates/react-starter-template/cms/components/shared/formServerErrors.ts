import type { CmsFormResult } from "../../actions/CmsActionsContext";

export type FormServerErrors<FIELD extends string> = {
  fields: Partial<Record<FIELD, string>>;
  form: string[];
};

export function emptyFormServerErrors<
  FIELD extends string,
>(): FormServerErrors<FIELD> {
  return { fields: {}, form: [] };
}

export function splitFormViolations<FIELD extends string>(
  result: CmsFormResult,
  fields: readonly FIELD[],
): FormServerErrors<FIELD> {
  const errors = emptyFormServerErrors<FIELD>();
  const violations = result.violations ?? [];
  if (!violations.length) {
    if (result.message?.trim()) errors.form.push(result.message);
    return errors;
  }
  for (const { field, message } of violations) {
    if (!message.trim()) continue;
    const known = fields.find((candidate) => candidate === field);
    if (known) {
      errors.fields[known] ??= message;
    } else if (!errors.form.includes(message)) {
      errors.form.push(message);
    }
  }
  return errors;
}

export function withoutFieldError<FIELD extends string>(
  errors: FormServerErrors<FIELD>,
  field: FIELD,
): FormServerErrors<FIELD> {
  if (errors.fields[field] === undefined) return errors;
  const fields: Partial<Record<FIELD, string>> = { ...errors.fields };
  delete fields[field];
  return { ...errors, fields };
}
