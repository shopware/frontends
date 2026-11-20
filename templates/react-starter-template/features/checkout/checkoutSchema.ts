import { z } from "zod";

import {
  hiddenAddressFields,
  shownAddressFields,
} from "@/features/account/address/addressSchema";
import type { AddressFieldSettings } from "@/features/account/address/addressSchema";
import {
  REGISTRATION_MAX_LENGTHS,
  textField,
} from "@/features/account/registrationSchema";
import type { RegistrationInput } from "@/features/session/types";
import type { Translate } from "@/i18n/translate";

import type { CheckoutAddressFields } from "./checkoutApi";

export type CheckoutValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  street: string;
  additionalAddressLine1: string;
  additionalAddressLine2: string;
  zipcode: string;
  city: string;
  countryId: string;
  countryStateId: string;
  phoneNumber: string;
};

export type CheckoutField = keyof CheckoutValues;

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export type CheckoutAddressField =
  | "firstName"
  | "lastName"
  | "street"
  | "additionalAddressLine1"
  | "additionalAddressLine2"
  | "zipcode"
  | "city"
  | "countryId"
  | "countryStateId"
  | "phoneNumber";

export type CheckoutAddressValues = Pick<CheckoutValues, CheckoutAddressField>;

export type CheckoutAddressErrors = Partial<
  Record<CheckoutAddressField, string>
>;

export type CheckoutAddressOptions = {
  countryHasStates: boolean;
  addressFields?: AddressFieldSettings;
};

export type CheckoutSchemaOptions = CheckoutAddressOptions & {
  createAccount: boolean;
  passwordMinLength: number;
};

export type CheckoutRegistrationOptions = {
  createAccount: boolean;
  acceptedDataProtection: boolean;
  shippingAddress?: CheckoutAddressValues | null;
  addressFields: AddressFieldSettings;
};

export const emptyCheckoutAddressValues: CheckoutAddressValues = {
  firstName: "",
  lastName: "",
  street: "",
  additionalAddressLine1: "",
  additionalAddressLine2: "",
  zipcode: "",
  city: "",
  countryId: "",
  countryStateId: "",
  phoneNumber: "",
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

function addressShape(t: Translate, settings: AddressFieldSettings) {
  return {
    firstName: requiredMinLength(2, t),
    lastName: requiredMinLength(2, t),
    street: requiredMinLength(3, t),
    additionalAddressLine1: textField(t, {
      shown: settings.showAdditionalAddressField1,
      required: settings.additionalAddressField1Required,
    }),
    additionalAddressLine2: textField(t, {
      shown: settings.showAdditionalAddressField2,
      required: settings.additionalAddressField2Required,
    }),
    zipcode: requiredString(t),
    city: requiredString(t),
    countryId: requiredString(t),
    countryStateId: z.string(),
    phoneNumber: textField(t, {
      shown: settings.showPhoneNumberField,
      required: settings.phoneNumberFieldRequired,
      max: REGISTRATION_MAX_LENGTHS.phoneNumber,
    }),
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
  {
    createAccount,
    countryHasStates,
    passwordMinLength,
    addressFields = hiddenAddressFields,
  }: CheckoutSchemaOptions,
  t: Translate,
) {
  return z
    .object({
      email: requiredString(t).pipe(z.email(t("validations.email"))),
      password: createAccount
        ? requiredMinLength(passwordMinLength, t)
        : z.string(),
      ...addressShape(t, addressFields),
    })
    .superRefine(requireState(countryHasStates, t));
}

export function createCheckoutAddressSchema(
  {
    countryHasStates,
    addressFields = hiddenAddressFields,
  }: CheckoutAddressOptions,
  t: Translate,
) {
  return z
    .object(addressShape(t, addressFields))
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
  addressFields: AddressFieldSettings,
): CheckoutAddressFields {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    street: values.street,
    zipcode: values.zipcode,
    city: values.city,
    countryId: values.countryId,
    countryStateId: values.countryStateId || undefined,
    ...shownAddressFields(values, addressFields),
  };
}

export function toCheckoutRegistration(
  values: CheckoutValues,
  {
    createAccount,
    acceptedDataProtection,
    shippingAddress = null,
    addressFields,
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
      ...toCheckoutAddressFields(values, addressFields),
    },
    ...(shippingAddress
      ? {
          shippingAddress: {
            customerId: "",
            id: "",
            ...toCheckoutAddressFields(shippingAddress, addressFields),
          },
        }
      : {}),
    acceptedDataProtection,
  };
}
