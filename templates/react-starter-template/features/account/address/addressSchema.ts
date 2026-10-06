import { z } from "zod";

import type { Schemas } from "#shopware";

import type { AddressBody } from "./addressApi";

const t = {
  validations: {
    required: "Value is required",
    minLength: "This minimum length should be at least {min}",
    requiredIf: "The value is required",
  },
};

export type AddressValues = {
  salutationId: string;
  firstName: string;
  lastName: string;
  street: string;
  zipcode: string;
  city: string;
  countryId: string;
  countryStateId: string;
};

export type AddressField = keyof AddressValues;

export type AddressErrors = Partial<Record<AddressField, string>>;

export type AddressSchemaOptions = { countryHasStates: boolean };

export const emptyAddressValues: AddressValues = {
  salutationId: "",
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

export function createAddressSchema({
  countryHasStates,
}: AddressSchemaOptions) {
  return z
    .object({
      salutationId: requiredString(),
      firstName: requiredMinLength(2),
      lastName: requiredMinLength(2),
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

function isAddressField(key: PropertyKey | undefined): key is AddressField {
  return typeof key === "string" && Object.hasOwn(emptyAddressValues, key);
}

export function validateAddress(
  values: AddressValues,
  options: AddressSchemaOptions,
): AddressErrors {
  const result = createAddressSchema(options).safeParse(values);
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
    | "zipcode"
    | "city"
    | "countryId"
    | "countryStateId"
  >,
): AddressValues {
  return {
    salutationId: address.salutationId ?? "",
    firstName: address.firstName ?? "",
    lastName: address.lastName ?? "",
    street: address.street ?? "",
    zipcode: address.zipcode ?? "",
    city: address.city ?? "",
    countryId: address.countryId ?? "",
    countryStateId: address.countryStateId ?? "",
  };
}

export function toAddressBody(values: AddressValues): AddressBody {
  return {
    salutationId: values.salutationId,
    firstName: values.firstName,
    lastName: values.lastName,
    street: values.street,
    zipcode: values.zipcode,
    city: values.city,
    countryId: values.countryId,
    ...(values.countryStateId ? { countryStateId: values.countryStateId } : {}),
  };
}
