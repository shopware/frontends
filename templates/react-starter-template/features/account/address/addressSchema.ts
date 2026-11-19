import { z } from "zod";

import type { Schemas } from "#shopware";
import {
  REGISTRATION_MAX_LENGTHS,
  textField,
} from "@/features/account/registrationSchema";
import type { Translate } from "@/i18n/translate";
import type { LoginRegistrationSettings } from "@/platform/shopware/shopSettings";

import type { AddressBody } from "./addressApi";

export type AddressValues = {
  salutationId: string;
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

export type AddressField = keyof AddressValues;

export type AddressErrors = Partial<Record<AddressField, string>>;

export type AddressFieldSettings = Pick<
  LoginRegistrationSettings,
  | "showAdditionalAddressField1"
  | "additionalAddressField1Required"
  | "showAdditionalAddressField2"
  | "additionalAddressField2Required"
  | "showPhoneNumberField"
  | "phoneNumberFieldRequired"
>;

export const hiddenAddressFields: AddressFieldSettings = {
  showAdditionalAddressField1: false,
  additionalAddressField1Required: false,
  showAdditionalAddressField2: false,
  additionalAddressField2Required: false,
  showPhoneNumberField: false,
  phoneNumberFieldRequired: false,
};

export type AddressSchemaOptions = {
  countryHasStates: boolean;
  settings: AddressFieldSettings;
};

export const emptyAddressValues: AddressValues = {
  salutationId: "",
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

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function requiredString(t: Translate) {
  return z
    .string()
    .refine((value) => !isBlank(value), t("validations.required"));
}

function requiredMinLength(t: Translate, min: number) {
  return requiredString(t).min(min, t("validations.minLength", { min }));
}

export function createAddressSchema(
  { countryHasStates, settings }: AddressSchemaOptions,
  t: Translate,
) {
  return z
    .object({
      salutationId: requiredString(t),
      firstName: requiredMinLength(t, 2),
      lastName: requiredMinLength(t, 2),
      street: requiredMinLength(t, 3),
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
    })
    .superRefine((values, ctx) => {
      if (countryHasStates && isBlank(values.countryStateId)) {
        ctx.addIssue({
          code: "custom",
          message: t("validations.requiredIf"),
          path: ["countryStateId"],
        });
      }
    });
}

function isAddressField(key: PropertyKey | undefined): key is AddressField {
  return typeof key === "string" && Object.hasOwn(emptyAddressValues, key);
}

export function validateAddress(
  values: AddressValues,
  options: AddressSchemaOptions,
  t: Translate,
): AddressErrors {
  const result = createAddressSchema(options, t).safeParse(values);
  if (result.success) return {};

  const errors: AddressErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (isAddressField(field) && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export function addressValuesFrom(
  address: Pick<
    Schemas["CustomerAddress"],
    | "salutationId"
    | "firstName"
    | "lastName"
    | "street"
    | "additionalAddressLine1"
    | "additionalAddressLine2"
    | "zipcode"
    | "city"
    | "countryId"
    | "countryStateId"
    | "phoneNumber"
  >,
): AddressValues {
  return {
    salutationId: address.salutationId ?? "",
    firstName: address.firstName ?? "",
    lastName: address.lastName ?? "",
    street: address.street ?? "",
    additionalAddressLine1: address.additionalAddressLine1 ?? "",
    additionalAddressLine2: address.additionalAddressLine2 ?? "",
    zipcode: address.zipcode ?? "",
    city: address.city ?? "",
    countryId: address.countryId ?? "",
    countryStateId: address.countryStateId ?? "",
    phoneNumber: address.phoneNumber ?? "",
  };
}

type OptionalAddressField =
  | "additionalAddressLine1"
  | "additionalAddressLine2"
  | "phoneNumber";

export function shownAddressFields(
  values: Pick<AddressValues, OptionalAddressField>,
  settings: AddressFieldSettings,
): Partial<Record<OptionalAddressField, string>> {
  return {
    ...(settings.showAdditionalAddressField1
      ? { additionalAddressLine1: values.additionalAddressLine1.trim() }
      : {}),
    ...(settings.showAdditionalAddressField2
      ? { additionalAddressLine2: values.additionalAddressLine2.trim() }
      : {}),
    ...(settings.showPhoneNumberField
      ? { phoneNumber: values.phoneNumber.trim() }
      : {}),
  };
}

export function toAddressBody(
  values: AddressValues,
  settings: AddressFieldSettings,
): AddressBody {
  return {
    salutationId: values.salutationId,
    firstName: values.firstName,
    lastName: values.lastName,
    street: values.street,
    zipcode: values.zipcode,
    city: values.city,
    countryId: values.countryId,
    ...(values.countryStateId ? { countryStateId: values.countryStateId } : {}),
    ...shownAddressFields(values, settings),
  };
}
