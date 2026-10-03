import { z } from "zod";

import type { RegistrationInput } from "@/features/session/types";

const t = {
  validations: {
    required: "Value is required",
    minLength: "This minimum length should be at least {min}",
    email: "Value is not a valid email address",
    requiredIf: "The value is required",
  },
};

export type AccountType = "private" | "business";

export type RegistrationValues = {
  accountType: AccountType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  vatId: string;
  company: string;
  street: string;
  zipcode: string;
  city: string;
  countryId: string;
  countryStateId: string;
};

export type RegistrationField = keyof RegistrationValues;

export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export type RegistrationSchemaOptions = { countryHasStates: boolean };

export const emptyRegistrationValues: RegistrationValues = {
  accountType: "private",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  vatId: "",
  company: "",
  street: "",
  zipcode: "",
  city: "",
  countryId: "",
  countryStateId: "",
};

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function minLengthMessage(min: number): string {
  return t.validations.minLength.replace("{min}", String(min));
}

function requiredString() {
  return z.string().refine((value) => !isBlank(value), t.validations.required);
}

function requiredMinLength(min: number) {
  return requiredString().min(min, minLengthMessage(min));
}

export function createRegistrationSchema({
  countryHasStates,
}: RegistrationSchemaOptions) {
  return z
    .object({
      accountType: z.enum(["private", "business"], t.validations.required),
      firstName: requiredMinLength(3),
      lastName: requiredMinLength(3),
      email: requiredString().pipe(z.email(t.validations.email)),
      password: requiredMinLength(8),
      vatId: z.string(),
      company: z.string(),
      street: requiredMinLength(3),
      zipcode: requiredString(),
      city: requiredString(),
      countryId: requiredString(),
      countryStateId: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.accountType === "business" && isBlank(values.company)) {
        ctx.addIssue({
          code: "custom",
          message: t.validations.requiredIf,
          path: ["company"],
        });
      }
      if (
        countryHasStates &&
        !isBlank(values.countryId) &&
        isBlank(values.countryStateId)
      ) {
        ctx.addIssue({
          code: "custom",
          message: t.validations.requiredIf,
          path: ["countryStateId"],
        });
      }
    });
}

function isRegistrationField(
  key: PropertyKey | undefined,
): key is RegistrationField {
  return typeof key === "string" && key in emptyRegistrationValues;
}

export function validateRegistration(
  values: RegistrationValues,
  options: RegistrationSchemaOptions,
): RegistrationErrors {
  const result = createRegistrationSchema(options).safeParse(values);
  if (result.success) return {};

  const errors: RegistrationErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (isRegistrationField(field) && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export function toRegistrationInput(
  values: RegistrationValues,
): RegistrationInput {
  const business = values.accountType === "business";

  const billingAddress: RegistrationInput["billingAddress"] = {
    id: "",
    customerId: "",
    firstName: values.firstName,
    lastName: values.lastName,
    street: values.street,
    zipcode: values.zipcode,
    city: values.city,
    countryId: values.countryId,
    ...(values.countryStateId ? { countryStateId: values.countryStateId } : {}),
    ...(business ? { company: values.company } : {}),
  };

  return {
    accountType: values.accountType,
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
    acceptedDataProtection: true,
    ...(business ? { vatIds: [values.vatId] } : {}),
    billingAddress,
  };
}
