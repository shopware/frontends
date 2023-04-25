import { CountryState } from "./CountryState";
import { CountryTranslation } from "./CountryTranslation";
import { OrderAddress } from "../../checkout/order/OrderAddress";
import { CustomerAddress } from "../../checkout/customer/CustomerAddress";
import { SalesChannel } from "../sales-channel/SalesChannel";
import { CustomFields } from "../../common/CustomField";

type CountryTaxSetting = {
  enabled: boolean;
  currencyId: string;
  amount: number;
  apiAlias: string;
};

/**
 * @public
 */
export type Country = {
  active: boolean;
  createdAt: string;
  customFields: CustomFields | null;
  name: string | null;
  iso: string | null;
  translated: any;
  updatedAt: string | null;
  versionId: string | null;
  id: string;
  position: number;
  taxFree: boolean;
  shippingAvailable: boolean;
  iso3: string | null;
  displayStateInRegistration: boolean;
  forceStateInRegistration: boolean;
  states: CountryState[] | null;
  translations: CountryTranslation[] | null;
  orderAddresses: OrderAddress[] | null;
  customerAddress: CustomerAddress[] | null;
  salesChannelDefaultAssignments: SalesChannel[] | null;
  salesChannels: SalesChannel[] | null;
  extensions: unknown;
  _uniqueIdentifier: string;
  translated: {
    name: string;
    customFields: unknown;
    addressFormat: string[][];
  };
  companyTaxFree: boolean;
  checkVatIdPattern: boolean;
  vatIdPattern: string;
  vatIdRequired: boolean;
  customerTax: CountryTaxSetting;
  companyTax: CountryTaxSetting;
  states: CountryState[];
  postalCodeRequired: boolean;
  checkPostalCodePattern: boolean;
  checkAdvancedPostalCodePattern: boolean;
  advancedPostalCodePattern: null | string;
  defaultPostalCodePattern: string;
  addressFormat: string[][];
  apiAlias: "country";
};
