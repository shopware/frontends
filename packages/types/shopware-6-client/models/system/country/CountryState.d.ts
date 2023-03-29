import { Country } from "./Country";
import { CountryStateTranslation } from "./CountryStateTranslation";
import { CustomerAddress } from "../../checkout/customer/CustomerAddress";
import { OrderAddress } from "../../checkout/order/OrderAddress";
import { CustomFields } from "../../common/CustomField";

/**
 * @public
 */
export type CountryState = {
  countryId: string;
  shortCode: string;
  name: string | null;
  position: number;
  active: boolean;
  country: Country | null;
  translations: CountryStateTranslation[] | null;
  customerAddresses: CustomerAddress[] | null;
  orderAddresses: OrderAddress[] | null;
  customFields: CustomFields;
};
