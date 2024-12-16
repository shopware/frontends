import type { Schemas } from "#shopware";
import { CustomerAddress } from "../../checkout/customer/CustomerAddress";
import { OrderAddress } from "../../checkout/order/OrderAddress";
import { CustomFields } from "../../common/CustomField";
import { SalesChannel } from "../sales-channel/SalesChannel";
import { CountryState } from "./CountryState";
import { CountryTranslation } from "./CountryTranslation";

type CountryTaxSetting = {
  enabled: boolean;
  currencyId: string;
  amount: number;
  apiAlias: string;
};

/**
 * @deprecated use {@link Schemas['Country']} from "#shopware" import instead
 */
export type Country = Schemas["Country"];
// export type Country = {
//   active: boolean;
//   createdAt: string;
//   customFields: CustomFields | null;
//   name: string | null;
//   iso: string | null;
//   updatedAt: Date | string | null;
//   versionId: string | null;
//   id: string;
//   position: number;
//   taxFree: boolean;
//   shippingAvailable: boolean;
//   iso3: string | null;
//   displayStateInRegistration: boolean;
//   forceStateInRegistration: boolean;
//   translations: CountryTranslation[] | null;
//   orderAddresses: OrderAddress[] | null;
//   customerAddress: CustomerAddress[] | null;
//   salesChannelDefaultAssignments: SalesChannel[] | null;
//   salesChannels: SalesChannel[] | null;
//   extensions: unknown;
//   _uniqueIdentifier: string;
//   translated: {
//     name: string;
//     customFields: CustomFields;
//     addressFormat: string[][];
//   };
//   companyTaxFree: boolean;
//   checkVatIdPattern: boolean;
//   vatIdPattern: string;
//   vatIdRequired: boolean;
//   customerTax: CountryTaxSetting;
//   companyTax: CountryTaxSetting;
//   states: CountryState[];
//   postalCodeRequired: boolean;
//   checkPostalCodePattern: boolean;
//   checkAdvancedPostalCodePattern: boolean;
//   advancedPostalCodePattern: null | string;
//   defaultPostalCodePattern: string;
//   addressFormat: string[][];
//   apiAlias: "country";
// };
