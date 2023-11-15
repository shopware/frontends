import { Country } from "../../system/country/Country";
import { CustomFields } from "../../common/CustomField";
import { Salutation } from "../../system/salutation/Salutation";
import type { Schemas } from "#shopware";

/**
 * @public
 */
export type AddressType = "billing" | "shipping";

/**
 * @deprecated use Schemas['CustomerAddress'] from "#shopware" import instead
 */
export type CustomerAddress = Schemas["CustomerAddress"];
// export type CustomerAddress = {
//   customerId?: string;
//   countryId: string;
//   countryStateId?: string | null;
//   salutationId: string;
//   firstName: string;
//   lastName: string;
//   zipcode: string;
//   city: string;
//   company?: string | null;
//   department?: string | null;
//   title?: string | null;
//   street: string;
//   vatId?: string | null;
//   phoneNumber?: string | null;
//   additionalAddressLine1?: string;
//   additionalAddressLine2?: string;
//   country?: Country;
//   countryState?: CountryState;
//   salutation?: Salutation | null;
//   customer?: string;
//   customFields?: CustomFields;
//   id: string;
// };
