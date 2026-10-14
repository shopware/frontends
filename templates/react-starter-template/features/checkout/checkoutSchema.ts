import { z } from "zod";

import type { RegistrationInput } from "@/features/session/types";
import type { Translate } from "@/i18n/translate";

import type { CheckoutAddressFields } from "./checkoutApi";

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

export type CheckoutAddressField =
  | "firstName"
  | "lastName"
  | "street"
  | "zipcode"
  | "city"
  | "countryId"
  | "countryStateId";

export type CheckoutAddressValues = Pick<CheckoutValues, CheckoutAddressField>;

export type CheckoutAddressErrors = Partial<
  Record<CheckoutAddressField, string>
>;

export type CheckoutAddressOptions = {
  countryHasStates: boolean;
};

export type CheckoutSchemaOptions = CheckoutAddressOptions & {
  createAccount: boolean;
  passwordMinLength: number;
};

export type CheckoutRegistrationOptions = {
  createAccount: boolean;
  acceptedDataProtection: boolean;
  shippingAddress?: CheckoutAddressValues | null;
};

export const emptyCheckoutAddressValues: CheckoutAddressValues = {
  firstName: "",
  lastName: "",
  street: "",
  zipcode: "",
  city: "",
  countryId: "",
  countryStateId: "",
};

export const emptyCheckoutValues: CheckoutValues = {
  email: "",
  password: "",
  ...emptyCheckoutAddressValues,
};

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function requiredString(t: Translate) {
  return z
    .string()
    .refine((value) => !isBlank(value), t("validations.required"));
}

function requiredMinLength(min: number, t: Translate) {
  return requiredString(t).min(min, t("validations.minLength", { min }));
}

function addressShape(t: Translate) {
  return {
    firstName: requiredMinLength(3, t),
    lastName: requiredMinLength(3, t),
    street: requiredMinLength(3, t),
    zipcode: requiredString(t),
    city: requiredString(t),
    countryId: requiredString(t),
    countryStateId: z.string(),
  };
}

function requireState(countryHasStates: boolean, t: Translate) {
  return (values: { countryStateId: string }, ctx: z.RefinementCtx) => {
    if (countryHasStates && isBlank(values.countryStateId)) {
      ctx.addIssue({
        code: "custom",
        message: t("validations.requiredIf"),
        path: ["countryStateId"],
      });
    }
  };
}

export function createCheckoutSchema(
  { createAccount, countryHasStates, passwordMinLength }: CheckoutSchemaOptions,
  t: Translate,
) {
  return z
    .object({
      email: requiredString(t).pipe(z.email(t("validations.email"))),
      password: createAccount
        ? requiredMinLength(passwordMinLength, t)
        : z.string(),
      ...addressShape(t),
    })
    .superRefine(requireState(countryHasStates, t));
}

export function createCheckoutAddressSchema(
  { countryHasStates }: CheckoutAddressOptions,
  t: Translate,
) {
  return z
    .object(addressShape(t))
    .superRefine(requireState(countryHasStates, t));
}

function firstIssues<Field extends string>(
  issues: readonly z.core.$ZodIssue[],
  fields: Record<Field, string>,
): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (
      typeof field === "string" &&
      Object.hasOwn(fields, field) &&
      !errors[field as Field]
    ) {
      errors[field as Field] = issue.message;
    }
  }
  return errors;
}

export function validateCheckout(
  values: CheckoutValues,
  options: CheckoutSchemaOptions,
  t: Translate,
): CheckoutErrors {
  const result = createCheckoutSchema(options, t).safeParse(values);
  if (result.success) return {};
  return firstIssues(result.error.issues, emptyCheckoutValues);
}

export function validateCheckoutAddress(
  values: CheckoutAddressValues,
  options: CheckoutAddressOptions,
  t: Translate,
): CheckoutAddressErrors {
  const result = createCheckoutAddressSchema(options, t).safeParse(values);
  if (result.success) return {};
  return firstIssues(result.error.issues, emptyCheckoutAddressValues);
}

export function toCheckoutAddressFields(
  values: CheckoutAddressValues,
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

export function toBillingAddressFields(
  values: CheckoutValues,
): CheckoutAddressFields {
  return toCheckoutAddressFields(values);
}

export function toCheckoutRegistration(
  values: CheckoutValues,
  {
    createAccount,
    acceptedDataProtection,
    shippingAddress = null,
  }: CheckoutRegistrationOptions,
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
      ...toCheckoutAddressFields(values),
    },
    ...(shippingAddress
      ? {
          shippingAddress: {
            customerId: "",
            id: "",
            ...toCheckoutAddressFields(shippingAddress),
          },
        }
      : {}),
    acceptedDataProtection,
  };
}
