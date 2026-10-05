import { z } from "zod";

import type { RegistrationInput } from "@/features/session/types";

import type { CheckoutAddressFields } from "./checkoutApi";

const t = {
  validations: {
    required: "Value is required",
    minLength: "This minimum length should be at least {min}",
    email: "Value is not a valid email address",
    requiredIf: "The value is required",
  },
};

export type CheckoutValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  street: string;
  zipcode: string;
  city: string;
  countryId: string;
  countryStateId: string;
};

export type CheckoutField = keyof CheckoutValues;

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export type CheckoutSchemaOptions = {
  createAccount: boolean;
  countryHasStates: boolean;
};

export const emptyCheckoutValues: CheckoutValues = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
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

export function createCheckoutSchema({
  createAccount,
  countryHasStates,
}: CheckoutSchemaOptions) {
  return z
    .object({
      email: requiredString().pipe(z.email(t.validations.email)),
      password: createAccount ? requiredMinLength(8) : z.string(),
      firstName: requiredMinLength(3),
      lastName: requiredMinLength(3),
      street: requiredMinLength(3),
      zipcode: requiredString(),
      city: requiredString(),
      countryId: requiredString(),
      countryStateId: z.string(),
    })
    .superRefine((values, ctx) => {
      if (countryHasStates && isBlank(values.countryStateId)) {
        ctx.addIssue({
          code: "custom",
          message: t.validations.requiredIf,
          path: ["countryStateId"],
        });
      }
    });
}

function isCheckoutField(key: PropertyKey | undefined): key is CheckoutField {
  return typeof key === "string" && Object.hasOwn(emptyCheckoutValues, key);
}

export function validateCheckout(
  values: CheckoutValues,
  options: CheckoutSchemaOptions,
): CheckoutErrors {
  const result = createCheckoutSchema(options).safeParse(values);
  if (result.success) return {};

  const errors: CheckoutErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (isCheckoutField(field) && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export function toBillingAddressFields(
  values: CheckoutValues,
): CheckoutAddressFields {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    street: values.street,
    zipcode: values.zipcode,
    city: values.city,
    countryId: values.countryId,
    countryStateId: values.countryStateId || undefined,
  };
}

export function toCheckoutRegistration(
  values: CheckoutValues,
  createAccount: boolean,
): RegistrationInput {
  return {
    accountType: "private",
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    password: createAccount ? values.password : "",
    guest: !createAccount,
    billingAddress: {
      customerId: "",
      id: "",
      ...toBillingAddressFields(values),
    },
    acceptedDataProtection: true,
  };
}
