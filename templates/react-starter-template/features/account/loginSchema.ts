import { z } from "zod";

const t = {
  validations: {
    required: "Value is required",
    minLength: "This minimum length should be at least {min}",
    email: "Value is not a valid email address",
  },
};

export type LoginValues = { username: string; password: string };

export type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export const emptyLoginValues: LoginValues = { username: "", password: "" };

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

const required = (value: string) => !isBlank(value);

export const loginSchema = z.object({
  username: z
    .string()
    .refine(required, t.validations.required)
    .pipe(z.email(t.validations.email)),
  password: z
    .string()
    .refine(required, t.validations.required)
    .min(3, t.validations.minLength.replace("{min}", "3")),
});

export function validateLogin(values: LoginValues): LoginErrors {
  const result = loginSchema.safeParse(values);
  if (result.success) return {};

  const errors: LoginErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field === "username" || field === "password") {
      errors[field] ??= issue.message;
    }
  }
  return errors;
}
