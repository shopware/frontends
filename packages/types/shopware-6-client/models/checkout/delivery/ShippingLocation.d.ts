import type { Country } from "../../system/country/Country";
import type { CountryState } from "../../system/country/CountryState";
import type { CustomerAddress } from "../customer/CustomerAddress";

/**
 * @public
 */
export type ShippingLocation = {
  country: Country;
  state: CountryState;
  address: CustomerAddress;
};
