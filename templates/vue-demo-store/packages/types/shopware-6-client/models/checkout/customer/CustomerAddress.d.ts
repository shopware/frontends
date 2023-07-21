import { Country } from "../../system/country/Country";
import { CustomField } from "../../common/CustomField";
import { Salutation } from "../../system/salutation/Salutation";

/**
 * @public
 */
export type AddressType = "billing" | "shipping";

/**
 * @public
 */
export type CustomerAddress = {
  customerId?: string;
  countryId: string;
  countryStateId?: string | null;
  salutationId: string;
  firstName: string;
  lastName: string;
  zipcode: string;
  city: string;
  company?: string | null;
  department?: string | null;
  title?: string | null;
  street: string;
  vatId?: string | null;
  phoneNumber?: string | null;
  additionalAddressLine1?: string;
  additionalAddressLine2?: string;
  country?: Country;
  countryState?: string;
  salutation?: Salutation | null;
  customer?: string;
  customFields?: CustomField;
  id: string;
};
